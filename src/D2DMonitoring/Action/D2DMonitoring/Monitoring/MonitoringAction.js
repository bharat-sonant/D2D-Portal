import dayjs from "dayjs";
import {
    getWardDutyOnTimeFromDB,
    getWorkerDetailsFromDB,
    subscribeWorkerDetailsFromDB,
    getDutyInImageFromStorage,
    getWardReachedTimeFromDB,
    getWardDutyOffTimeFromDB,
    getDutyOffImageFromStorage,
    getHelperDummyFlagFromDB,
    getEmployeeProfilePhotoFromDB,
    getEmployeeMobileFromDB,
} from "../../../Services/D2DMonitoringService/D2DMonitoringDutyIn";

import { getWardLineStatus, subscribeWardLineStatus } from "../../../Services/MapSectionService/MapSectionService";
import { calculateWardLineLengthInMeter, getTotalExperience } from "../../../../common/common";
import {
    getRemark,
    subscribeRemarks,
    saveRemark,
    updateRemark,
    deleteRemark,
    getRemarkCategories,
} from "../../../Services/RemarkService/RemarkService";

export { getRemark, subscribeRemarks, saveRemark, updateRemark, deleteRemark };
export const fetchRemarkCategories = () => getRemarkCategories();
 
const fetchDayArgs = (d) => [d.format("YYYY"), d.format("MMMM"), d.format("YYYY-MM-DD")];

export const getDutyInImage = async (city, wardId, setImageUrl) => {
    try {
        const today = dayjs();
        const url = await getDutyInImageFromStorage(city, wardId, ...fetchDayArgs(today));
        setImageUrl(url);
    } catch (error) {
        console.error("Error fetching Duty In Image:", error);
        setImageUrl(null);
    }
};

