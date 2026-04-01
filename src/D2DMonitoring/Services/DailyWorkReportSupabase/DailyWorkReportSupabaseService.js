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

export const saveReportToSupabase = async (city, date, rows) => {
    if (!city || !date || !rows?.length) return;

    const existingRes = await getDataByColumns('daily_work_report', { city, date });
    const existingMap = Object.fromEntries((existingRes?.data || []).map(r => [r.zone, r]));

    await Promise.all(
        rows.map(row => {
            if (!row.zone) return Promise.resolve();
            const payload  = buildPayload(city, date, row);
            const existing = existingMap[row.zone];
            return existing
                ? updateData('daily_work_report', 'id', existing.id, payload)
                : saveData('daily_work_report', payload);
        })
    );

    console.log(`[DWR Supabase] city=${city} | date=${date} | rows=${rows.length}`);
};
