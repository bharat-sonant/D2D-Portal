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


const fetchVehicleRegNo = async (vehicleStr) => {
    if (!vehicleStr) return null;
    const ids = [...new Set(vehicleStr.split(',').map(v => v.trim()).filter(Boolean))];
    const regNos = await Promise.all(
        ids.map(async id => {
            try {
                const regNo = await db.getData(`VehicleDetails/${id}/regNumber`);
                return regNo || null;
            } catch {
                return null;
            }
        })
    );
    const valid = regNos.filter(Boolean);
    return valid.length ? valid.join(', ') : null;
};

const buildRow = (wardId, zone, summary, workerDetails, vehicleRegNo = null, tripBins = null, runKm = null) => {
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
    driver:               workerDetails?.driverName            ?? null,
    helper:               workerDetails?.helperName            ?? null,
    secondHelper:         workerDetails?.secondHelperName      ?? null,
    remark:               summary?.workPercentageRemark                           ?? null,
    actualWorkPercentage: summary?.workPercentage       != null ? Math.round(Number(summary.workPercentage))        : null,
    workPercentage:       summary?.updatedWorkPercentage != null ? Math.round(Number(summary.updatedWorkPercentage)) : null,
    zoneRunKm:            summary?.wardCoveredDistance  != null ? Number((Number(summary.wardCoveredDistance) / 1000).toFixed(3)) : null,
    };
};

// 3 reads per ward: Summary + WorkerDetails + WardTrips (parallel)
export const fetchReportData = async (wards, date) => {
    console.log(`[DWR Firebase] date=${date} | wards=${wards.length} | Firebase reads=${wards.length * 3}`);
    const t0 = performance.now();

    const rows = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const [summary, workerDetails, tripsData, locationData] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    db.getData(getWorkerDetailsPath(id, date)),
                    db.getData(getWardTripsPath(id, date)),
                    db.getData(getLocationHistoryPath(id, date)),
                ]);
                const vehicleRegNo = await fetchVehicleRegNo(workerDetails?.vehicle);
                const tripBins     = tripsData ? Object.keys(tripsData).length : null;
                const runKm        = calculateRunKm(locationData);
                return buildRow(id, name, summary, workerDetails, vehicleRegNo, tripBins, runKm);
            } catch {
                return buildRow(id, name, null, null);
            }
        })
    );

    const withData = rows.filter(r =>
        r.dutyOn || r.dutyOff || r.enteredWardBoundary ||
        r.vehicle || r.driver || r.helper ||
        r.remark || r.actualWorkPercentage != null || r.workPercentage != null
    );

    const sizeKB = (new TextEncoder().encode(JSON.stringify(withData)).length / 1024).toFixed(1);
    console.log(`[DWR Firebase] Done in ${(performance.now() - t0).toFixed(0)}ms | zones with data=${withData.length}/${rows.length} | ~${sizeKB} KB`);

    return withData;
};
