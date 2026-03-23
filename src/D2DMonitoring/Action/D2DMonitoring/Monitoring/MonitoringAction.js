import dayjs from "dayjs";
import { 
    getWardDutyOnTimeFromDB, 
    getWorkerDetailsFromDB, 
    getEmployeeGeneralDetailsFromDB, 
    subscribeWorkerDetailsFromDB,
    getDutyInImageFromStorage,
    getWardReachedTimeFromDB,
    getWardDutyOffTimeFromDB,
    getDutyOffImageFromStorage,
    getEmployeeAllDetailsFromDB,
    getHelperDummyFlagFromDB,
} from "../../../Services/D2DMonitoringService/D2DMonitoringDutyIn";
import { getWardLineStatus, subscribeWardLineStatus } from "../../../Services/MapSectionService/MapSectionService";
import { calculateWardLineLengthInMeter, getTotalExperience } from "../../../../common/common";
 
export const getDutyInImage = async (city, wardId, setImageUrl) => {
    try {
        console.log("[Action] Fetching Duty In Image for:", { city, wardId });
        
        const tryFetch = async (targetDay) => {
            return await getDutyInImageFromStorage(
                city, wardId, 
                targetDay.format("YYYY"), 
                targetDay.format("MMMM"), 
                targetDay.format("YYYY-MM-DD")
            );
        };

        const today = dayjs();
        let url = await tryFetch(today);
        
        // Fallback for night shifts spanning over midnight
        if (!url) {
            url = await tryFetch(today.subtract(1, "day"));
        }
        
        console.log("[Action] Final Duty In Image URL:", url);
        setImageUrl(url);
    } catch (error) {
        console.error("Error fetching Duty In Image:", error);
        setImageUrl(null);
    }
};

export const getDutyOffImage = async (city, wardId, setImageUrl) => {
    try {
        console.log("[Action] Fetching Duty Off Image for:", { city, wardId });
        
        const tryFetch = async (targetDay) => {
            return await getDutyOffImageFromStorage(
                city, wardId, 
                targetDay.format("YYYY"), 
                targetDay.format("MMMM"), 
                targetDay.format("YYYY-MM-DD")
            );
        };

        const today = dayjs();
        let url = await tryFetch(today);
        
        if (!url) {
            url = await tryFetch(today.subtract(1, "day"));
        }
        
        console.log("[Action] Final Duty Off Image URL:", url);
        setImageUrl(url);
    } catch (error) {
        console.error("Error fetching Duty Off Image:", error);
        setImageUrl(null);
    }
};

export const getWardReachedTime = (ward, setWardReachedTime) => {
    try {
        const year = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const day = dayjs().format("YYYY-MM-DD");

        getWardReachedTimeFromDB(year, month, day, ward).then((response) => {
            if (response.status === "Success") {
                setWardReachedTime(response.data || "");
            } else {
                setWardReachedTime("");
            };
        });
    } catch (error) {
        console.error("Error fetching Ward Reached Time: ", error);
        setWardReachedTime("");
    };
};

export const getDutyOffTime = (ward, setDutyOffTime) => {
    try {
        const year = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const day = dayjs().format("YYYY-MM-DD");

        getWardDutyOffTimeFromDB(year, month, day, ward).then((response) => {
            if (response.status === "Success") {
                setDutyOffTime(response.data || "");
            } else {
                setDutyOffTime("");
            };
        });
    } catch (error) {
        console.error("Error fetching Duty Off Time: ", error);
        setDutyOffTime("");
    };
};

export const getDutyInTime = (ward, setShowDutyInTime) => {
    try {
        const year = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const day = dayjs().format("YYYY-MM-DD");

        getWardDutyOnTimeFromDB(year, month, day, ward).then((response) => {
            if (response.status === "Success") {
                const data = response.data;
                // If dutyInTime contains multiple records (object), join all values with ", "
                if (data && typeof data === "object" && !Array.isArray(data)) {
                    const values = Object.values(data).filter(Boolean);
                    setShowDutyInTime(values.length > 0 ? values.join(", ") : "");
                } else if (Array.isArray(data)) {
                    setShowDutyInTime(data.filter(Boolean).join(", "));
                } else {
                    setShowDutyInTime(data || "");
                }
            } else {
                setShowDutyInTime("");
            };
        });
    } catch (error) {
        console.error("Error fetching Duty In Time: ", error);
        setShowDutyInTime("");
    };
};

