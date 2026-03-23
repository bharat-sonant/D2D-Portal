// DbService Tracker
// Saves to Firebase: RealtimeDbServiceDetails/History/{ServiceName}/{year}/{month}/{date}/
//   count    : number
//   dataSize : number (bytes)

import { increment } from "firebase/database";
import { saveData, getData } from "../../../services/dbServices";
import dayjs from "dayjs";

const FB_ROOT = "RealtimeDbServiceDetails/History";

// ── Path normalization ────────────────────────────────────────────────────────
// Returns just the last meaningful semantic segment (leaf name).
// Skips: collection name (idx 0), ward/employee ID (idx 1),
//        pure numbers, month names, YYYY-MM-DD date strings.
// Falls back to collection name if no leaf found.

const MONTHS = new Set([
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
]);

function normalizePath(path) {
  const segments = path.split("/");

  const meaningful = segments.filter((seg, idx) => {
    if (idx <= 1) return false;                          // collection + ward/employee ID
    if (/^\d+$/.test(seg)) return false;                 // pure numbers (year, month, date)
    if (/^\d{4}-\d{2}-\d{2}$/.test(seg)) return false;  // "2026-03-23" style dates
    if (MONTHS.has(seg.toLowerCase())) return false;     // month names like "March"
    if (seg === "Summary") return false;                 // intermediate container, not a service name
    return true;
  });

  // Return last semantic segment, or collection name if nothing found
  return meaningful.length > 0
    ? meaningful[meaningful.length - 1]
    : segments[0];
}

// Firebase keys cannot contain: . # $ / [ ]
function toFirebaseKey(str) {
  return str.replace(/\//g, "__").replace(/[.#$[\]]/g, "_");
}

function fromFirebaseKey(key) {
  return key.replace(/__/g, "/");
}

function getDateParts() {
  const now = dayjs();
  return {
    year:  now.format("YYYY"),
    month: now.format("MMMM"),
    date:  now.format("YYYY-MM-DD"),
  };
}

// ── In-memory buffer (flushed every 4s) ──────────────────────────────────────

const pending = {};
let flushTimer = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flushToFirebase, 4000);
}

async function flushToFirebase() {
  flushTimer = null;
  if (Object.keys(pending).length === 0) return;

  const snapshot = JSON.parse(JSON.stringify(pending));
  Object.keys(pending).forEach((k) => delete pending[k]);

  try {
    for (const dateKey of Object.keys(snapshot)) {
      const [year, month, date] = dateKey.split("/");
      for (const serviceKey of Object.keys(snapshot[dateKey])) {
        const { count, dataSize } = snapshot[dateKey][serviceKey];

        await saveData(`${FB_ROOT}/${year}/${month}/${date}/${serviceKey}`, {
          count:    increment(count),
          dataSize: increment(dataSize),
        });
      }
    }

    window.dispatchEvent(new Event("d2d_tracker_update"));
  } catch {
    // tracking must never crash the app
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function trackCall(path, _type, data) {
  try {
    // Don't track the tracker's own read/write calls
    if (path.startsWith("RealtimeDbServiceDetails")) return;

    const normalized  = normalizePath(path);
    const serviceKey  = toFirebaseKey(normalized);
    const { year, month, date } = getDateParts();
    const dateKey = `${year}/${month}/${date}`;

    const bytes = data != null ? new Blob([JSON.stringify(data)]).size : 0;

    if (!pending[dateKey])             pending[dateKey] = {};
    if (!pending[dateKey][serviceKey]) pending[dateKey][serviceKey] = { count: 0, dataSize: 0 };

    pending[dateKey][serviceKey].count    += 1;
    pending[dateKey][serviceKey].dataSize += bytes;

    scheduleFlush();
  } catch {
    // silent
  }
}

// Get stats for a specific date (YYYY-MM-DD). One row per unique service.
export async function getStats(filterDate) {
  try {
    const targetDate = filterDate
      ? dayjs(filterDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");

    const targetYear  = dayjs(filterDate).format("YYYY");
    const targetMonth = dayjs(filterDate).format("MMMM");

    const val = await getData(`${FB_ROOT}/${targetYear}/${targetMonth}/${targetDate}`);
    if (!val) return [];

    return Object.entries(val)
      .filter(([, info]) => typeof info === "object")
      .map(([serviceKey, info]) => ({
        path:       fromFirebaseKey(serviceKey),
        callCount:  info.count    || 0,
        totalBytes: info.dataSize || 0,
      }))
      .sort((a, b) => b.callCount - a.callCount);
  } catch {
    return [];
  }
}

export async function clearStats() {
  try {
    await saveData(FB_ROOT, null);
    window.dispatchEvent(new Event("d2d_tracker_update"));
  } catch {
    // silent
  }
}

// ── Backend Function Call History ─────────────────────────────────────────────

const ROOT = "RealtimeDbServiceDetails";

export function saveRealtimeDbServiceHistory(serviceFileName, functionName) {
  try {
    const date  = dayjs().format("YYYY-MM-DD");
    const year  = date.split("-")[0];
    const month = dayjs().format("MMM");
    const base  = `${ROOT}/History/${serviceFileName}/${functionName}`;

    saveData(`${base}/${year}/${month}/${date}`, { count: increment(1) });
    saveData(`${base}/${year}/${month}`,         { count: increment(1) });
    saveData(`${ROOT}/Summary/${serviceFileName}/${functionName}`, { count: increment(1) });
  } catch {
    // silent
  }
}

export function saveRealtimeDbServiceDataHistory(serviceFileName, functionName, data) {
  try {
    if (data === null || data === undefined) return;

    const jsonString      = JSON.stringify(data);
    const dataSizeInBytes = new TextEncoder().encode(jsonString).length;
    const dataSize        = parseFloat((dataSizeInBytes / 1024).toFixed(4));

    const date  = dayjs().format("YYYY-MM-DD");
    const year  = date.split("-")[0];
    const month = dayjs().format("MMM");
    const base  = `${ROOT}/History/${serviceFileName}/${functionName}`;

    saveData(`${base}/${year}/${month}/${date}`, { dataSize: increment(dataSize) });
    saveData(`${base}/${year}/${month}`,         { dataSize: increment(dataSize) });
    saveData(`${ROOT}/Summary/${serviceFileName}/${functionName}`, { dataSize: increment(dataSize) });
  } catch {
    // silent
  }
}
