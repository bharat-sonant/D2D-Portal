/**
 * DailyWorkReport — Action Layer
 *
 * Cache priority:
 *   Ward list   →  localStorage (24h)          →  Firebase Storage
 *   Past date   →  localStorage (7d) + SWR     →  Firebase Realtime DB (subscriptions)
 *   Today       →  sessionStorage (30m SWR)    →  Firebase Realtime DB (live listeners)
 */

import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchAllZonesOnce, checkDutyInTimeAll, fetchZonesFull, subscribeAllZones } from '../../Services/DailyWorkReport/DailyWorkReportService';
import {
    getCachedWardList, setCachedWardList,
    getCachedReport,   setCachedReport,
    cleanExpiredCache,
    getTodayCache,     getStaleTodayCache,     setTodayCache,
} from '../../Services/DailyWorkReport/DailyWorkReportCache';


// ─── Cache cleanup ───────────────────────────────────────────────

export const initCacheCleanup = () => cleanExpiredCache();


// ─── Performance logging helpers ────────────────────────────────

const detectChanges = (cachedMap, latestRows) => {
    const changes = [];
    Object.values(latestRows).forEach(row => {
        const prev = cachedMap[row.wardId];
        if (!prev) { changes.push({ zone: row.zone, fields: ['new entry'] }); return; }
        const fields = [];
        if (prev.dutyOn              !== row.dutyOn)
            fields.push(`dutyOn: "${prev.dutyOn}" → "${row.dutyOn}"`);
        if (prev.enteredWardBoundary !== row.enteredWardBoundary)
            fields.push(`wardReached: "${prev.enteredWardBoundary}" → "${row.enteredWardBoundary}"`);
        if (prev.dutyOff             !== row.dutyOff)
            fields.push(`dutyOff: "${prev.dutyOff}" → "${row.dutyOff}"`);
        if (prev.vehicle             !== row.vehicle)
            fields.push(`vehicle: "${prev.vehicle}" → "${row.vehicle}"`);
        if (fields.length) changes.push({ zone: row.zone, fields });
    });
    return changes;
};

const logPerf = (label, cacheStatus, displayMs, totalMs, changes) => {
    console.group(
        `%c[DailyWorkReport] %c${label}`,
        'color:#667eea;font-weight:bold',
        'color:#334155;font-weight:bold'
    );
    console.log(`Cache   : ${cacheStatus} | Display: ${displayMs}ms | Total: ${totalMs}ms`);
    if (changes.length === 0) {
        console.log('%cChanges : No changes detected', 'color:#22c55e;font-weight:bold');
    } else {
        console.log(`%cChanges : ${changes.length} zone(s) updated`, 'color:#f59e0b;font-weight:bold');
        changes.forEach(({ zone, fields }) =>
            console.log(
                `  %c${zone}%c  ${fields.join(' | ')}`,
                'color:#334155;font-weight:bold',
                'color:#64748b'
            )
        );
    }
    console.groupEnd();
};

const logLiveUpdate = (zone, fields) => {
    console.log(
        `%c[DailyWorkReport] %cLive update → %c${zone}%c  ${fields.join(' | ')}`,
        'color:#667eea;font-weight:bold',
        'color:#f59e0b;font-weight:bold',
        'color:#334155;font-weight:bold',
        'color:#64748b'
    );
};

export const logDateSwitch = (date, isToday) => {
    console.log(
        `%c[DailyWorkReport] %cDate switched → %c${isToday ? `Today (${date})` : date}`,
        'color:#667eea;font-weight:bold',
        'color:#64748b',
        'color:#334155;font-weight:bold'
    );
};


// ─── Ward list ───────────────────────────────────────────────────

export const getWardsForReportAction = async (city) => {
    const cached = getCachedWardList(city);
    if (cached) return cached;
    const wards = await getWardListAction(city);
    if (wards?.length) setCachedWardList(city, wards);
    return wards || [];
};


// ─── Past date — getData (one-time, no subscription) ─────────────
// Cache hit  → instantly show → sirf dutyInTime check (103 tiny reads)
//              → changed zones ka full data fetch (N*2 reads)
// Cache miss → full fetch (206 reads)