const toSafeObject = (value) => (value && typeof value === "object" ? value : {});
const toFiniteNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};
const normalizeStatus = (value = "") => String(value).trim().toLowerCase().replace(/[\s_-]+/g, "");
const COMPLETED_STATUSES = new Set(["linecompleted", "completed", "done"]);

export const hasWardStatusCache = (lineStatusByWard, wardId) => {
    const status = toSafeObject(lineStatusByWard)?.[wardId];
    return status && typeof status === "object" && Object.keys(status).length > 0;
};

export const getCurrentWardLineStatus = (lineStatusByWard, wardId) => (
    toSafeObject(lineStatusByWard)?.[wardId] || {}
);

export const fetchWardLineStatusCacheForToday = async (wardList = []) => {
    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");

    const batchSize = 10;
    const entries = [];
    
    for (let i = 0; i < wardList.length; i += batchSize) {
        const batch = wardList.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(async (ward) => {
                const wardId = ward?.id;
                if (!wardId) return { wardId, statusByLine: {} };
                try {
                    const resp = await getWardLineStatus(wardId, year, month, date);
                    return {
                        wardId,
                        statusByLine: resp?.status === "success" ? (resp?.data || {}) : {},
                    };
                } catch (e) {
                    return { wardId, statusByLine: {} };
                }
            })
        );
        entries.push(...batchResults);
    }

    const statusByWard = {};
    entries.forEach(({ wardId, statusByLine }) => {
        if (wardId && statusByLine && typeof statusByLine === "object" && Object.keys(statusByLine).length > 0) {
            statusByWard[wardId] = statusByLine;
        }
    });

    return statusByWard;
};

export const fetchSingleWardLineStatusForToday = async (wardId) => {
    if (!wardId) return null;
    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");

    const resp = await getWardLineStatus(wardId, year, month, date);
    if (resp?.status !== "success" || !resp?.data || typeof resp.data !== "object") return null;
    return Object.keys(resp.data).length > 0 ? resp.data : null;
};

/**
 * Firebase onValue subscription — fires instantly from cache, then realtime.
 * Returns unsubscribe; call in useEffect cleanup.
 */
export const subscribeWardLineStatusForToday = (wardId, onUpdate) => {
    if (!wardId) return () => {};
    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");
    return subscribeWardLineStatus(wardId, year, month, date, onUpdate);
};

export const getWardLengthMetrics = (selectedWardLineGeoJson) => {
    if (!selectedWardLineGeoJson) return { totalMeter: 0, lineLengthMeterById: {} };

    // Custom format: { "1": { points: [[lat,lng],...] }, "2": {...}, ... }
    if (typeof selectedWardLineGeoJson === "object" && !Array.isArray(selectedWardLineGeoJson) && !selectedWardLineGeoJson.type) {
        const numericKeys = Object.keys(selectedWardLineGeoJson).filter((key) => !isNaN(key));
        if (numericKeys.length > 0) {
            const lineLengthMeterById = {};
            let totalMeter = 0;
            numericKeys.forEach((key) => {
                const points = selectedWardLineGeoJson[key]?.points;
                if (!Array.isArray(points) || points.length < 2) { lineLengthMeterById[key] = 0; return; }
                // Custom format is [lat, lng]; GeoJSON coordinates are [lng, lat]
                const feature = {
                    type: "Feature",
                    geometry: { type: "LineString", coordinates: points.map(([lat, lng]) => [lng, lat]) },
                };
                const lengthInMeter = Math.max(toFiniteNumber(
                    calculateWardLineLengthInMeter({ type: "FeatureCollection", features: [feature] }), 0
                ), 0);
                lineLengthMeterById[key] = lengthInMeter;
                totalMeter += lengthInMeter;
            });
            return { totalMeter: Math.max(totalMeter, 0), lineLengthMeterById };
        }
    }

    // GeoJSON FeatureCollection
    const allFeatures = Array.isArray(selectedWardLineGeoJson?.features) ? selectedWardLineGeoJson.features : [];
    if (!allFeatures.length) return { totalMeter: 0, lineLengthMeterById: {} };

    const lineLengthMeterById = {};
    let totalMeter = 0;

    allFeatures.forEach((feature, index) => {
        const lineId = String(index + 1);
        const featureLengthInMeter = calculateWardLineLengthInMeter({
            type: "FeatureCollection",
            features: [feature],
        });
        const safeLengthInMeter = Math.max(toFiniteNumber(featureLengthInMeter, 0), 0);
        lineLengthMeterById[lineId] = safeLengthInMeter;
        totalMeter += safeLengthInMeter;
    });

    return { totalMeter: Math.max(totalMeter, 0), lineLengthMeterById };
};

