/**
 * DailyWorkReport — Firebase Service
 *
 * Past dates : getData() — one-time fetch, Promise.all (parallel)
 * Today      : subscribeData() — realtime onValue listener per zone
 */

import * as db from '../../../services/dbServices';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';

const FILE = 'DailyWorkReportService';

// ─── WorkerDetails module-level cache ───────────────────────────
// Vehicle/driver info din mein rarely change hoti — session tak same rehti
// Key: "YYYY-MM-DD_wardId"  Value: WorkerDetails object
const workerDetailsCache = new Map();

// ─── Console logger (ek baar, sab zones ka total) ───────────────

const logTotalConsumption = (fnName, allData, reads, writes) => {
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
        `| zones: ${allData.length} | reads: ${reads} | writes: ${writes} | ${totalBytes} bytes (${kb} KB / ${mb} MB)`
    );
};

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

// ─── Helpers ────────────────────────────────────────────────────

const getBasePath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WasteCollectionInfo/${wardId}/${year}/${month}/${date}`;
};

const getSummaryPath      = (wardId, date) => `${getBasePath(wardId, date)}/Summary`;
const getWorkerDetailsPath = (wardId, date) => `${getBasePath(wardId, date)}/WorkerDetails`;

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

// ─── Past dates — change check (dutyInTime only) ────────────────
// 103 tiny reads — sirf dutyInTime check karo, poora data nahi

export const checkDutyInTimeAll = async (wards, date) => {
    return Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const raw = await db.getData(`${getSummaryPath(id, date)}/dutyInTime`);
                return { id, name, dutyOn: normalizeTime(raw, 'first') };
            } catch {
                return { id, name, dutyOn: null };
            }
        })
    );
};

// ─── Past dates — fetch sirf changed zones ka full data ──────────

export const fetchZonesFull = async (wards, date) => {
    const rawAll = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const [summary, workerDetails] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    db.getData(getWorkerDetailsPath(id, date)),
                ]);
                return { id, name, raw: { Summary: summary, WorkerDetails: workerDetails } };
            } catch {
                return { id, name, raw: null };
            }
        })
    );
    return rawAll.map(({ id, name, raw }) => buildRow(id, name, raw));
};

// ─── Past dates — one-time parallel fetch (cache miss) ───────────

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
                const [summary, workerDetails] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    db.getData(getWorkerDetailsPath(id, date)),
                ]);
                return { id, name, raw: { Summary: summary, WorkerDetails: workerDetails } };
            } catch {
                return { id, name, raw: null };
            }
        })
    );
    const allRaw = rawAll.map(r => r.raw);
    saveRealtimeDbServiceHistory(FILE, 'fetchAllZonesOnce');
    saveRealtimeDbServiceDataHistory(FILE, 'fetchAllZonesOnce', allRaw);
    logTotalConsumption('fetchAllZonesOnce', allRaw, wards.length * 2, 6);
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
    // raw string cache — sirf dutyInTime + dutyOutTime track karo
    const rawCache    = {};

    let workerReads = 0;

    const unsubscribers = wards.map(({ id, name }) => {
        const cacheKey      = `${date}_${id}`;
        const cachedWorker  = workerDetailsCache.get(cacheKey);

        if (cachedWorker !== undefined) {
            // Cache hit — Firebase read skip, seedha use karo
            initialData[id] = { ...(initialData[id] || {}), WorkerDetails: cachedWorker };
            if (initialData[id].Summary !== undefined) {
                onRowUpdate(buildRow(id, name, initialData[id]));
            }
        } else {
            workerReads++;
            db.getData(getWorkerDetailsPath(id, date))
                .then(workerDetails => {
                    workerDetailsCache.set(cacheKey, workerDetails);   // save for next time
                    initialData[id] = { ...(initialData[id] || {}), WorkerDetails: workerDetails };
                    if (initialData[id].Summary !== undefined) {
                        onRowUpdate(buildRow(id, name, initialData[id]));
                    }
                })
                .catch(() => {});
        }

        // Summary pe live listener (duty times din mein update hote hain)
        return db.subscribeData(getSummaryPath(id, date), (summary) => {
            initialData[id] = { ...(initialData[id] || {}), Summary: summary };

            // Jab sab zones ka pehla callback aaye tab sirf 1 baar tracker + log
            if (!loggedOnce.done) {
                if (Object.keys(initialData).length >= wards.length) {
                    loggedOnce.done = true;
                    const allRaw = Object.values(initialData);
                    saveRealtimeDbServiceHistory(FILE, 'subscribeAllZones');
                    saveRealtimeDbServiceDataHistory(FILE, 'subscribeAllZones', allRaw);
                    logTotalConsumption('subscribeAllZones (initial)', allRaw, wards.length + workerReads, 6);
                }
            }

            // Raw string comparison — sirf dutyInTime ya dutyOutTime change hone pe update karo
            const newDutyIn  = summary?.dutyInTime  ?? null;
            const newDutyOut = summary?.dutyOutTime ?? null;
            const prev       = rawCache[id];

            // Pehli baar (prev nahi) → hamesha update karo
            // Baad mein → sirf tab jab raw string actually change ho
            if (prev &&
                String(newDutyIn)  === String(prev.dutyInTime) &&
                String(newDutyOut) === String(prev.dutyOutTime)
            ) return; // koi change nahi — re-render skip

            rawCache[id] = { dutyInTime: newDutyIn, dutyOutTime: newDutyOut };
            onRowUpdate(buildRow(id, name, initialData[id]));
        });
    });
    return () => unsubscribers.forEach(fn => fn());
};
