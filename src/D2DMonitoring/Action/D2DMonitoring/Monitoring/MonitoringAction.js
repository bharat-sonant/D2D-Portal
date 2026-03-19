import dayjs from "dayjs";
import { getWardDutyOnTimeFromDB, getWorkerDetailsFromDB, getEmployeeGeneralDetailsFromDB, subscribeWorkerDetailsFromDB } from "../../../Services/D2DMonitoringService/D2DMonitoringDutyIn"
import { getWardLineStatus, subscribeWardLineStatus } from "../../../Services/MapSectionService/MapSectionService";
import { calculateWardLineLengthInMeter, getTotalExperience } from "../../../../common/common";

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

    const entries = await Promise.all(
        wardList.map(async (ward) => {
            const wardId = ward?.id;
            if (!wardId) return { wardId, statusByLine: {} };
            const resp = await getWardLineStatus(wardId, year, month, date);
            return {
                wardId,
                statusByLine: resp?.status === "success" ? (resp?.data || {}) : {},
            };
        })
    );

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

const calcExperience = (doj) => {
    if (!doj) return "-";
    const joined = new Date(doj);
    if (isNaN(joined)) return "-";
    const diff   = Date.now() - joined.getTime();
    const days   = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30.44);
    const years  = Math.floor(days / 365.25);
    if (years  >= 1) return `${years} yr${years  > 1 ? "s" : ""}`;
    if (months >= 1) return `${months} mo`;
    return `${days} day${days !== 1 ? "s" : ""}`;
};

const getDoj = (d) =>
    d?.doj || d?.dateOfJoining || d?.joiningDate || d?.DOJ || d?.JoiningDate || d?.date_of_joining || "";

const buildWorkerState = (driverDetails, helperDetails, vehicle) => ({
    captain: {
        name:         toTitleCase(driverDetails?.name || ""),
        phone:        driverDetails?.mobile || "",
        profileImage: driverDetails?.profilePhotoURL || null,
        experience:   calcExperience(getDoj(driverDetails)),
    },
    pilot: {
        name:         toTitleCase(helperDetails?.name || ""),
        phone:        helperDetails?.mobile || "",
        profileImage: helperDetails?.profilePhotoURL || null,
        experience:   calcExperience(getDoj(helperDetails)),
    },
    vehicle,
});

// ── In-memory caches (cleared on page reload, valid for the day) ──────────
const workerCache = new Map();  // key: `${wardId}-${date}`  → raw WorkerDetails
const empCache    = new Map();  // key: employeeId           → GeneralDetails

const getCachedEmployee = async (empId) => {
    if (!empId) return {};
    if (empCache.has(empId)) return empCache.get(empId);
    const resp = await getEmployeeGeneralDetailsFromDB(empId);
    const data = resp?.status === "Success" ? resp.data : {};
    empCache.set(empId, data);
    return data;
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

        const [driverDetails, helperDetails] = await Promise.all([
            getCachedEmployee(driverId),
            getCachedEmployee(helperId),
        ]);

        setWorkers(buildWorkerState(driverDetails, helperDetails, cleanField(raw.vehicle)));
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
