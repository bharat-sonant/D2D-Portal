import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchReportData, scanDailyWorkTasks } from '../../Services/DailyWorkReport/DailyWorkReportService';
import { saveReportToSupabase, getReportFromSupabase } from '../../Services/DailyWorkReportSupabase/DailyWorkReportSupabaseService';

const BIN_LIFTING_PREFIX = '__bin_lifting__::';

const encodeBinLiftingZone = (task, index) =>
    `${BIN_LIFTING_PREFIX}${task?.planId ?? String(index ?? 0).padStart(4, '0')}::${task?.zone ?? ''}`;

const parseBinLiftingZone = (zone) => {
    if (!zone || !String(zone).startsWith(BIN_LIFTING_PREFIX)) return null;
    const payload = String(zone).slice(BIN_LIFTING_PREFIX.length);
    const [order, ...zoneParts] = payload.split('::');
    return {
        order: Number(order) || 0,
        displayZone: zoneParts.join('::') || null,
    };
};

// Network flaky ho toh 3 attempts, har attempt ke baad wait badhta hai (1s, 2s)
const withRetry = async (fn, attempts = 3, delayMs = 1000) => {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            const isLast = i === attempts - 1;
            console.warn(`[DWR Retry] Attempt ${i + 1}/${attempts} failed: ${err.message}${isLast ? ' â€” giving up' : ' â€” retrying...'}`);
            if (isLast) throw err;
            await new Promise(res => setTimeout(res, delayMs * (i + 1)));
        }
    }
};

// Firebase camelCase â†’ Supabase snake_case display format
// ward_halt_duration: future field â€” not yet computed, kept as null placeholder
const toDisplayFormat = (row) => ({
    id: row.id ?? null,
    zone: row.zone ?? null,
    display_zone: row.displayZone ?? row.display_zone ?? null,
    trip_bins_display: row.tripBinsDisplay ?? row.trip_bins_display ?? null,
    duty_on: row.dutyOn ?? row.duty_on ?? null,
    entered_ward_boundary: row.enteredWardBoundary ?? row.entered_ward_boundary ?? null,
    duty_off: row.dutyOff ?? row.duty_off ?? null,
    vehicle: row.vehicle ?? null,
    driver: row.driver ?? null,
    helper: row.helper ?? null,
    second_helper: row.secondHelper ?? row.second_helper ?? null,
    vehicle_reg_no: row.vehicleRegNo ?? row.vehicle_reg_no ?? null,
    trip_bins: row.tripBins ?? row.trip_bins ?? null,
    total_working_hrs: row.totalWorkingHrs ?? row.total_working_hrs ?? null,
    run_km: row.runKm ?? row.run_km ?? null,
    remark: row.remark ?? null,
    actual_work_percentage: row.actualWorkPercentage ?? row.actual_work_percentage ?? null,
    work_percentage: row.workPercentage ?? row.work_percentage ?? null,
    zone_run_km: row.zoneRunKm ?? row.zone_run_km ?? null,
    ward_halt_duration: row.haltDuration ?? row.ward_halt_duration ?? null,
    is_bin_lifting_task: row.isBinLiftingTask ?? row.is_bin_lifting_task ?? false,
    bin_lifting_order: row.binLiftingOrder ?? row.bin_lifting_order ?? null,
});

const toBinLiftingDisplayRow = (task, index) => ({
    zone: encodeBinLiftingZone(task, index),
    display_zone: task?.zone ?? null,
    trip_bins_display: task?.tripBinsDisplay ?? null,
    duty_on: task?.dutyOn ?? null,
    duty_off: task?.dutyOff ?? null,
    vehicle: task?.vehicle ?? null,
    vehicle_reg_no: task?.vehicleRegNo ?? null,
    driver: task?.driver ?? null,
    helper: task?.helper ?? null,
    second_helper: task?.secondHelper ?? null,
    trip_bins: task?.tripBins ?? null,
    total_working_hrs: task?.totalWorkingHrs ?? null,
    work_percentage: task?.workPercentage ?? null,
    is_bin_lifting_task: true,
    bin_lifting_order: index,
});

