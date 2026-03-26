import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchAllZonesOnce, subscribeAllZones } from '../../Services/DailyWorkReport/DailyWorkReportService';

export const initCacheCleanup = () => {};

export const logDateSwitch = (date, isToday) => {
    console.log(
        `%c[DailyWorkReport] %cDate switched → %c${isToday ? `Today (${date})` : date}`,
        'color:#667eea;font-weight:bold',
        'color:#64748b',
        'color:#334155;font-weight:bold'
    );
};

export const getWardsForReportAction = (city) => getWardListAction(city);

export const loadPastDateAction = async (city, date, wards, setData, setLoading, signal) => {
    if (!wards?.length) return;
    setLoading(true);
    try {
        const data = await fetchAllZonesOnce(wards, date);
        if (signal?.cancelled) return;
        setData(data);
    } catch {
        if (!signal?.cancelled) setData([]);
    } finally {
        if (!signal?.cancelled) setLoading(false);
    }
};

export const subscribeTodayAction = (wards, date, setData, setLoading) => {
    if (!wards?.length) return () => {};

    setData(wards.map(({ id, name }) => ({
        wardId: id, zone: name,
        dutyOn: null, enteredWardBoundary: null, dutyOff: null, vehicle: null,
    })));
    setLoading(true);

    const reported       = new Set();
    let   initialLogDone = false;
    const loadingTimeout = setTimeout(() => setLoading(false), 3000);

    const unsubscribe = subscribeAllZones(wards, date, (row) => {
        reported.add(row.wardId);

        if (reported.size >= wards.length && !initialLogDone) {
            initialLogDone = true;
            clearTimeout(loadingTimeout);
            setLoading(false);
        }

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

    return () => { clearTimeout(loadingTimeout); unsubscribe(); };
};
