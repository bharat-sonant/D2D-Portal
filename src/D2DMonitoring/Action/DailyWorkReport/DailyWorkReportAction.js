import { getWardListAction } from '../D2DMonitoring/Monitoring/WardListAction';
import { fetchReportData } from '../../Services/DailyWorkReport/DailyWorkReportService';
import { saveReportToSupabase, getReportFromSupabase } from '../../Services/DailyWorkReportSupabase/DailyWorkReportSupabaseService';

// Refresh button — Firebase se latest data lao, Supabase se compare karo, sirf changed update karo
export const syncFromFirebase = async (city, date) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    const [freshRows, savedRows] = await Promise.all([
        fetchReportData(wards, date),
        getReportFromSupabase(city, date),
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
        await saveReportToSupabase(city, date, changedRows);
    }

    console.log(`[DWR Sync] changed: ${changedRows.length} / ${freshRows.length}`);

    // Updated data return karo
    return getReportFromSupabase(city, date);
};

// Step 1: Supabase mein data hai? → turant return
// Step 2: Firebase se fresh data → Supabase update → updated data return
export const loadReportData = async (city, date, onCacheHit) => {
    const wards = getWardListAction(city);
    if (!wards?.length) return [];

    // Supabase check (fast)
    const cached = await getReportFromSupabase(city, date);
    if (cached?.length) {
        onCacheHit(cached); // turant table dikhao
    }

    // Firebase se fresh data (background)
    const fresh = await fetchReportData(wards, date);
    await saveReportToSupabase(city, date, fresh);

    // Fresh data return karo (table update)
    const updated = await getReportFromSupabase(city, date);
    return updated;
};
