import dayjs from "dayjs";
import {
    subscribeVehicleSurfingHistoryFromDB,
    getVehicleSurfingHistoryFromDB,
} from "../../../Services/VehicleStatusService/VehicleStatusService";
import { logServiceCall } from "../../../../common/serviceLogger";

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Parse "ward-in" or "petrolPump-out" → { location: "ward", action: "in" }
 * Normalises camelCase location names to lowercase for matching.
 */
const parseStatusValue = (statusValue = "") => {
    const raw = String(statusValue).trim();
    const isIn = raw.toLowerCase().endsWith("-in");
    const action = isIn ? "in" : "out";
    const location = raw.replace(/-in$/i, "").replace(/-out$/i, "").toLowerCase();
    return { location, action };
};

/** "HH:mm:ss:ms" → total minutes from midnight (for duration calc) */
const parseTimeToMinutes = (key = "") => {
    const parts = String(key).split(":");
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
};

/** Sort raw Firebase object entries chronologically by timestamp key */
const sortEntries = (rawHistory) =>
    Object.entries(rawHistory).sort(([a], [b]) => String(a).localeCompare(String(b)));

/** Format total minutes → "1h 30m" or "45m" */
const formatMinutes = (totalMins) => {
    if (totalMins <= 0) return "0m";
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const LOCATION_DISPLAY = {
    ward: "Ward",
    petrolpump: "Petrol Pump",
    dumpingyard: "Dumping Yard",
    garage: "Garage",
};

const getLocationDisplay = (location) =>
    LOCATION_DISPLAY[location] || location;

const getEventKind = (location, action) => {
    if (location === "petrolpump") return "fuel_stop";
    if (action === "in") return "entered";
    return "exited";
};

const getEventDescription = (location, action) => {
    if (location === "ward" && action === "in") return "Inside ward - collecting";
    if (location === "ward" && action === "out") return "Collection done, moving on";
    if (location === "petrolpump" && action === "in") return "Stopped for refuelling";
    if (location === "petrolpump" && action === "out") return "Refuelling done, heading out";
    if (location === "dumpingyard" && action === "in") return "Unloading waste at dumping yard";
    if (location === "dumpingyard" && action === "out") return "Unloading done, returning to route";
    if (location === "garage" && action === "in") return "Vehicle under inspection";
    if (location === "garage" && action === "out") return "Inspection done, back on route";
    return "Vehicle in transit";
};

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Returns the raw latest status value from history e.g. "ward-in".
 * Returns null if no data.
 */
export const getCurrentVehicleStatus = (rawHistory = {}) => {
    if (!rawHistory || typeof rawHistory !== "object") return null;
    const entries = sortEntries(rawHistory);
    if (!entries.length) return null;
    return entries[entries.length - 1][1];
};

/**
 * Build a structured event log array from raw surfing history.
 * Each entry has: id, title, description, time, tag, duration, kind
 */
export const buildVehicleEventLog = (rawHistory = {}) => {
    if (!rawHistory || typeof rawHistory !== "object") return [];
    const entries = sortEntries(rawHistory);

    return entries.map(([timeKey, statusValue], index) => {
        const { location, action } = parseStatusValue(statusValue);
        const locDisplay = getLocationDisplay(location);
        const timeDisplay = String(timeKey).substring(0, 5); // "HH:mm"
        const isLast = index === entries.length - 1;

        let duration = "Active now";
        if (!isLast) {
            const diffMins =
                parseTimeToMinutes(entries[index + 1][0]) - parseTimeToMinutes(timeKey);
            duration = diffMins > 0 ? formatMinutes(diffMins) : "-";
        }

        return {
            id: `e${index + 1}`,
            title: `${locDisplay} ${action === "in" ? "Entered" : "Exited"}`,
            description: getEventDescription(location, action),
            time: timeDisplay,
            tag: action === "in" ? `In ${locDisplay}` : "Out",
            duration,
            kind: getEventKind(location, action),
        };
    });
};

/**
 * Compute quick summary stats from raw surfing history:
 *   wardEntries, fuelStops, inWard (total time in ward), longestSession
 */
export const buildVehicleQuickSummary = (rawHistory = {}) => {
    if (!rawHistory || typeof rawHistory !== "object") {
        return { wardEntries: 0, fuelStops: 0, inWard: "0m", longestSession: "0m" };
    }

    const entries = sortEntries(rawHistory);
    let wardEntries = 0;
    let fuelStops = 0;
    let totalWardMins = 0;
    let longestSessionMins = 0;
    let wardInKey = null;

    entries.forEach(([timeKey, statusValue]) => {
        const { location, action } = parseStatusValue(statusValue);

        if (action === "in") {
            if (location === "ward") { wardEntries++; wardInKey = timeKey; }
            if (location === "petrolpump") fuelStops++;
        }

        if (action === "out" && location === "ward" && wardInKey) {
            const sessionMins =
                parseTimeToMinutes(timeKey) - parseTimeToMinutes(wardInKey);
            if (sessionMins > 0) {
                totalWardMins += sessionMins;
                longestSessionMins = Math.max(longestSessionMins, sessionMins);
            }
            wardInKey = null;
        }
    });

    return {
        wardEntries,
        fuelStops,
        inWard: formatMinutes(totalWardMins),
        longestSession: formatMinutes(longestSessionMins),
    };
};

/**
 * Subscribe to live vehicle surfing history for today.
 * Calls onUpdate({ currentStatus, eventLog, quickSummary }) on every change.
 * Returns unsubscribe — call in useEffect cleanup.
 */
export const subscribeVehicleStatusForToday = (wardId, onUpdate) => {
    logServiceCall('VehicleStatusAction', 'subscribeVehicleStatusForToday');
    if (!wardId) return () => {};

    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");

    return subscribeVehicleSurfingHistoryFromDB(wardId, year, month, date, (rawData) => {
        const currentStatus = getCurrentVehicleStatus(rawData);
        const eventLog = buildVehicleEventLog(rawData);
        const quickSummary = buildVehicleQuickSummary(rawData);
        onUpdate({ currentStatus, eventLog, quickSummary });
    });
};

/**
 * One-time fetch of vehicle surfing history for today.
 * Returns { currentStatus, eventLog, quickSummary } or null on failure.
 */
export const getVehicleStatusForToday = async (wardId) => {
    logServiceCall('VehicleStatusAction', 'getVehicleStatusForToday');
    if (!wardId) return null;

    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");

    const resp = await getVehicleSurfingHistoryFromDB(wardId, year, month, date);

    if (resp?.status !== "Success" || !resp?.data) return null;

    const rawData = resp.data;
    return {
        currentStatus: getCurrentVehicleStatus(rawData),
        eventLog: buildVehicleEventLog(rawData),
        quickSummary: buildVehicleQuickSummary(rawData),
    };
};