export const loadPastDateAction = async (city, date, wards, setData, setLoading, signal) => {
    if (!wards?.length) return;

    const perfStart = performance.now();
    const cached    = getCachedReport(city, date);
    const cachedMap = {};

    if (cached) {
        // Cache hit — instantly show
        cached.forEach(r => { cachedMap[r.wardId] = r; });
        setData(cached);
        setLoading(false);
        const displayMs = Math.round(performance.now() - perfStart);

        // Background: sirf dutyInTime check karo (103 tiny reads, one-time)
        const checks = await checkDutyInTimeAll(wards, date);
        if (signal?.cancelled) return;

        const changedWards = wards.filter(w => {
            const check = checks.find(c => c.id === w.id);
            return check && cachedMap[w.id]?.dutyOn !== check.dutyOn;
        });

        if (changedWards.length === 0) {
            logPerf(date, 'HIT (localStorage)', displayMs, Math.round(performance.now() - perfStart), []);
            return;
        }

        // Sirf changed zones ka full data fetch karo
        const updatedRows = await fetchZonesFull(changedWards, date);
        if (signal?.cancelled) return;

        const updatedMap = Object.fromEntries(updatedRows.map(r => [r.wardId, r]));
        const newData    = cached.map(r => updatedMap[r.wardId] || r);

        setCachedReport(city, date, newData);
        setData(newData);

        const changes = detectChanges(cachedMap, updatedMap);
        logPerf(date, 'HIT (localStorage)', displayMs, Math.round(performance.now() - perfStart), changes);

    } else {
        // Cache miss — full fetch
        setLoading(true);
        try {
            const data = await fetchAllZonesOnce(wards, date);
            if (signal?.cancelled) return;
            if (data?.length) setCachedReport(city, date, data);
            setData(data);
            logPerf(date, 'MISS', 0, Math.round(performance.now() - perfStart), []);
        } catch {
            if (!signal?.cancelled) setData([]);
        } finally {
            if (!signal?.cancelled) setLoading(false);
        }
    }
};


// ─── Today — realtime + performance log ─────────────────────────

export const subscribeTodayAction = (wards, date, setData, setLoading, city) => {
    if (!wards?.length) return () => {};

    const perfStart  = performance.now();
    const freshCache = getTodayCache(city, date);
    const staleCache = !freshCache ? getStaleTodayCache(city, date) : null;
    const cached     = freshCache || staleCache;
    const cachedMap  = {};
    let displayMs    = 0;
    let cacheStatus  = 'MISS';

    if (cached) {
        cached.forEach(r => { cachedMap[r.wardId] = r; });
        setData(cached);
        setLoading(false);
        displayMs   = Math.round(performance.now() - perfStart);
        cacheStatus = freshCache ? 'FRESH (sessionStorage)' : 'STALE (sessionStorage)';
    } else {
        setData(wards.map(({ id, name }) => ({
            wardId: id, zone: name,
            dutyOn: null, enteredWardBoundary: null, dutyOff: null, vehicle: null,
        })));
        setLoading(true);
    }

    const reported       = new Set();
    const latestRows     = {};
    let   initialLogDone = false;
    const loadingTimeout = !cached ? setTimeout(() => setLoading(false), 3000) : null;

    const unsubscribe = subscribeAllZones(wards, date, (row) => {
        reported.add(row.wardId);
        latestRows[row.wardId] = row;

        if (reported.size >= wards.length && !initialLogDone) {
            // Initial load complete — performance log
            initialLogDone = true;
            if (loadingTimeout) clearTimeout(loadingTimeout);
            setLoading(false);
            const totalMs = Math.round(performance.now() - perfStart);
            const changes = detectChanges(cachedMap, latestRows);
            logPerf(`Today (${date})`, cacheStatus, displayMs, totalMs, changes);
            setTodayCache(city, date, Object.values(latestRows));
            // cachedMap update karo future live comparisons ke liye
            Object.values(latestRows).forEach(r => { cachedMap[r.wardId] = { ...r }; });

        } else if (initialLogDone) {
            // Live update (initial load ke baad aaya change)
            const cur = cachedMap[row.wardId];
            if (cur) {
                const fields = [];
                if (cur.dutyOn              !== row.dutyOn)
                    fields.push(`dutyOn: "${cur.dutyOn}" → "${row.dutyOn}"`);
                if (cur.enteredWardBoundary !== row.enteredWardBoundary)
                    fields.push(`wardReached: "${cur.enteredWardBoundary}" → "${row.enteredWardBoundary}"`);
                if (cur.dutyOff             !== row.dutyOff)
                    fields.push(`dutyOff: "${cur.dutyOff}" → "${row.dutyOff}"`);
                if (cur.vehicle             !== row.vehicle)
                    fields.push(`vehicle: "${cur.vehicle}" → "${row.vehicle}"`);
                if (fields.length) {
                    logLiveUpdate(row.zone, fields);
                    cachedMap[row.wardId] = { ...row };
                }
            }
        }

        // Sirf changed rows update karo
        setData(prev => {
            const idx = prev.findIndex(r => r.wardId === row.wardId);
            if (idx < 0) return [...prev, row];
            const cur = prev[idx];
            if (
                cur.dutyOn              === row.dutyOn &&
                cur.enteredWardBoundary === row.enteredWardBoundary &&
                cur.dutyOff             === row.dutyOff &&
                cur.vehicle             === row.vehicle
            ) return prev;
            const next = [...prev];
            next[idx] = row;
            return next;
        });
    });

    return () => { if (loadingTimeout) clearTimeout(loadingTimeout); unsubscribe(); };
};