export const getCompletedLengthKm = (currentWardLineStatus, wardLengthMetrics) => {
    const lineLengthMeterById = wardLengthMetrics?.lineLengthMeterById || {};
    let completedMeter = 0;

    Object.entries(lineLengthMeterById).forEach(([lineId, lineLengthInMeter]) => {
        const status = normalizeStatus(currentWardLineStatus?.[lineId]);
        if (COMPLETED_STATUSES.has(status)) {
            completedMeter += Math.max(toFiniteNumber(lineLengthInMeter, 0), 0);
        }
    });

    return Math.max(completedMeter / 1000, 0);
};

export const getLineCounts = (wardLengthMetrics, currentWardLineStatus) => {
    const lineIds = Object.keys(wardLengthMetrics?.lineLengthMeterById || {});
    const total = lineIds.length;
    let completed = 0;
    let skipped = 0;
    lineIds.forEach((lineId) => {
        const status = normalizeStatus(currentWardLineStatus?.[lineId]);
        if (COMPLETED_STATUSES.has(status)) completed++;
        else if (status === "skipped") skipped++;
    });
    return { total, completed, skipped, pending: Math.max(total - completed - skipped, 0) };
};

export const getTotalWardLengthKm = (wardLengthMetrics, selectedWardLengthInMeter) => {
    const staticTotalKm = Math.max(toFiniteNumber(wardLengthMetrics?.totalMeter, 0) / 1000, 0);
    if (staticTotalKm > 0) return staticTotalKm;
    return Math.max(toFiniteNumber(selectedWardLengthInMeter, 0) / 1000, 0);
};

export const getZoneCoveragePercent = (completedLengthKm, totalWardLengthKm) => {
    const safeTotal = Math.max(toFiniteNumber(totalWardLengthKm, 0), 0);
    const safeCompleted = Math.max(toFiniteNumber(completedLengthKm, 0), 0);
    if (safeTotal <= 0) return 0;
    const rawPercent = (safeCompleted / safeTotal) * 100;
    return Math.max(0, Math.min(100, Math.round(rawPercent)));
};

export const getRemainingLengthKm = (totalWardLengthKm, completedLengthKm) => (
    Math.max(
        Math.max(toFiniteNumber(totalWardLengthKm, 0), 0) -
        Math.min(Math.max(toFiniteNumber(completedLengthKm, 0), 0), Math.max(toFiniteNumber(totalWardLengthKm, 0), 0)),
        0
    )
);

export const buildCoverageStateItems = ({ isWardMetricsLoading, zoneCoveragePercent, totalWardLengthKm, completedLengthKm, remainingLengthKm }) => ([
    {
        variant: "coverageProgress",
        label: "Zone Coverage",
        liveTag: isWardMetricsLoading ? "UPDATING..." : "LIVE TRACKING",
        graphPercent: Math.max(0, Math.min(100, toFiniteNumber(zoneCoveragePercent, 0))),
        percentText: `${Math.max(0, Math.min(100, toFiniteNumber(zoneCoveragePercent, 0)))}`,
        totalLabel: "TOTAL LENGTH",
        completedLabel: "COMPLETED",
        totalValue: `${Math.max(toFiniteNumber(totalWardLengthKm, 0), 0).toFixed(2)} km`,
        completedValue: `${Math.max(toFiniteNumber(completedLengthKm, 0), 0).toFixed(2)} km`,
        remainingValue: `${Math.max(toFiniteNumber(remainingLengthKm, 0), 0).toFixed(2)} km`,
        color: "#3f5efb",
    },
]);

const normalizeLineStatus = (status = "") => String(status).trim().toLowerCase();
export const getLineColorByStatus = (status, DEFAULT_LINE_STYLE) => {
    const normalizedStatus = normalizeLineStatus(status);
    if (normalizedStatus === "linecompleted") return "#22c55e";
    if (normalizedStatus === "skipped") return "#ef4444";
    return DEFAULT_LINE_STYLE.strokeColor;
};

