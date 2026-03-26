import * as common from "../../../common/common";
import * as db from "../../../services/dbServices";
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

/**
 * Firebase onValue listener — fires instantly from cache, then realtime.
 * Returns unsubscribe function; call in useEffect cleanup.
 */
export const subscribeWardLineStatus = (ward, year, month, date, onUpdate) => {
    if (!ward || !year || !month || !date) return () => {};
    const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;
    return db.subscribeData(path, (data) => {
        if (!data) { onUpdate({}); return; }
        const statusByLine = {};
        for (const key in data) {
            if (data[key] && typeof data[key] === "object") {
                statusByLine[key] = data[key].Status ?? null;
            }
        }
        onUpdate(statusByLine);
    });
};

// ── getWardLineStatus cache ──────────────────────────────────────────────────
// 5-min TTL: monitoring data is real-time via subscribeWardLineStatus for the
// selected ward; this one-time fetch (used for all-ward prefetch) can be stale
// briefly without affecting UX.
const _WLS_TTL_MS = 5 * 60 * 1000;
const _wlsLsKey   = (ward, date) => `wls_status_${ward}_${date}`;
const _wlsInFlight = new Map();

function _wlsLsGet(ward, date) {
    try {
        const raw = localStorage.getItem(_wlsLsKey(ward, date));
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > _WLS_TTL_MS) { localStorage.removeItem(_wlsLsKey(ward, date)); return null; }
        return data;
    } catch { return null; }
}

function _wlsLsSet(ward, date, data) {
    try { localStorage.setItem(_wlsLsKey(ward, date), JSON.stringify({ data, ts: Date.now() })); } catch { }
}

export const getWardLineStatus = (ward, year, month, date) => {
    if (!ward || !year || !month || !date) {
        return Promise.resolve(common.setResponse('fail', "Invalid Params", { ward, year, month, date }));
    }

    // 1. localStorage cache (~1-2 ms) — survives page refresh for 5 min
    const lsData = _wlsLsGet(ward, date);
    if (lsData) {
        return Promise.resolve(common.setResponse("success", "Line status fetched", lsData));
    }

    // 2. In-flight dedup — concurrent calls for same ward share one Firebase read
    const inflightKey = `${ward}_${date}`;
    if (_wlsInFlight.has(inflightKey)) {
        return _wlsInFlight.get(inflightKey);
    }

    const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;

    const promise = db.getData(path)
        .then((resp) => {
            if (resp !== null) {
                // Extract only the Status field — don't store full objects in cache
                const statusByLine = {};
                for (const key in resp) {
                    if (resp[key] && typeof resp[key] === "object") {
                        statusByLine[key] = resp[key].Status ?? null;
                    }
                }
                _wlsLsSet(ward, date, statusByLine);
                saveRealtimeDbServiceHistory('MapServices', 'getWardLineStatus');
                saveRealtimeDbServiceDataHistory('MapServices', 'getWardLineStatus', resp);
                return common.setResponse("success", "Line status fetched", statusByLine);
            }
            return common.setResponse("fail", "No LineStatus data found", {});
        })
        .catch((error) => common.setResponse("fail", error.message, {}))
        .finally(() => _wlsInFlight.delete(inflightKey));

    _wlsInFlight.set(inflightKey, promise);
    return promise;
};
