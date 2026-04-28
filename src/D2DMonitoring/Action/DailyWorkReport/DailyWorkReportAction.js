import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchReportData, scanDailyWorkTasks } from '../../Services/DailyWorkReport/DailyWorkReportService';
import { saveReportToSupabase, getReportFromSupabase } from '../../Services/DailyWorkReportSupabase/DailyWorkReportSupabaseService';

// Network flaky ho toh 3 attempts, har attempt ke baad wait badhta hai (1s, 2s)
const withRetry = async (fn, attempts = 3, delayMs = 1000) => {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            const isLast = i === attempts - 1;
            console.warn(`[DWR Retry] Attempt ${i + 1}/${attempts} failed: ${err.message}${isLast ? ' — giving up' : ' — retrying...'}`);
            if (isLast) throw err;
            await new Promise(res => setTimeout(res, delayMs * (i + 1)));
        }
    }
};

// Firebase camelCase → Supabase snake_case display format
// ward_halt_duration: future field — not yet computed, kept as null placeholder
const toDisplayFormat = (row) => ({
    zone: row.zone ?? null,
    duty_on: row.dutyOn ?? null,
    entered_ward_boundary: row.enteredWardBoundary ?? null,
    duty_off: row.dutyOff ?? null,
    vehicle: row.vehicle ?? null,
    driver: row.driver ?? null,
    helper: row.helper ?? null,
    second_helper: row.secondHelper ?? null,
    vehicle_reg_no: row.vehicleRegNo ?? null,
    trip_bins: row.tripBins ?? null,
    total_working_hrs: row.totalWorkingHrs ?? null,
    run_km: row.runKm ?? null,
    remark: row.remark ?? null,
    actual_work_percentage: row.actualWorkPercentage ?? null,
    work_percentage: row.workPercentage ?? null,
    zone_run_km: row.zoneRunKm ?? null,
    ward_halt_duration: row.haltDuration ?? null,
});

const toBinLiftingDisplayRow = (task, index) => ({
    zone: task?.zone ?? null,
    duty_on: task?.dutyOn ?? null,
    duty_off: task?.dutyOff ?? null,
    vehicle: task?.vehicle ?? null,
    vehicle_reg_no: task?.vehicleRegNo ?? null,
    driver: task?.driver ?? null,
    helper: task?.helper ?? null,
    second_helper: task?.secondHelper ?? null,
    is_bin_lifting_task: true,
    bin_lifting_order: index,
});

// "08:00:00" → "08:00" | "08:00" → "08:00" | null → null
// Supabase time type fetch pe seconds append karta hai, Firebase nahi karta
const normTime = (t) => (t ? String(t).slice(0, 5) : null);

// Session-level cache — avoids re-fetching Supabase on date switch
// Invalidated when sync runs so fresh data is always shown after sync
const reportCache = new Map(); // key: "city|date"

