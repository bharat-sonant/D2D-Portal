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
import { syncMonitoringEmployee, syncMonitoringEmployeesBatch } from "../../../../services/EmployeeService/EmployeeService";
import { storageUrl } from "../../../../services/supabaseServices";
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
        if (url) { const img = new window.Image(); img.src = url; }
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
        if (url) { const img = new window.Image(); img.src = url; }
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

// driver / helper shape: { name, photo, mobile, dummyFlag }
const buildWorkerState = (raw, driver, helper) => {
    const helperIsDummy  = Number(helper.dummyFlag) === 1;
    const helperName     = helper.name || cleanField(raw.helperName) || "";
    const helperHasCTag  = /\(c\)/i.test(helperName);

    const noHelper       = helperIsDummy && helperHasCTag;
    const nameRed        = !helperIsDummy && helperHasCTag;

    return {
        captain: {
            id:           cleanField(raw.driver),
            name:         toTitleCase(driver.name || cleanField(raw.driverName)),
            profileImage: driver.photo  || null,
            phone:        driver.mobile || "",
        },
        pilot: {
            id:           cleanField(raw.helper),
            name:         toTitleCase(helperName),
            profileImage: helper.photo  || null,
            phone:        helper.mobile || "",
            isDummy:      helperIsDummy,
            noHelper,
            nameRed,
        },
        vehicle: cleanField(raw.vehicle),
    };
};

const EMPTY_WORKER_STATE = {
    captain: { id: "", name: "", profileImage: null, phone: "" },
    pilot:   { id: "", name: "", profileImage: null, phone: "", isDummy: false, noHelper: false, nameRed: false },
    vehicle: "",
};

// ── In-memory caches (cleared on page reload) ─────────────────────────────
const workerCache       = new Map(); // key: `${wardId}-${date}` → full WorkerState
const employeeCache     = new Map(); // key: employeeId → { name, photo, mobile, dummyFlag }
const imagePreloadCache = new Set(); // URLs already kicked off in browser cache

// Kicks off a browser image fetch AND pre-decodes into GPU memory before the
// <img> tag renders — eliminates the visible "blank → image" flash.
const preloadImage = (url) => {
    if (!url || imagePreloadCache.has(url)) return;
    imagePreloadCache.add(url);
    const img = new window.Image();
    img.src = url;
    img.decode?.().catch(() => {}); // decode ahead of render (non-blocking)
};

// Builds the expected Supabase profile photo URL from employeeId + city — no network call.
// Same path that uploadEmployeeProfileImage uses, so it matches the stored URL.
const getSpeculativePhotoUrl = (employeeId, cityName) => {
    if (!employeeId || !cityName) return null;
    return `${storageUrl}/${String(cityName).toLowerCase().trim()}/EmployeeImages/${employeeId}/profileImage.jpg`;
};

// Waits for an image to fully load, with a max timeout.
// This ensures skeleton is only removed when the image is already in browser cache.
const waitForImage = (url, timeoutMs = 1200) => {
    if (!url) return Promise.resolve();
    return Promise.race([
        new Promise((resolve) => {
            const img = new window.Image();
            img.src = url;
            // Already in browser cache — resolve instantly
            if (img.complete && img.naturalWidth > 0) { resolve(); return; }
            img.onload  = resolve;
            img.onerror = resolve; // don't block on network error
        }),
        new Promise(resolve => setTimeout(resolve, timeoutMs)),
    ]);
};

// ── sessionStorage persistence for employeeCache ──────────────────────────
// Employee data rarely changes; persist across page reloads so Supabase is
// only queried ONCE per employee per browser session (not on every reload).
const EMP_SESSION_KEY = 'mon_emp_cache';

const _loadEmployeeCacheFromSession = () => {
    try {
        const raw = sessionStorage.getItem(EMP_SESSION_KEY);
        if (!raw) return;
        const entries = JSON.parse(raw);
        for (const [id, entry] of Object.entries(entries)) {
            employeeCache.set(id, entry);
            preloadImage(entry.photo); // pre-warm browser image cache too
        }
    } catch {}
};

let _saveTimer = null;
const _scheduleSessionSave = () => {
    if (_saveTimer) return;
    _saveTimer = setTimeout(() => {
        try { sessionStorage.setItem(EMP_SESSION_KEY, JSON.stringify(Object.fromEntries(employeeCache))); } catch {}
        _saveTimer = null;
    }, 200); // batch writes — fires 200ms after last cache update
};

// Warm the cache immediately on module load
_loadEmployeeCacheFromSession();

// Call this on city switch — employee IDs are city-specific so stale data
// from a previous city must not bleed into the new one.
export const clearWorkerCaches = () => {
    workerCache.clear();
    employeeCache.clear();
    imagePreloadCache.clear();
    try { sessionStorage.removeItem(EMP_SESSION_KEY); } catch {}
    if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
};