export const getDutyOffImage = async (city, wardId, setImageUrl) => {
    try {
        const today = dayjs();
        const url = await getDutyOffImageFromStorage(city, wardId, ...fetchDayArgs(today));
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

    const entries = await Promise.all(
        wardList.map(async (ward) => {
            const wardId = ward?.id;
            if (!wardId) return { wardId, statusByLine: {} };
            try {
                const resp = await getWardLineStatus(wardId, year, month, date);
                return {
                    wardId,
                    statusByLine: resp?.status === "success" ? (resp?.data || {}) : {},
                };
            } catch {
                return { wardId, statusByLine: {} };
            }
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

const buildWorkerState = (raw, driverPhoto, driverMobile, helperPhoto, helperMobile, helperIsDummyFlag = null) => {
    const helperIsDummy  = Number(helperIsDummyFlag) === 1;
    const helperName     = cleanField(raw.helperName) || "";
    const helperHasCTag  = /\(c\)/i.test(helperName);

    // isDummy=1 AND (c) → Without Helper
    // isDummy≠1 AND (c) → show helper, name red + blink
    const noHelper = helperIsDummy && helperHasCTag;
    const nameRed  = !helperIsDummy && helperHasCTag;

    return {
        captain: {
            id:           cleanField(raw.driver),
            name:         toTitleCase(cleanField(raw.driverName)),
            profileImage: driverPhoto  || null,
            phone:        driverMobile || "",
        },
        pilot: {
            id:           cleanField(raw.helper),
            name:         toTitleCase(helperName),
            profileImage: helperPhoto  || null,
            phone:        helperMobile || "",
            isDummy:      helperIsDummy,
            noHelper,
            nameRed,
        },
        vehicle: cleanField(raw.vehicle),
    };
};

// ── In-memory caches (cleared on page reload) ─────────────────────────────
const workerCache   = new Map(); // key: `${wardId}-${date}` → full WorkerState
const employeeCache = new Map(); // key: employeeId → { photo, mobile, dummyFlag }
const imagePreloadCache = new Set(); // URLs already kicked off in browser cache

// Call this on city switch — employee IDs are city-specific so stale data
// from a previous city must not bleed into the new one.
export const clearWorkerCaches = () => {
    workerCache.clear();
    employeeCache.clear();
    imagePreloadCache.clear();
};

// Kicks off a browser image fetch so it lands in HTTP cache before the
// <img> tag is rendered — eliminates the visible "blank → image" flash.
const preloadImage = (url) => {
    if (!url || imagePreloadCache.has(url)) return;
    imagePreloadCache.add(url);
    const img = new window.Image();
    img.src = url;
};

// Fetches only the 3 fields we need (photo, mobile, dummyFlag) in parallel —
// avoids downloading the entire GeneralDetails object.
const fetchEmployeeData = async (employeeId) => {
    if (!employeeId) return { photo: null, mobile: "", dummyFlag: null };
    if (employeeCache.has(employeeId)) return employeeCache.get(employeeId);
    const [photo, mobile, dummyFlag] = await Promise.all([
        getEmployeeProfilePhotoFromDB(employeeId),
        getEmployeeMobileFromDB(employeeId),
        getHelperDummyFlagFromDB(employeeId),
    ]);
    const result = {
        photo:     photo     || null,
        mobile:    mobile    || "",
        dummyFlag: dummyFlag ?? null,
    };
    employeeCache.set(employeeId, result);
    preloadImage(result.photo); // start browser fetch immediately
    return result;
};

/**
 * Subscribes to WorkerDetails with onValue — fires instantly from Firebase's
 * in-memory cache on every revisit, no network round-trip needed.
 * Returns unsubscribe; call it in useEffect cleanup.
 */
export const subscribeWorkerDetails = (wardId, setWorkers) => {
    const year     = dayjs().format("YYYY");
    const month    = dayjs().format("MMMM");
    const day      = dayjs().format("YYYY-MM-DD");
    const cacheKey = `${wardId}-${day}`;

    // Serve from cache instantly (0ms) — no waiting for Firebase round-trip.
    if (workerCache.has(cacheKey)) setWorkers(workerCache.get(cacheKey));

    const unsubscribe = subscribeWorkerDetailsFromDB(year, month, day, wardId, async (raw) => {
        const driverId = cleanField(raw.driver);
        const helperId = cleanField(raw.helper);
        const [driver, helper] = await Promise.all([
            fetchEmployeeData(driverId),
            fetchEmployeeData(helperId),
        ]);
        const workers = buildWorkerState(raw, driver.photo, driver.mobile, helper.photo, helper.mobile, helper.dummyFlag);
        workerCache.set(cacheKey, workers);
        setWorkers(workers);
    });

    return unsubscribe;
};

export const getWorkerDetails = async (wardId, setWorkers) => {
    try {
        const year     = dayjs().format("YYYY");
        const month    = dayjs().format("MMMM");
        const day      = dayjs().format("YYYY-MM-DD");
        const cacheKey = `${wardId}-${day}`;

        // ── Fully cached: instant, zero Firebase reads ──────────────────────
        if (workerCache.has(cacheKey)) {
            setWorkers(workerCache.get(cacheKey));
            return;
        }

        // ── Fetch WorkerDetails (names + vehicle) ────────────────────────────
        const workerResp = await getWorkerDetailsFromDB(year, month, day, wardId);
        if (workerResp.status !== "Success") return;

        const raw      = workerResp.data;
        const driverId = cleanField(raw.driver);
        const helperId = cleanField(raw.helper);

        // ── Phase 1: show names + vehicle instantly ──────────────────────────
        // Use cached employee data if available, else show placeholders
        const dCached = employeeCache.get(driverId);
        const hCached = employeeCache.get(helperId);
        setWorkers(buildWorkerState(
            raw,
            dCached?.photo     ?? null,
            dCached?.mobile    ?? "",
            hCached?.photo     ?? null,
            hCached?.mobile    ?? "",
            hCached?.dummyFlag ?? null,
        ));

        // ── Phase 2: fetch missing employee data (2 reads instead of 5) ─────
        if (!dCached || !hCached) {
            const [driver, helper] = await Promise.all([
                fetchEmployeeData(driverId),
                fetchEmployeeData(helperId),
            ]);
            const workers = buildWorkerState(raw, driver.photo, driver.mobile, helper.photo, helper.mobile, helper.dummyFlag);
            workerCache.set(cacheKey, workers);
            setWorkers(workers);
        } else {
            workerCache.set(cacheKey, buildWorkerState(
                raw, dCached.photo, dCached.mobile, hCached.photo, hCached.mobile, hCached.dummyFlag
            ));
        }
    } catch (error) {
        console.error("Error in getWorkerDetails:", error);
    }
};