// Removes comma-duplicated values e.g. "TATA-1816,TATA-1816" → "TATA-1816"
const cleanField = (val) => {
    if (!val) return "";
    const parts = String(val).split(",").map(s => s.trim()).filter(Boolean);
    return [...new Set(parts)][0] || "";
};

const toTitleCase = (str) =>
    String(str || "").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

/**
 * Handles all common date formats:
 *   YYYY-MM-DD / YYYY/MM/DD  → ISO (standard)
 *   DD-MM-YYYY / DD/MM/YYYY  → Indian format (most common in Indian HRMS)
 *   fallback                 → native Date parse
 */
const parseDojDate = (str) => {
    if (!str) return null;
    const s = String(str).trim();
    if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(s)) return new Date(s.replace(/\//g, "-"));
    const m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`);  // DD-MM-YYYY → YYYY-MM-DD
    return new Date(s);
};

const calcExperience = (doj) => {
    if (!doj) return "-";
    const joined = parseDojDate(doj);
    if (!joined || isNaN(joined)) return "-";
    const diff = Date.now() - joined.getTime();
    if (diff < 0) return "-";
    const days   = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30.44);
    const years  = Math.floor(days / 365.25);
    if (years  >= 1) return `${years} yr${years  > 1 ? "s" : ""}`;
    if (months >= 1) return `${months} mo`;
    return `${days} day${days !== 1 ? "s" : ""}`;
};

const DATE_RE = /^\d{4}[-/]\d{2}[-/]\d{2}$|^\d{2}[-/]\d{2}[-/]\d{4}$/;

/**
 * Searches a flat object for the best date to use as experience start.
 * Priority: dateOfRejoining (if present) → dateOfJoining → other join-like keys
 */
const findDojInObject = (obj) => {
    if (!obj || typeof obj !== "object") return "";

    // 1. Highest priority — rejoining date
    const rejoinKeys = ["dateOfRejoining", "dateofRejoining", "rejoiningDate", "rejoinDate", "reJoiningDate"];
    for (const k of rejoinKeys) {
        if (obj[k]) return String(obj[k]);
    }

    // 2. Standard joining date
    const joinKeys = ["dateOfJoining", "dateofJoining", "joiningDate", "joinDate", "doj", "DOJ"];
    for (const k of joinKeys) {
        if (obj[k]) return String(obj[k]);
    }

    // 3. Keyword scan fallback — any key containing "rejoin" first, then "join"
    for (const k of Object.keys(obj)) {
        if (k.toLowerCase().includes("rejoin") && obj[k]) return String(obj[k]);
    }
    for (const k of Object.keys(obj)) {
        const lower = k.toLowerCase();
        if ((lower.includes("join") || lower.includes("hire") || lower.includes("appoint")) && obj[k]) return String(obj[k]);
    }
    // 2. scan string values that look like a past date
    for (const k of Object.keys(obj)) {
        const val = obj[k];
        if (typeof val !== "string") continue;
        if (!DATE_RE.test(val.trim())) continue;
        const parsed = new Date(val);
        if (!isNaN(parsed) && parsed < new Date()) return val;
    }
    return "";
};

/**
 * Searches the full employee record (all sub-nodes) for DOJ.
 * fullEmp shape: { GeneralDetails: {...}, OfficialDetails: {...}, ... }
 */
const getDojFromFullEmployee = (fullEmp) => {
    if (!fullEmp || typeof fullEmp !== "object") return "";
    // Try each sub-node in priority order
    const priority = ["OfficialDetails", "GeneralDetails", "PersonalDetails", "EmploymentDetails", "BasicDetails"];
    for (const node of priority) {
        if (fullEmp[node]) {
            const found = findDojInObject(fullEmp[node]);
            if (found) return found;
        }
    }
    // Fall back: search remaining sub-nodes we haven't tried yet
    for (const node of Object.keys(fullEmp)) {
        if (priority.includes(node)) continue;
        if (typeof fullEmp[node] === "object") {
            const found = findDojInObject(fullEmp[node]);
            if (found) return found;
        }
    }
    return "";
};

/**
 * Extracts display fields from the full employee record.
 * Always reads GeneralDetails for name/mobile/photo.
 * DOJ is searched across all sub-nodes.
 */
const extractEmployeeDisplay = (fullEmp) => {
    const g = fullEmp?.GeneralDetails || {};
    return {
        name:         g.name || g.fullName || g.employeeName || "",
        mobile:       g.mobile || g.phone || g.mobileNumber || "",
        profilePhotoURL: g.profilePhotoURL || g.profileImage || g.photo || null,
        _doj:         getDojFromFullEmployee(fullEmp),   // internal — used by buildWorkerState
    };
};

/** Returns true if name contains "(c)" or "(C)" anywhere */
const hasCTag = (name = "") => /\(c\)/i.test(name);

const buildWorkerState = (driverEmp, helperEmp, vehicle, helperIsDummyFlag = null) => {
    const rawHelperName = helperEmp.name || "";
    const helperHasCTag = hasCTag(rawHelperName);
    const helperIsDummy = Number(helperIsDummyFlag) === 1;

    return {
        captain: {
            name:         toTitleCase(driverEmp.name || ""),
            phone:        driverEmp.mobile || "",
            profileImage: driverEmp.profilePhotoURL || null,
            experience:   calcExperience(driverEmp._doj || ""),
        },
        pilot: {
            name:         toTitleCase(rawHelperName),
            phone:        helperEmp.mobile || "",
            profileImage: helperEmp.profilePhotoURL || null,
            experience:   calcExperience(helperEmp._doj || ""),
            isDummy:      helperIsDummy,
            hasCTag:      helperHasCTag,
            noHelper:     helperIsDummy && helperHasCTag,
            nameRed:      !helperIsDummy && helperHasCTag,
        },
        vehicle,
    };
};

// ── In-memory caches (cleared on page reload, valid for the day) ──────────
const workerCache = new Map();  // key: `${wardId}-${date}`  → raw WorkerDetails
const empCache    = new Map();  // key: employeeId           → GeneralDetails

const getCachedEmployee = async (empId) => {
    if (!empId) return { name: "", mobile: "", profilePhotoURL: null, _doj: "" };
    if (empCache.has(empId)) return empCache.get(empId);

    // Fetch full employee record so DOJ can be found in any sub-node
    const resp = await getEmployeeAllDetailsFromDB(empId);
    const fullEmp = resp?.status === "Success" ? resp.data : null;

    const display = fullEmp && Object.keys(fullEmp).length > 0
        ? extractEmployeeDisplay(fullEmp)
        : { name: "", mobile: "", profilePhotoURL: null, _doj: "" };

    // Only cache non-empty results so failures are retried
    if (display.name || display.mobile) {
        empCache.set(empId, display);
    }
    return display;
};

/**
 * Subscribes to WorkerDetails with onValue — fires instantly from Firebase's
 * in-memory cache on every revisit, no network round-trip needed.
 * Returns unsubscribe; call it in useEffect cleanup.
 */
export const subscribeWorkerDetails = (wardId, setWorkers) => {
    const year  = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const day   = dayjs().format("YYYY-MM-DD");

    const unsubscribe = subscribeWorkerDetailsFromDB(year, month, day, wardId, async (raw) => {
        const driverId = cleanField(raw.driver);
        const helperId = cleanField(raw.helper);

        const [driverDetails, helperDetails, helperDummyFlag] = await Promise.all([
            getCachedEmployee(driverId),
            getCachedEmployee(helperId),
            getHelperDummyFlagFromDB(helperId),
        ]);

        setWorkers(buildWorkerState(driverDetails, helperDetails, cleanField(raw.vehicle), helperDummyFlag));
    });

    return unsubscribe;
};

export const getWorkerDetails = async (wardId, setWorkers) => {
    try {
        const year  = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const day   = dayjs().format("YYYY-MM-DD");
        const cacheKey = `${wardId}-${day}`;

        // ── Serve from cache instantly, then refresh in background ──────────
        if (workerCache.has(cacheKey)) {
            const cached = workerCache.get(cacheKey);
            setWorkers(cached);  // instant render from cache
        }

        // Always fetch fresh in background (updates cache for next switch)
        const workerResp = await getWorkerDetailsFromDB(year, month, day, wardId);
        if (workerResp.status !== "Success") return;

        const raw      = workerResp.data;
        const driverId = cleanField(raw.driver);
        const helperId = cleanField(raw.helper);

        const [driverDetails, helperDetails] = await Promise.all([
            getCachedEmployee(driverId),
            getCachedEmployee(helperId),
        ]);

        const workers = buildWorkerState(driverDetails, helperDetails, cleanField(raw.vehicle));
        workerCache.set(cacheKey, workers);
        setWorkers(workers);
    } catch (error) {
        console.error("Error in getWorkerDetails:", error);
    }
};
