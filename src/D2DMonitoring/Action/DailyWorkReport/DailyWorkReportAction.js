import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchReportData } from '../../Services/DailyWorkReport/DailyWorkReportService';
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

// Refresh button — Firebase se latest data lao, Supabase se compare karo, sirf changed update karo
export const syncFromFirebase = async (city, date) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const t0 = performance.now();

    const [freshRows, savedRows] = await Promise.all([
        withRetry(() => fetchReportData(wards, date)),
        withRetry(() => getReportFromSupabase(city, date)),
    ]);

    const savedMap    = Object.fromEntries(savedRows.map(r => [r.zone, r]));
    const changedRows = freshRows.filter(row => {
        if (!row.zone) return false;
        const saved = savedMap[row.zone];
        if (!saved) return true;
        return saved.duty_on               !== (row.dutyOn              ?? null) ||
               saved.duty_off              !== (row.dutyOff             ?? null) ||
               saved.entered_ward_boundary !== (row.enteredWardBoundary ?? null) ||
               saved.vehicle               !== (row.vehicle             ?? null) ||
               saved.driver                !== (row.driver              ?? null) ||
               saved.helper                !== (row.helper              ?? null) ||
               saved.second_helper         !== (row.secondHelper        ?? null);
    });

    if (changedRows.length) {
        const sizeKB = (new TextEncoder().encode(JSON.stringify(changedRows)).length / 1024).toFixed(1);
        console.group(`[DWR Sync] ${changedRows.length} rows changed | ~${sizeKB} KB`);
        changedRows.forEach(row => {
            const saved = savedMap[row.zone];
            const diff  = {};
            if (saved?.duty_on               !== (row.dutyOn              ?? null)) diff.duty_on               = { old: saved?.duty_on,               new: row.dutyOn };
            if (saved?.duty_off              !== (row.dutyOff             ?? null)) diff.duty_off              = { old: saved?.duty_off,              new: row.dutyOff };
            if (saved?.entered_ward_boundary !== (row.enteredWardBoundary ?? null)) diff.entered_ward_boundary = { old: saved?.entered_ward_boundary, new: row.enteredWardBoundary };
            if (saved?.vehicle               !== (row.vehicle             ?? null)) diff.vehicle               = { old: saved?.vehicle,               new: row.vehicle };
            if (saved?.driver                !== (row.driver              ?? null)) diff.driver                = { old: saved?.driver,                new: row.driver };
            if (saved?.helper                !== (row.helper              ?? null)) diff.helper                = { old: saved?.helper,                new: row.helper };
            if (saved?.second_helper         !== (row.secondHelper        ?? null)) diff.second_helper         = { old: saved?.second_helper,         new: row.secondHelper };
            console.log(`  Zone: ${row.zone}`, diff);
        });
        console.groupEnd();
        try {
            // savedMap pass nahi kiya — retry pe fresh existingMap fetch hoga, duplicate inserts se bachne ke liye
            await withRetry(() => saveReportToSupabase(city, date, changedRows));
        } catch (err) {
            console.error('[DWR Sync] Save failed:', err.message);
            throw err;
        }
    } else {
        console.log(`[DWR Sync] No changes detected`);
    }

    console.log(`[DWR Sync] Total time: ${(performance.now() - t0).toFixed(0)}ms`);

    return withRetry(() => getReportFromSupabase(city, date));
};

// Step 1: Supabase mein data hai → onHit callback se turant show, return
// Step 2: Supabase mein data nahi → Firebase se fetch → Supabase save → return
export const loadReportData = async (city, date, onHit) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const t0 = performance.now();

    // Supabase check
    const cached = await withRetry(() => getReportFromSupabase(city, date));
    if (cached?.length) {
        console.log(`[DWR Load] Supabase hit: ${cached.length} rows | ${(performance.now() - t0).toFixed(0)}ms`);
        onHit?.(cached);
        return cached;
    }

    // Supabase mein data nahi — Firebase se fetch
    console.log(`[DWR Load] Supabase miss — fetching from Firebase`);
    const fresh = await withRetry(() => fetchReportData(wards, date));
    try {
        await withRetry(() => saveReportToSupabase(city, date, fresh));
    } catch (err) {
        console.error('[DWR Load] Save failed:', err.message);
        throw err;
    }

    const updated = await withRetry(() => getReportFromSupabase(city, date));
    console.log(`[DWR Load] Firebase fetch done | ${(performance.now() - t0).toFixed(0)}ms`);
    return updated;
};
