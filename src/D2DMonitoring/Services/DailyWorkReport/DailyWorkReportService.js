/**
 * DailyWorkReport — Firebase Service
 *
 * Past dates : getData() — one-time fetch, Promise.all (parallel)
 * Today      : subscribeData() — realtime onValue listener per zone
 */

import * as db from '../../../services/dbServices';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';
import { getWorkerCache, setWorkerCache } from './DailyWorkReportCache';

const FILE = 'DailyWorkReportService';

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
                const cached = getWorkerCache(id, date);
                const [summary, workerDetails] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    cached !== null
                        ? Promise.resolve(cached)
                        : db.getData(getWorkerDetailsPath(id, date)).then(d => { setWorkerCache(id, date, d); return d; }),
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
    let workerReads = 0;

    const rawAll = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const cached = getWorkerCache(id, date);
                const [summary, workerDetails] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    cached !== null ? Promise.resolve(cached) : db.getData(getWorkerDetailsPath(id, date)).then(d => { setWorkerCache(id, date, d); return d; }),
                ]);
                if (cached === null) workerReads++;
                return { id, name, raw: { Summary: summary, WorkerDetails: workerDetails } };
            } catch {
                return { id, name, raw: null };
            }
        })
    );

    const allRaw = rawAll.map(r => r.raw);
    saveRealtimeDbServiceHistory(FILE, 'fetchAllZonesOnce');
    saveRealtimeDbServiceDataHistory(FILE, 'fetchAllZonesOnce', allRaw);
    // reads: 1 Summary per zone + WorkerDetails only if not cached
    logTotalConsumption('fetchAllZonesOnce', allRaw, wards.length + workerReads, 6);

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

    let workerReads = 0;

    const unsubscribers = wards.map(({ id, name }) => {
        // WorkerDetails — cache hit to 0 reads, miss to fetch + cache
        const cached = getWorkerCache(id, date);
        if (cached !== null) {
            initialData[id] = { ...(initialData[id] || {}), WorkerDetails: cached };
        } else {
            workerReads++;
            db.getData(getWorkerDetailsPath(id, date))
                .then(workerDetails => {
                    setWorkerCache(id, date, workerDetails);
                    initialData[id] = { ...(initialData[id] || {}), WorkerDetails: workerDetails };
                    // Summary pehle aa chuka tha — vehicle update karo UI mein
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
                    // reads: 1 Summary onValue per zone + WorkerDetails only if not cached
                    logTotalConsumption('subscribeAllZones (initial)', allRaw, wards.length + workerReads, 6);
                }
            }

            onRowUpdate(buildRow(id, name, initialData[id]));
        });
    });
    return () => unsubscribers.forEach(fn => fn());
};