const buildBinLiftingRows = (tasks = []) =>
    tasks.map((task, index) => toBinLiftingDisplayRow(task, index));

const fetchCombinedFirebaseRows = async (wards, date, onRow) => {
    const [freshRows, binLiftingTasks] = await Promise.all([
        fetchReportData(wards, date, onRow),
        scanDailyWorkTasks(date),
    ]);

    return {
        freshRows,
        binLiftingRows: buildBinLiftingRows(binLiftingTasks),
    };
};

const mergeLatestBinLiftingRows = (rows, binLiftingTasks) => {
    const nextBinRows = buildBinLiftingRows(binLiftingTasks);
    if (!nextBinRows.length) return dedupeRows(rows);
    const baseRows = rows.filter(row => !row.is_bin_lifting_task);
    return dedupeRows([...baseRows, ...nextBinRows]);
};

const dedupeRows = (rows) => {
    const map = new Map();
    rows.forEach((row) => {
        const key = row.is_bin_lifting_task
            ? `bin:${row.display_zone ?? row.zone}|${row.duty_on ?? ''}|${row.duty_off ?? ''}|${row.vehicle ?? ''}|${row.driver ?? ''}|${row.helper ?? ''}|${row.second_helper ?? ''}|${row.trip_bins_display ?? row.trip_bins ?? ''}`
            : `zone:${row.zone ?? ''}`;
        map.set(key, row);
    });
    return [...map.values()];
};

const hydrateStoredRows = (rows) =>
    dedupeRows(rows.map((row) => {
        const parsed = parseBinLiftingZone(row.zone);
        if (!parsed) return toDisplayFormat(row);
        return toDisplayFormat({
            ...row,
            display_zone: parsed.displayZone,
            is_bin_lifting_task: true,
            bin_lifting_order: parsed.order,
        });
    }));

// "08:00:00" â†’ "08:00" | "08:00" â†’ "08:00" | null â†’ null
// Supabase time type fetch pe seconds append karta hai, Firebase nahi karta
const normTime = (t) => (t ? String(t).slice(0, 5) : null);

const rowsEqual = (saved, row) =>
    normTime(saved?.duty_on) === normTime(row.dutyOn ?? row.duty_on ?? null) &&
    normTime(saved?.duty_off) === normTime(row.dutyOff ?? row.duty_off ?? null) &&
    normTime(saved?.entered_ward_boundary) === normTime(row.enteredWardBoundary ?? row.entered_ward_boundary ?? null) &&
    saved?.vehicle === (row.vehicle ?? null) &&
    saved?.driver === (row.driver ?? null) &&
    saved?.helper === (row.helper ?? null) &&
    saved?.second_helper === (row.secondHelper ?? row.second_helper ?? null) &&
    saved?.vehicle_reg_no === (row.vehicleRegNo ?? row.vehicle_reg_no ?? null) &&
    saved?.trip_bins === (row.tripBins ?? row.trip_bins ?? null) &&
    saved?.total_working_hrs === (row.totalWorkingHrs ?? row.total_working_hrs ?? null) &&
    saved?.run_km === (row.runKm ?? row.run_km ?? null) &&
    saved?.remark === (row.remark ?? null) &&
    saved?.actual_work_percentage === (row.actualWorkPercentage ?? row.actual_work_percentage ?? null) &&
    saved?.work_percentage === (row.workPercentage ?? row.work_percentage ?? null) &&
    saved?.zone_run_km === (row.zoneRunKm ?? row.zone_run_km ?? null) &&
    saved?.ward_halt_duration === (row.haltDuration ?? row.ward_halt_duration ?? null);

// Session-level cache â€” avoids re-fetching Supabase on date switch
// Invalidated when sync runs so fresh data is always shown after sync
const reportCache = new Map(); // key: "city|date"

