import { getDataByColumns, saveData, updateData } from '../../../services/supabaseServices';

export const getReportFromSupabase = async (city, date) => {
    const res = await getDataByColumns('daily_work_report', { city, date });
    return res?.data || [];
};

const buildPayload = (city, date, row) => ({
    city,
    date,
    zone:                  row.zone               ?? null,
    duty_on:               row.dutyOn             ?? null,
    entered_ward_boundary: row.enteredWardBoundary ?? null,
    duty_off:              row.dutyOff             ?? null,
    vehicle:               row.vehicle             ?? null,
    driver:                row.driver              ?? null,
    helper:                row.helper              ?? null,
    second_helper:         row.secondHelper        ?? null,
});

export const saveReportToSupabase = async (city, date, rows, existingMap = null) => {
    if (!city || !date || !rows?.length) return;

    const resolvedMap = existingMap ?? Object.fromEntries(
        ((await getDataByColumns('daily_work_report', { city, date }))?.data || []).map(r => [r.zone, r])
    );

    await Promise.all(
        rows.map(row => {
            if (!row.zone) return Promise.resolve();
            const payload  = buildPayload(city, date, row);
            const existing = resolvedMap[row.zone];
            return existing
                ? updateData('daily_work_report', 'id', existing.id, payload)
                : saveData('daily_work_report', payload);
        })
    );

    console.log(`[DWR Supabase] Saved ${rows.length} rows | city=${city} | date=${date}`);
};
