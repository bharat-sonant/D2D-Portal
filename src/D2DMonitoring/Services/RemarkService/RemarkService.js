import dayjs from 'dayjs';
import * as db from '../../../services/dbServices';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';

const FILE = 'RemarkService';

// ── Path helpers ─────────────────────────────────────────────────────────────

const todayParts = () => ({
    year:  dayjs().format('YYYY'),
    month: dayjs().format('MMMM'),
    date:  dayjs().format('YYYY-MM-DD'),
});

const remarkPath = (wardId) => {
    const { year, month, date } = todayParts();
    return `Remarks/${wardId}/${year}/${month}/${date}`;
};

// ── In-flight dedup (prevents concurrent duplicate DB reads) ─────────────────
const _inFlight = new Map();

// ── getRemark ─────────────────────────────────────────────────────────────────
// One-time fetch with in-flight dedup + sessionStorage cache (2-min TTL).
// Use this for initial load; use subscribeRemarks for live updates.

const SS_KEY  = (wardId, date) => `remarks_${wardId}_${date}`;
const TTL_MS  = 2 * 60 * 1000; // 2 min — remarks can change; keep TTL short

function ssGet(wardId, date) {
    try {
        const raw = sessionStorage.getItem(SS_KEY(wardId, date));
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > TTL_MS) { sessionStorage.removeItem(SS_KEY(wardId, date)); return null; }
        return data;
    } catch { return null; }
}

function ssSet(wardId, date, data) {
    try { sessionStorage.setItem(SS_KEY(wardId, date), JSON.stringify({ data, ts: Date.now() })); } catch { }
}

export const getRemark = (wardId) => {
    if (!wardId) return Promise.resolve([]);

    const { date } = todayParts();

    // 1. sessionStorage cache (~1-2 ms)
    const cached = ssGet(wardId, date);
    if (cached) return Promise.resolve(cached);

    // 2. In-flight dedup — concurrent calls share one DB read
    if (_inFlight.has(wardId)) return _inFlight.get(wardId);

    const promise = db.getData(remarkPath(wardId))
        .then((data) => {
            if (!data) return [];
            const list = Object.entries(data)
                .map(([id, val]) => ({ id, ...val }))
                .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
            ssSet(wardId, date, list);
            saveRealtimeDbServiceHistory(FILE, 'getRemark');
            saveRealtimeDbServiceDataHistory(FILE, 'getRemark', data);
            return list;
        })
        .catch(() => [])
        .finally(() => _inFlight.delete(wardId));

    _inFlight.set(wardId, promise);
    return promise;
};

// ── subscribeRemarks ──────────────────────────────────────────────────────────
// Incremental real-time: onChildAdded/Changed/Removed — never re-downloads
// the full list on each change. Each event carries only the affected remark.

export const subscribeRemarks = (wardId, onUpdate) => {
    if (!wardId) return () => {};

    // Accumulate remarks in a Map — key → remark object
    const remarksMap = new Map();

    const notify = () => {
        const list = [...remarksMap.values()]
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        onUpdate(list);
    };

    const onAdded = (id, val) => {
        remarksMap.set(id, { id, ...val });
        notify();
    };

    const onChanged = (id, val) => {
        remarksMap.set(id, { id, ...val });
        notify();
    };

    const onRemoved = (id) => {
        remarksMap.delete(id);
        notify();
    };

    return db.subscribeChildEvents(remarkPath(wardId), onAdded, onChanged, onRemoved);
};

// ── Remark Categories ─────────────────────────────────────────────────────────
// Static data — rarely changes; cache in sessionStorage for the whole session.

let _categoriesCache = null;

export const getRemarkCategories = async () => {
    if (_categoriesCache) return _categoriesCache;
    try {
        const data = await db.getData('RemarkCategory');
        if (!data || typeof data !== 'object') return [];
        const list = Object.entries(data).map(([id, val]) => ({
            id,
            name:  typeof val === 'string' ? val : (val?.name ?? val?.title ?? String(id)),
            image: typeof val === 'object'  ? (val?.image ?? null) : null,
        }));
        _categoriesCache = list;
        saveRealtimeDbServiceHistory(FILE, 'getRemarkCategories');
        return list;
    } catch { return []; }
};

// ── CRUD ──────────────────────────────────────────────────────────────────────

export const saveRemark = async (wardId, remarkData) => {
    if (!wardId) return { success: false, message: 'No ward selected' };
    try {
        const payload = {
            ...remarkData,
            time:      dayjs().format('h:mm:ss A'),
            createdAt: Date.now(),
        };
        // Invalidate sessionStorage so next getRemark call fetches fresh data
        const { date } = todayParts();
        sessionStorage.removeItem(SS_KEY(wardId, date));
        return await db.pushData(remarkPath(wardId), payload);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateRemark = async (wardId, remarkId, remarkData) => {
    if (!wardId || !remarkId) return { success: false, message: 'Invalid params' };
    try {
        const { date } = todayParts();
        sessionStorage.removeItem(SS_KEY(wardId, date));
        return await db.saveData(`${remarkPath(wardId)}/${remarkId}`, remarkData);
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteRemark = async (wardId, remarkId) => {
    if (!wardId || !remarkId) return { success: false, message: 'Invalid params' };
    try {
        const { date } = todayParts();
        sessionStorage.removeItem(SS_KEY(wardId, date));
        return await db.removeData(`${remarkPath(wardId)}/${remarkId}`);
    } catch (error) {
        return { success: false, message: error.message };
    }
};