// Refresh button â€” Firebase se latest data lao, Supabase se compare karo, sirf changed update karo
export const syncFromFirebase = async (city, date) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const t0 = performance.now();
    const cacheKey = `${city}|${date}`;

    const [{ freshRows, binLiftingRows }, savedRowsRaw] = await Promise.all([
        withRetry(() => fetchCombinedFirebaseRows(wards, date)),
        withRetry(() => getReportFromSupabase(city, date)),
    ]);

    const savedRows = hydrateStoredRows(savedRowsRaw);
    const savedMap = Object.fromEntries(savedRows.map(r => [r.zone, r]));

    const changedWardRows = freshRows.filter(row => row.zone && (!savedMap[row.zone] || !rowsEqual(savedMap[row.zone], row)));
    const changedBinRows = binLiftingRows.filter(row => row.zone && (!savedMap[row.zone] || !rowsEqual(savedMap[row.zone], row)));
    const rowsToSave = [...changedWardRows, ...changedBinRows];

    let result;

    if (rowsToSave.length) {
        const sizeKB = (new TextEncoder().encode(JSON.stringify(rowsToSave)).length / 1024).toFixed(1);
        console.group(`[DWR Sync] ${rowsToSave.length} rows changed | ~${sizeKB} KB`);
        rowsToSave.forEach(row => {
            const saved = savedMap[row.zone];
            const diff = {};
            if (normTime(saved?.duty_on) !== normTime(row.dutyOn ?? row.duty_on ?? null)) diff.duty_on = { old: saved?.duty_on, new: row.dutyOn ?? row.duty_on ?? null };
            if (normTime(saved?.duty_off) !== normTime(row.dutyOff ?? row.duty_off ?? null)) diff.duty_off = { old: saved?.duty_off, new: row.dutyOff ?? row.duty_off ?? null };
            if (normTime(saved?.entered_ward_boundary) !== normTime(row.enteredWardBoundary ?? row.entered_ward_boundary ?? null)) diff.entered_ward_boundary = { old: saved?.entered_ward_boundary, new: row.enteredWardBoundary ?? row.entered_ward_boundary ?? null };
            if (saved?.vehicle !== (row.vehicle ?? null)) diff.vehicle = { old: saved?.vehicle, new: row.vehicle };
            if (saved?.driver !== (row.driver ?? null)) diff.driver = { old: saved?.driver, new: row.driver };
            if (saved?.helper !== (row.helper ?? null)) diff.helper = { old: saved?.helper, new: row.helper };
            if (saved?.second_helper !== (row.secondHelper ?? row.second_helper ?? null)) diff.second_helper = { old: saved?.second_helper, new: row.secondHelper ?? row.second_helper ?? null };
            if (saved?.vehicle_reg_no !== (row.vehicleRegNo ?? row.vehicle_reg_no ?? null)) diff.vehicle_reg_no = { old: saved?.vehicle_reg_no, new: row.vehicleRegNo ?? row.vehicle_reg_no ?? null };
            if (saved?.trip_bins !== (row.tripBins ?? row.trip_bins ?? null)) diff.trip_bins = { old: saved?.trip_bins, new: row.tripBins ?? row.trip_bins ?? null };
            if (saved?.total_working_hrs !== (row.totalWorkingHrs ?? row.total_working_hrs ?? null)) diff.total_working_hrs = { old: saved?.total_working_hrs, new: row.totalWorkingHrs ?? row.total_working_hrs ?? null };
            if (saved?.run_km !== (row.runKm ?? row.run_km ?? null)) diff.run_km = { old: saved?.run_km, new: row.runKm ?? row.run_km ?? null };
            if (saved?.remark !== (row.remark ?? null)) diff.remark = { old: saved?.remark, new: row.remark };
            if (saved?.actual_work_percentage !== (row.actualWorkPercentage ?? row.actual_work_percentage ?? null)) diff.actual_work_percentage = { old: saved?.actual_work_percentage, new: row.actualWorkPercentage ?? row.actual_work_percentage ?? null };
            if (saved?.work_percentage !== (row.workPercentage ?? row.work_percentage ?? null)) diff.work_percentage = { old: saved?.work_percentage, new: row.workPercentage ?? row.work_percentage ?? null };
            if (saved?.zone_run_km !== (row.zoneRunKm ?? row.zone_run_km ?? null)) diff.zone_run_km = { old: saved?.zone_run_km, new: row.zoneRunKm ?? row.zone_run_km ?? null };
            if (saved?.ward_halt_duration !== (row.haltDuration ?? row.ward_halt_duration ?? null)) diff.ward_halt_duration = { old: saved?.ward_halt_duration, new: row.haltDuration ?? row.ward_halt_duration ?? null };
            console.log(`  Zone: ${row.display_zone ?? row.zone}`, diff);
        });
        console.groupEnd();
        try {
            await withRetry(() => saveReportToSupabase(city, date, rowsToSave, savedMap));
        } catch (err) {
            console.error('[DWR Sync] Save failed:', err.message);
            throw err;
        }

        const changedZoneMap = Object.fromEntries(rowsToSave.map(r => [r.zone, toDisplayFormat(r)]));
        const merged = savedRows.map(r =>
            changedZoneMap[r.zone] ? { ...r, ...changedZoneMap[r.zone] } : r
        );
        const newRows = rowsToSave
            .filter(r => !savedMap[r.zone])
            .map(toDisplayFormat);
        result = dedupeRows([...merged, ...newRows]);
    } else {
        console.log(`[DWR Sync] No changes detected`);
        result = savedRows;
    }

    reportCache.set(cacheKey, result);
    console.log(`[DWR Sync] Total time: ${(performance.now() - t0).toFixed(0)}ms`);
    return result;
};

