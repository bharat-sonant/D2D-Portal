/**
 * DailyWorkReport — Action Layer
 *
 * Cache priority:
 *   Ward list   →  localStorage (24h)  →  Firebase Storage
 *   Past date   →  localStorage (15d)  →  Firebase Realtime DB (parallel)
 *   Today       →  NO cache            →  Firebase Realtime DB (live listeners)
 */

import dayjs from 'dayjs';
import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchAllZonesOnce, subscribeAllZones } from '../../Services/DailyWorkReport/DailyWorkReportService';
import {
    getCachedWardList, setCachedWardList,
    getCachedReport,   setCachedReport,
    cleanExpiredCache,
} from '../../Services/DailyWorkReport/DailyWorkReportCache';

const isToday = (date) => date === dayjs().format('YYYY-MM-DD');

// ─── Cache cleanup ───────────────────────────────────────────────

/** Page mount pe ek baar call karo. */
export const initCacheCleanup = () => cleanExpiredCache();

// ─── Ward list ───────────────────────────────────────────────────

/**
 * localStorage → Firebase Storage (ek baar sirf pehli load mein)
 *
 * @param {string} city  URL param, e.g. "Sikar"
 * @returns {Promise<Array<{id, name}>>}
 */
export const getWardsForReportAction = async (city) => {
    const cached = getCachedWardList(city);
    if (cached) return cached;

    const wards = await getWardListAction(city);
    if (wards?.length) setCachedWardList(city, wards);
    return wards || [];
};

// ─── Past date data ──────────────────────────────────────────────

/**
 * localStorage → Firebase (parallel Promise.all)
 * Cache hit → instant, no loader.
 * Cache miss → loader → fetch → cache → show.
 *
 * @param {string}   city
 * @param {string}   date       "YYYY-MM-DD"
 * @param {Array}    wards      [{id, name}]
 * @param {function} setData
 * @param {function} setLoading
 */
export const loadPastDateAction = async (city, date, wards, setData, setLoading) => {
    const cached = getCachedReport(city, date);
    if (cached) {
        setData(cached);
        return; // instant — no loader
    }

    setLoading(true);
    try {
        const data = await fetchAllZonesOnce(wards, date);
        if (data?.length) setCachedReport(city, date, data);
        setData(data);
    } catch {
        setData([]);
    } finally {
        setLoading(false);
    }
};

// ─── Today — realtime ────────────────────────────────────────────

/**
 * Har zone pe live listener lagata hai.
 * Pehla onValue callback almost instantly fire hota hai (current data).
 * Baad ke callbacks sirf us ek row ko update karte hain.
 *
 * Rows tab tak "-" dikhate hain jab tak data na aaye.
 * Jab sab zones ka pehla callback aa jaye → setLoading(false).
 *
 * @param {Array}    wards      [{id, name}]
 * @param {string}   date       "YYYY-MM-DD"
 * @param {function} setData
 * @param {function} setLoading
 * @returns {function}          unsubscribe
 */
export const subscribeTodayAction = (wards, date, setData, setLoading) => {
    if (!wards?.length) return () => {};

    // Turant empty rows dikhao (no blank screen)
    setData(wards.map(({ id, name }) => ({
        wardId: id, zone: name,
        dutyOn: null, enteredWardBoundary: null, dutyOff: null, vehicle: null,
    })));
    setLoading(true);

    // Track initial callbacks — jab sab aa jaayein tab loading band karo
    const reported = new Set();

    const unsubscribe = subscribeAllZones(wards, date, (row) => {
        reported.add(row.wardId);
        if (reported.size >= wards.length) setLoading(false);

        setData(prev => {
            const idx = prev.findIndex(r => r.wardId === row.wardId);
            if (idx < 0) return [...prev, row];
            const next = [...prev];
            next[idx] = row;
            return next;
        });
    });

    return unsubscribe;
};
