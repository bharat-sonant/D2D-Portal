import * as db from '../../../services/dbServices';

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

const getSummaryPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WasteCollectionInfo/${wardId}/${year}/${month}/${date}/Summary`;
};

export const scanDailyWorkTasks = async (date) => {
    try {
        const [year, monthNum] = date.split('-');
        const month = MONTHS[Number(monthNum) - 1];
        const path = `DailyWorkDetail/${year}/${month}/${date}`;
        const data = await db.getData(path);
        if (data) {
            for (const [id, userNode] of Object.entries(data)) {
                if (typeof userNode === 'object' && userNode !== null) {
                    for (const [key, val] of Object.entries(userNode)) {
                        if (key.startsWith('task') && val && val.task !== undefined && val.binLiftingPlanId) {
                            const isNum = !isNaN(val.task) && String(val.task).trim() !== '';
                            if (!isNum) {
                                console.log("hello Task", val.task);
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error scanning daily work tasks:", err);
    }
};

const getWorkerDetailsPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WasteCollectionInfo/${wardId}/${year}/${month}/${date}/WorkerDetails`;
};

const getWardTripsPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WardTrips/${year}/${month}/${date}/${wardId}`;
};

const getLocationHistoryPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `LocationHistory/${wardId}/${year}/${month}/${date}`;
};

const getHaltInfoPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `HaltInfo/${wardId}/${year}/${month}/${date}`;
};

// "HH:mm:ss" ya "HH:mm" → Date object for comparison
const parseTimeToDate = (timeStr, dateStr) => {
    if (!timeStr) return null;
    const [h, m, s = 0] = String(timeStr).split(':').map(Number);
    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(h, m, s, 0);
    return d;
};

const TODAY = () => new Date().toISOString().split('T')[0];

// Spec ke rules follow karte hue valid halt time calculate karo (minutes → "X.XX hr")
const calculateHaltTime = (haltData, dutyOn, dutyOff, date, minHaltTime = 0) => {
    if (!haltData || !dutyOn) return null;

    const isToday   = date === TODAY();
    const dutyStart = parseTimeToDate(dutyOn, date);
    const dutyEnd   = dutyOff ? parseTimeToDate(dutyOff, date) : null;

    if (!dutyStart) return null;
    if (!isToday && !dutyEnd) return null;

    let totalMinutes = 0;

    for (const [timeKey, halt] of Object.entries(haltData)) {
        // Rule 2: network-off skip | location field missing/null/false ho toh skip
        // (Real data mein location = "lat/lng: (lat,lng)" string hoti hai — non-empty string truthy hai)
        if (halt?.haltType === 'network-off') continue;
        if (!halt?.location) continue;

        // Rule 3: time window filter
        const haltStart = parseTimeToDate(timeKey, date);
        if (!haltStart) continue;

        if (isToday) {
            if (haltStart < dutyStart) continue;
        } else {
            if (haltStart < dutyStart || haltStart > dutyEnd) continue;
        }

        // Rule 4: duration — endTime se dutyOut cross ho toh adjust karo
        let duration = Number(halt?.duration);
        if (!duration || duration <= 0) continue;

        if (halt.endTime && dutyEnd) {
            const haltEnd = parseTimeToDate(halt.endTime, date);
            if (haltEnd && haltEnd > dutyEnd) {
                const adjustedMin = (dutyEnd - haltStart) / 60000;
                if (adjustedMin <= 0) continue;
                duration = adjustedMin;
            }
        }

        // Rule 5: minimum halt filter — 8 min ya usse zyada ho tabhi count karo
        if (duration < minHaltTime) continue;

        totalMinutes += duration;
    }

    if (totalMinutes === 0) return null;

    // Rule 7: minutes → numeric hours (e.g. 1.25)
    // Display formatting ("1.25 hr") JSX mein hota hai — Supabase numeric column ke liye sirf number
    return Number((totalMinutes / 60).toFixed(2));
};

const calculateRunKm = (locationData) => {
    if (!locationData) return null;

    // Step 1: Reverse karo
    const reversed = [...Object.keys(locationData)].reverse();

    // Step 2: Dedup — "10:05-1" aur "10:05-2" same base time hai, ek rakho
    const deduped = [];
    for (let i = 0; i < reversed.length; i++) {
        const base     = reversed[i].split('-')[0];
        const nextBase = reversed[i + 1]?.split('-')[0];
        deduped.push(reversed[i]);
        if (base === nextBase) i++;
    }

    // Step 3: Chronological order wapas
    const keys = deduped.reverse();

    // Step 4: Saare distances sum karo
    let totalMeters = 0;
    for (const key of keys) {
        const dist = locationData[key]?.['distance-in-meter'];
        if (dist != null) totalMeters += Number(dist);
    }

    return totalMeters > 0 ? Number((totalMeters / 1000).toFixed(3)) : null;
};


const timeToMinutes = (t) => {
    if (!t) return null;
    const parts = String(t).split(':').map(Number);
    return parts[0] * 60 + (parts[1] || 0);
};

const calcWorkingHrs = (dutyOn, dutyOff) => {
    const start = timeToMinutes(dutyOn);
    const end   = timeToMinutes(dutyOff);
    if (start === null || end === null || end <= start) return null;
    return Number(((end - start) / 60).toFixed(2));
};

const normalizeTime = (value, mode = "first") => {
    if (!value) return null;
    const arr = Array.isArray(value)
        ? value
        : String(value).split(",").map(t => t.trim()).filter(Boolean);
    if (!arr.length) return null;
    return mode === "last" ? arr[arr.length - 1] : arr[0];
};


// Session-level cache — vehicle reg numbers don't change, no need to re-fetch
const vehicleRegNoCache = new Map();

const fetchVehicleRegNo = async (vehicleStr) => {
    if (!vehicleStr) return null;
    const ids = [...new Set(vehicleStr.split(',').map(v => v.trim()).filter(Boolean))];
    const regNos = await Promise.all(
        ids.map(async id => {
            if (vehicleRegNoCache.has(id)) return vehicleRegNoCache.get(id);
            try {
                const regNo = await db.getData(`VehicleDetails/${id}/regNumber`);
                const result = regNo || null;
                vehicleRegNoCache.set(id, result);
                return result;
            } catch {
                return null;
            }
        })
    );
    const valid = regNos.filter(Boolean);
    return valid.length ? valid.join(', ') : null;
};

const buildRow = (wardId, zone, summary, workerDetails, vehicleRegNo = null, tripBins = null, runKm = null, haltDuration = null) => {
    const dutyOn  = normalizeTime(summary?.dutyInTime,  "first");
    const dutyOff = normalizeTime(summary?.dutyOutTime, "last");
    return {
    wardId,
    zone,
    dutyOn,
    enteredWardBoundary:  normalizeTime(summary?.wardReachedOn, "first"),
    dutyOff,
    totalWorkingHrs:      calcWorkingHrs(dutyOn, dutyOff),
    vehicle:              workerDetails?.vehicle               ?? null,
    vehicleRegNo,
    tripBins,
    runKm,
    haltDuration,
    driver:               workerDetails?.driverName            ?? null,
    helper:               workerDetails?.helperName            ?? null,
    secondHelper:         workerDetails?.secondHelperName      ?? null,
    remark:               summary?.workPercentageRemark                           ?? null,
    actualWorkPercentage: summary?.workPercentage       != null ? Math.round(Number(summary.workPercentage))        : null,
    workPercentage:       summary?.updatedWorkPercentage != null ? Math.round(Number(summary.updatedWorkPercentage)) : null,
    zoneRunKm:            summary?.wardCoveredDistance  != null ? Number((Number(summary.wardCoveredDistance) / 1000).toFixed(3)) : null,
    };
};

const hasRowData = (r) =>
    r.dutyOn || r.dutyOff || r.enteredWardBoundary ||
    r.vehicle || r.driver || r.helper ||
    r.remark || r.actualWorkPercentage != null || r.workPercentage != null;

// 5 reads per ward: Summary + WorkerDetails + WardTrips + LocationHistory + HaltInfo (all parallel)
// onRow: optional — called as each ward's data arrives (for progressive rendering on first load)
export const fetchReportData = async (wards, date, onRow) => {
    console.log(`[DWR Firebase] date=${date} | wards=${wards.length} | Firebase reads=${wards.length * 5}`);
    const t0 = performance.now();

    // Call the requested scan function in the background
    scanDailyWorkTasks(date);

    const rows = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const [summary, workerDetails, tripsData, locationData, haltData] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    db.getData(getWorkerDetailsPath(id, date)),
                    db.getData(getWardTripsPath(id, date)),
                    db.getData(getLocationHistoryPath(id, date)),
                    db.getData(getHaltInfoPath(id, date)),
                ]);
                const dutyOn       = normalizeTime(summary?.dutyInTime,  "first");
                const dutyOff      = normalizeTime(summary?.dutyOutTime, "last");
                const vehicleRegNo = await fetchVehicleRegNo(workerDetails?.vehicle);
                const tripBins     = tripsData ? Object.keys(tripsData).length : null;
                const runKm        = calculateRunKm(locationData);
                const haltDuration = calculateHaltTime(haltData, dutyOn, dutyOff, date, 8);
                const row = buildRow(id, name, summary, workerDetails, vehicleRegNo, tripBins, runKm, haltDuration);
                
                if (onRow && hasRowData(row)) onRow(row);
                return row;
            } catch {
                return buildRow(id, name, null, null);
            }
        })
    );

    const withData = rows.filter(hasRowData);

    const sizeKB = (new TextEncoder().encode(JSON.stringify(withData)).length / 1024).toFixed(1);
    console.log(`[DWR Firebase] Done in ${(performance.now() - t0).toFixed(0)}ms | zones with data=${withData.length}/${rows.length} | ~${sizeKB} KB`);

    return withData;
};