// Step 1: In-memory cache hit â†’ turant show, return
// Step 2: Supabase mein data hai â†’ onHit callback se turant show, return
// Step 3: Supabase mein data nahi â†’ Firebase se fetch â†’ Supabase save â†’ return
export const loadReportData = async (city, date, onHit) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const t0 = performance.now();
    const cacheKey = `${city}|${date}`;

    const inMemory = reportCache.get(cacheKey);
    if (inMemory?.length) {
        const [, binLiftingTasks] = await Promise.all([
            Promise.resolve(inMemory),
            withRetry(() => scanDailyWorkTasks(date)),
        ]);
        const merged = mergeLatestBinLiftingRows(inMemory, binLiftingTasks);
        console.log(`[DWR Load] Memory hit: ${merged.length} rows | 0ms`);
        reportCache.set(cacheKey, merged);
        onHit?.(merged);
        return merged;
    }

    const [cachedRaw, binLiftingTasks] = await Promise.all([
        withRetry(() => getReportFromSupabase(city, date)),
        withRetry(() => scanDailyWorkTasks(date)),
    ]);
    const cached = hydrateStoredRows(cachedRaw);
    if (cached?.length) {
        const merged = mergeLatestBinLiftingRows(cached, binLiftingTasks);
        if (binLiftingTasks.length) {
            const existingMap = Object.fromEntries(cached.filter(r => r.id && r.zone).map(r => [r.zone, r]));
            await withRetry(() => saveReportToSupabase(city, date, buildBinLiftingRows(binLiftingTasks), existingMap));
        }
        console.log(`[DWR Load] Supabase hit: ${merged.length} rows | ${(performance.now() - t0).toFixed(0)}ms`);
        reportCache.set(cacheKey, merged);
        onHit?.(merged);
        return merged;
    }

    console.log(`[DWR Load] Supabase miss â€” fetching from Firebase`);

    const progressive = [];
    const onRow = (row) => {
        progressive.push(toDisplayFormat(row));
        onHit?.([...progressive]);
    };

    const { freshRows: fresh, binLiftingRows } = await withRetry(() => fetchCombinedFirebaseRows(wards, date, onRow));

    try {
        await withRetry(() => saveReportToSupabase(city, date, [...fresh, ...binLiftingRows], {}));
    } catch (err) {
        console.error('[DWR Load] Save failed:', err.message);
        throw err;
    }

    const result = dedupeRows([...fresh.map(toDisplayFormat), ...binLiftingRows]);
    reportCache.set(cacheKey, result);
    onHit?.(result);
    console.log(`[DWR Load] Firebase fetch done | ${(performance.now() - t0).toFixed(0)}ms`);
    return result;
};
