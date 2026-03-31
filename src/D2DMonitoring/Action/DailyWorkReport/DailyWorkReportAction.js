import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchAllZonesOnce, checkDutyInTimeAll, fetchZonesFull, subscribeAllZones } from '../../Services/DailyWorkReport/DailyWorkReportService';
import {
    getCachedWardList, setCachedWardList,
    getCachedReport,   setCachedReport,
    cleanExpiredCache,
    getTodayCache,     getStaleTodayCache,     setTodayCache,
} from '../../Services/DailyWorkReport/DailyWorkReportCache';


// ─── Cache cleanup ────────────────────────────────────────────────

export const initCacheCleanup = () => cleanExpiredCache();


// ─── Log ─────────────────────────────────────────────────────────

export const logDateSwitch = (date, isToday) => {
    console.log(
        `%c[DailyWorkReport] %cDate switched → %c${isToday ? `Today (${date})` : date}`,
        'color:#667eea;font-weight:bold',
        'color:#64748b',
        'color:#334155;font-weight:bold'
    );
};


// ─── Ward list ───────────────────────────────────────────────────
// localStorage 24h cache — ward list rarely changes

export const getWardsForReportAction = async (city) => {
    const cached = getCachedWardList(city);
    if (cached) return cached;
    const wards = getWardListAction(city);
    if (wards?.length) setCachedWardList(city, wards);
    return wards || [];
};


// ─── Past date ───────────────────────────────────────────────────
// Cache hit  → instant show → background dutyInTime check → sirf changed zones fetch
// Cache miss → full fetch → localStorage mein save (7 days)

export const loadPastDateAction = async (city, date, wards, setData, setLoading, signal) => {
    if (!wards?.length) return;

    const cached = getCachedReport(city, date);

    if (cached) {
        // ── Cache hit: instantly show ──
        setData(cached);
        setLoading(false);

        // Background: sirf dutyInTime check (103 tiny reads)
        const checks = await checkDutyInTimeAll(wards, date);
        if (signal?.cancelled) return;

        const cachedMap    = Object.fromEntries(cached.map(r => [r.wardId, r]));
        const changedWards = wards.filter(w => {
            const check = checks.find(c => c.id === w.id);
            return check && cachedMap[w.id]?.dutyOn !== check.dutyOn;
        });

        if (changedWards.length === 0) return; // koi change nahi — done

        // Sirf changed zones ka full data fetch
        const updatedRows = await fetchZonesFull(changedWards, date);
        if (signal?.cancelled) return;

        const updatedMap = Object.fromEntries(updatedRows.map(r => [r.wardId, r]));
        const newData    = cached.map(r => updatedMap[r.wardId] || r);

        setCachedReport(city, date, newData);
        setData(newData);

    } else {
        // ── Cache miss: full fetch ──
        setLoading(true);
        try {
            const data = await fetchAllZonesOnce(wards, date);
            if (signal?.cancelled) return;
            if (data?.length) setCachedReport(city, date, data);
            setData(data);
        } catch {
            if (!signal?.cancelled) setData([]);
        } finally {
            if (!signal?.cancelled) setLoading(false);
        }
    }
};


// ─── Today ───────────────────────────────────────────────────────
// sessionStorage 30min cache (SWR: stale cache bhi instantly show karo)
// Fresh/stale cache → instantly show → Firebase subscribe → update + save cache
// No cache → empty rows + loader → Firebase subscribe → data aate hi update

export const subscribeTodayAction = (wards, date, setData, setLoading, city) => {
    if (!wards?.length) return () => {};

    const freshCache = getTodayCache(city, date);
    const staleCache = !freshCache ? getStaleTodayCache(city, date) : null;
    const cached     = freshCache || staleCache;

    // Cache ho ya na ho — table turant dikhao, loader kabhi nahi
    setData(cached || wards.map(({ id, name }) => ({
        wardId: id, zone: name,
        dutyOn: null, enteredWardBoundary: null, dutyOff: null, vehicle: null,
    })));
    setLoading(false);

    const reported   = new Set();
    const latestRows = {};
    let   allDone    = false;

    const unsubscribe = subscribeAllZones(wards, date, (row) => {
        reported.add(row.wardId);
        latestRows[row.wardId] = row;

        // Jab sab zones ka data aa jaye — cache save karo
        if (reported.size >= wards.length && !allDone) {
            allDone = true;
            setTodayCache(city, date, Object.values(latestRows));
        } else if (allDone) {
            // Live update — cache update karo
            setTodayCache(city, date, Object.values(latestRows));
        }

        // Service ne raw string check karke hi yahan bheja hai — seedha update karo
        setData(prev => {
            const idx = prev.findIndex(r => r.wardId === row.wardId);
            if (idx < 0) return [...prev, row];
            const next = [...prev];
            next[idx] = row;
            return next;
        });
    });

    return () => unsubscribe();
};