// Supabase check → mila toh dikhaao, nahi mila toh Firebase → Supabase save → dikhaao.
const fetchEmployeeData = async (employeeId, cityName, onPhotoReady) => {
    if (!employeeId) return { name: null, photo: null, mobile: "", dummyFlag: null };
    if (employeeCache.has(employeeId)) return employeeCache.get(employeeId);

    const { name, photo, mobile, dummyFlag } = await syncMonitoringEmployee(employeeId, cityName, onPhotoReady);
    const result = { name: name || null, photo: photo || null, mobile: mobile || "", dummyFlag: dummyFlag ?? null };
    employeeCache.set(employeeId, result);
    preloadImage(result.photo);
    _scheduleSessionSave();
    return result;
};

// Batch version — 1 Supabase round-trip for all missing IDs.
// Photo background mein aati hai via onPhotoReady callback — no waiting.
const fetchEmployeesBatch = async (missingIds, cityName, onPhotoReady) => {
    if (!missingIds.length) return {};
    const batchData = await syncMonitoringEmployeesBatch(missingIds, cityName, onPhotoReady);
    const result = {};

    for (const [id, data] of Object.entries(batchData)) {
        const entry = { name: data.name || null, photo: data.photo || null, mobile: data.mobile || "", dummyFlag: data.dummyFlag ?? null };
        employeeCache.set(id, entry);
        if (entry.photo) preloadImage(entry.photo);
        result[id] = entry;
    }

    _scheduleSessionSave();
    return result;
};

/**
 * Subscribes to WorkerDetails with onValue — fires instantly from Firebase's
 * in-memory cache on every revisit, no network round-trip needed.
 * Returns unsubscribe; call it in useEffect cleanup.
 */
export const subscribeWorkerDetails = (wardId, setWorkers, cityName) => {
    const year     = dayjs().format("YYYY");
    const month    = dayjs().format("MMMM");
    const day      = dayjs().format("YYYY-MM-DD");
    const cacheKey = `${wardId}-${day}`;

    if (workerCache.has(cacheKey)) setWorkers(workerCache.get(cacheKey));

    const unsubscribe = subscribeWorkerDetailsFromDB(year, month, day, wardId, async (raw) => {
        if (!raw) {
            workerCache.delete(cacheKey);
            setWorkers(EMPTY_WORKER_STATE);
            return;
        }
        const driverId = cleanField(raw.driver);
        const helperId = cleanField(raw.helper);

        const dCached = employeeCache.get(driverId);
        const hCached = employeeCache.get(helperId);

        // Both cached — instant, zero network calls
        if (dCached && hCached) {
            const workers = buildWorkerState(raw, dCached, hCached);
            workerCache.set(cacheKey, workers);
            setWorkers(workers);
            return;
        }

        // Background photo ready hone par cache update + UI re-render
        const onPhotoReady = (empId, photoUrl) => {
            const cached = employeeCache.get(empId);
            if (cached) {
                cached.photo = photoUrl;
                employeeCache.set(empId, cached);
                _scheduleSessionSave();
            }
            preloadImage(photoUrl);
            // Current driver/helper ka latest data lekar worker state rebuild karo
            const latestDriver = employeeCache.get(driverId) ?? { name: null, photo: null, mobile: "", dummyFlag: null };
            const latestHelper = employeeCache.get(helperId) ?? { name: null, photo: null, mobile: "", dummyFlag: null };
            const updated = buildWorkerState(raw, latestDriver, latestHelper);
            workerCache.set(cacheKey, updated);
            setWorkers(updated);
        };

        // Speculative image preload — start downloading profile images RIGHT NOW,
        // in parallel with the Supabase query below.
        const missingIds = [!dCached && driverId, !hCached && helperId].filter(Boolean);
        for (const id of missingIds) preloadImage(getSpeculativePhotoUrl(id, cityName));

        // Batch fetch missing employees — 1 Supabase round-trip for both
        const batch = await fetchEmployeesBatch(missingIds, cityName, onPhotoReady);

        const driver = dCached ?? batch[driverId] ?? { name: null, photo: null, mobile: "", dummyFlag: null };
        const helper = hCached ?? batch[helperId] ?? { name: null, photo: null, mobile: "", dummyFlag: null };

        const workers = buildWorkerState(raw, driver, helper);
        workerCache.set(cacheKey, workers);
        setWorkers(workers);
    });

    return unsubscribe;
};

export const getWorkerDetails = async (wardId, setWorkers, cityName) => {
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
        const dCached     = employeeCache.get(driverId);
        const hCached     = employeeCache.get(helperId);
        const placeholder = { name: null, photo: null, mobile: "", dummyFlag: null };
        setWorkers(buildWorkerState(raw, dCached ?? placeholder, hCached ?? placeholder));

        // ── Phase 2: fetch missing employee data ─────────────────────────────
        if (!dCached || !hCached) {
            const [driver, helper] = await Promise.all([
                fetchEmployeeData(driverId, cityName),
                fetchEmployeeData(helperId, cityName),
            ]);
            const workers = buildWorkerState(raw, driver, helper);
            workerCache.set(cacheKey, workers);
            setWorkers(workers);
        } else {
            workerCache.set(cacheKey, buildWorkerState(raw, dCached, hCached));
        }
    } catch (error) {
        console.error("Error in getWorkerDetails:", error);
    }
};