// Refresh button — Firebase se latest data lao, Supabase se compare karo, sirf changed update karo
export const syncFromFirebase = async (city, date) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const t0 = performance.now();
    const cacheKey = `${city}|${date}`;

    // Har case mein Firebase aur Supabase parallel fetch — sync hamesha latest Firebase data check karta hai
    // Past date ho ya today — user ne Sync dabaya matlab woh fresh data chahta hai
    const [freshRows, savedRows, binLiftingTasks] = await Promise.all([
        withRetry(() => fetchReportData(wards, date)),
        withRetry(() => getReportFromSupabase(city, date)),
        withRetry(() => scanDailyWorkTasks(date)),
    ]);

    const savedMap = Object.fromEntries(savedRows.map(r => [r.zone, r]));
    const changedRows = freshRows.filter(row => {
        if (!row.zone) return false;
        const saved = savedMap[row.zone];
        if (!saved) return true;
        return normTime(saved.duty_on) !== normTime(row.dutyOn ?? null) ||
            normTime(saved.duty_off) !== normTime(row.dutyOff ?? null) ||
            normTime(saved.entered_ward_boundary) !== normTime(row.enteredWardBoundary ?? null) ||
            saved.vehicle !== (row.vehicle ?? null) ||
            saved.driver !== (row.driver ?? null) ||
            saved.helper !== (row.helper ?? null) ||
            saved.second_helper !== (row.secondHelper ?? null) ||
            saved.vehicle_reg_no !== (row.vehicleRegNo ?? null) ||
            saved.trip_bins !== (row.tripBins ?? null) ||
            saved.total_working_hrs !== (row.totalWorkingHrs ?? null) ||
            saved.run_km !== (row.runKm ?? null) ||
            saved.remark !== (row.remark ?? null) ||
            saved.actual_work_percentage !== (row.actualWorkPercentage ?? null) ||
            saved.work_percentage !== (row.workPercentage ?? null) ||
            saved.zone_run_km !== (row.zoneRunKm ?? null) ||
            saved.ward_halt_duration !== (row.haltDuration ?? null);
    });

    let result;

    if (changedRows.length) {
        const sizeKB = (new TextEncoder().encode(JSON.stringify(changedRows)).length / 1024).toFixed(1);
        console.group(`[DWR Sync] ${changedRows.length} rows changed | ~${sizeKB} KB`);
        changedRows.forEach(row => {
            const saved = savedMap[row.zone];
            const diff = {};
            if (normTime(saved?.duty_on) !== normTime(row.dutyOn ?? null)) diff.duty_on = { old: saved?.duty_on, new: row.dutyOn };
            if (normTime(saved?.duty_off) !== normTime(row.dutyOff ?? null)) diff.duty_off = { old: saved?.duty_off, new: row.dutyOff };
            if (normTime(saved?.entered_ward_boundary) !== normTime(row.enteredWardBoundary ?? null)) diff.entered_ward_boundary = { old: saved?.entered_ward_boundary, new: row.enteredWardBoundary };
            if (saved?.vehicle !== (row.vehicle ?? null)) diff.vehicle = { old: saved?.vehicle, new: row.vehicle };
            if (saved?.driver !== (row.driver ?? null)) diff.driver = { old: saved?.driver, new: row.driver };
            if (saved?.helper !== (row.helper ?? null)) diff.helper = { old: saved?.helper, new: row.helper };
            if (saved?.second_helper !== (row.secondHelper ?? null)) diff.second_helper = { old: saved?.second_helper, new: row.secondHelper };
            if (saved?.vehicle_reg_no !== (row.vehicleRegNo ?? null)) diff.vehicle_reg_no = { old: saved?.vehicle_reg_no, new: row.vehicleRegNo };
            if (saved?.trip_bins !== (row.tripBins ?? null)) diff.trip_bins = { old: saved?.trip_bins, new: row.tripBins };
            if (saved?.total_working_hrs !== (row.totalWorkingHrs ?? null)) diff.total_working_hrs = { old: saved?.total_working_hrs, new: row.totalWorkingHrs };
            if (saved?.run_km !== (row.runKm ?? null)) diff.run_km = { old: saved?.run_km, new: row.runKm };
            if (saved?.remark !== (row.remark ?? null)) diff.remark = { old: saved?.remark, new: row.remark };
            if (saved?.actual_work_percentage !== (row.actualWorkPercentage ?? null)) diff.actual_work_percentage = { old: saved?.actual_work_percentage, new: row.actualWorkPercentage };
            if (saved?.work_percentage !== (row.workPercentage ?? null)) diff.work_percentage = { old: saved?.work_percentage, new: row.workPercentage };
            if (saved?.zone_run_km !== (row.zoneRunKm ?? null)) diff.zone_run_km = { old: saved?.zone_run_km, new: row.zoneRunKm };
            if (saved?.ward_halt_duration !== (row.haltDuration ?? null)) diff.ward_halt_duration = { old: saved?.ward_halt_duration, new: row.haltDuration };
            console.log(`  Zone: ${row.zone}`, diff);
        });
        console.groupEnd();
        try {
            // savedMap pass kiya — no extra Supabase fetch needed
            // (retry safety: UPDATE is idempotent; new-row INSERT on retry is an edge case)
            await withRetry(() => saveReportToSupabase(city, date, changedRows, savedMap));
        } catch (err) {
            console.error('[DWR Sync] Save failed:', err.message);
            throw err;
        }

        // Local merge — Supabase re-fetch hataaya, savedRows mein changes apply karo
        const changedZoneMap = Object.fromEntries(changedRows.map(r => [r.zone, toDisplayFormat(r)]));
        const merged = savedRows.map(r =>
            changedZoneMap[r.zone] ? { ...r, ...changedZoneMap[r.zone] } : r
        );
        const newRows = changedRows
            .filter(r => !savedMap[r.zone])
            .map(toDisplayFormat);
        result = [...merged, ...newRows];
    } else {
        console.log(`[DWR Sync] No changes detected`);
        result = savedRows;
    }

    if (binLiftingTasks.length) {
        result = [
            ...result,
            ...binLiftingTasks.map((task, index) => toBinLiftingDisplayRow(task, index)),
        ];
    }

    reportCache.set(cacheKey, result);
    console.log(`[DWR Sync] Total time: ${(performance.now() - t0).toFixed(0)}ms`);
    return result;
};

// Step 1: In-memory cache hit → turant show, return
// Step 2: Supabase mein data hai → onHit callback se turant show, return
// Step 3: Supabase mein data nahi → Firebase se fetch → Supabase save → return
export const loadReportData = async (city, date, onHit) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const t0 = performance.now();
    const cacheKey = `${city}|${date}`;

    // 1. In-memory session cache (date switch pe re-fetch nahi hoga)
    const inMemory = reportCache.get(cacheKey);
    if (inMemory?.length) {
        console.log(`[DWR Load] Memory hit: ${inMemory.length} rows | 0ms`);
        onHit?.(inMemory);
        return inMemory;
    }

    // 2. Supabase check
    const cached = await withRetry(() => getReportFromSupabase(city, date));
    if (cached?.length) {
        console.log(`[DWR Load] Supabase hit: ${cached.length} rows | ${(performance.now() - t0).toFixed(0)}ms`);
        reportCache.set(cacheKey, cached);
        onHit?.(cached);
        return cached;
    }

    // 3. Supabase mein data nahi — Firebase se fetch with progressive display
    console.log(`[DWR Load] Supabase miss — fetching from Firebase`);

    // Progressive: jaise jaise har ward ka data aata hai, turant UI mein dikhao
    // User ko pura load complete hone ka wait nahi karna padega
    const progressive = [];
    const onRow = (row) => {
        progressive.push(toDisplayFormat(row));
        onHit?.([...progressive]); // spread taaki React fresh reference dekhe
    };

    const fresh = await withRetry(() => fetchReportData(wards, date, onRow));
    try {
        await withRetry(() => saveReportToSupabase(city, date, fresh, {}));
    } catch (err) {
        console.error('[DWR Load] Save failed:', err.message);
        throw err;
    }

    const result = fresh.map(toDisplayFormat);
    reportCache.set(cacheKey, result);
    console.log(`[DWR Load] Firebase fetch done | ${(performance.now() - t0).toFixed(0)}ms`);
    return result;
};
