/**
 * DailyWorkReport — Firebase Service
 *
 * Past dates : getData() — one-time fetch, Promise.all (parallel)
 * Today      : subscribeData() — realtime onValue listener per zone
 */

import * as db from '../../../services/dbServices';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';

const FILE = 'DailyWorkReportService';

// ─── Console logger (ek baar, sab zones ka total) ───────────────

const logTotalConsumption = (fnName, allData) => {
    const totalBytes = allData.reduce((sum, d) => {
        if (!d) return sum;
        return sum + new TextEncoder().encode(JSON.stringify(d)).length;
    }, 0);
    const kb = (totalBytes / 1024).toFixed(2);
    const mb = (totalBytes / (1024 * 1024)).toFixed(4);
    console.log(
        `%c[DailyWorkReport] %c${fnName}`,
        'color:#667eea;font-weight:bold',
        'color:#334155;font-weight:bold',
        `| zones: ${allData.length} | ${totalBytes} bytes (${kb} KB / ${mb} MB)`
    );
};

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

// ─── Helpers ────────────────────────────────────────────────────

const getPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WasteCollectionInfo/${wardId}/${year}/${month}/${date}`;
};

const normalizeTime = (value, mode = "first") => {
    if (!value) return null;
    const arr = Array.isArray(value)
        ? value
        : String(value).split(",").map(t => t.trim()).filter(Boolean);
    if (!arr.length) return null;
    return mode === "last" ? arr[arr.length - 1] : arr[0];
};

const buildRow = (id, name, raw) => ({
    wardId:               id,
    zone:                 name,
    dutyOn:               normalizeTime(raw?.Summary?.dutyInTime,    "first"),
    enteredWardBoundary:  normalizeTime(raw?.Summary?.wardReachedOn, "first"),
    dutyOff:              normalizeTime(raw?.Summary?.dutyOutTime,   "last"),
    vehicle:              raw?.WorkerDetails?.vehicle ?? null,
});

// ─── Past dates — one-time parallel fetch ────────────────────────

/**
 * Sab zones ka data ek saath (Promise.all) fetch karta hai.
 * Firebase pe ek parallel burst → feels like 1 operation.
 *
 * @param {Array<{id, name}>} wards
 * @param {string}            date  "YYYY-MM-DD"
 * @returns {Promise<Array>}
 */
export const fetchAllZonesOnce = async (wards, date) => {
    const rawAll = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const raw = await db.getData(getPath(id, date));
                saveRealtimeDbServiceHistory(FILE, 'fetchAllZonesOnce');
                saveRealtimeDbServiceDataHistory(FILE, 'fetchAllZonesOnce', raw);
                return { id, name, raw };
            } catch {
                return { id, name, raw: null };
            }
        })
    );

    logTotalConsumption('fetchAllZonesOnce', rawAll.map(r => r.raw));
    return rawAll.map(({ id, name, raw }) => buildRow(id, name, raw));
};

// ─── Today — realtime listeners ─────────────────────────────────

/**
 * Har zone pe onValue listener lagata hai (today only).
 * Pehla callback instantly current data deta hai.
 * Baad ke callbacks sirf us row ko update karte hain.
 *
 * @param {Array<{id, name}>} wards
 * @param {string}            date      "YYYY-MM-DD"
 * @param {function}          onRowUpdate  called with single updated row
 * @returns {function}        unsubscribe — cleanup ke liye
 */
export const subscribeAllZones = (wards, date, onRowUpdate) => {
    const initialData = {};
    const loggedOnce  = { done: false };

    const unsubscribers = wards.map(({ id, name }) =>
        db.subscribeData(getPath(id, date), (raw) => {
            saveRealtimeDbServiceHistory(FILE, 'subscribeAllZones');
            saveRealtimeDbServiceDataHistory(FILE, 'subscribeAllZones', raw);

            // Initial load: collect all zones, log once when all received
            if (!loggedOnce.done) {
                initialData[id] = raw;
                if (Object.keys(initialData).length >= wards.length) {
                    loggedOnce.done = true;
                    logTotalConsumption('subscribeAllZones (initial)', Object.values(initialData));
                }
            }

            onRowUpdate(buildRow(id, name, raw));
        })
    );
    return () => unsubscribers.forEach(fn => fn());
};
