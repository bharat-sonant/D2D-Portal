import { getDataByColumns, saveData, updateData } from '../../../services/supabaseServices';

export const getReportFromSupabase = async (city, date) => {
    const res = await getDataByColumns('daily_work_report', { city, date });
    return res?.data || [];
};

const buildPayload = (city, date, row) => ({
    city,
    date,
    zone:                  row.zone                 ?? null,
    duty_on:               row.dutyOn               ?? null,
    entered_ward_boundary: row.enteredWardBoundary  ?? null,
    duty_off:              row.dutyOff              ?? null,
    vehicle:               row.vehicle              ?? null,
    driver:                row.driver               ?? null,
    helper:                row.helper               ?? null,
    second_helper:         row.secondHelper         ?? null,
    vehicle_reg_no:        row.vehicleRegNo         ?? null,
    remark:                row.remark               ?? null,
    actual_work_percentage: row.actualWorkPercentage ?? null,
    work_percentage:       row.workPercentage        ?? null,
});

export const saveReportToSupabase = async (city, date, rows, existingMap = null) => {
    if (!city || !date || !rows?.length) return;

    const resolvedMap = existingMap ?? Object.fromEntries(
        ((await getDataByColumns('daily_work_report', { city, date }))?.data || []).map(r => [r.zone, r])
    );

    const results = await Promise.allSettled(
        rows.map(row => {
            if (!row.zone) return Promise.resolve();
            const payload  = buildPayload(city, date, row);
            const existing = resolvedMap[row.zone];
            return existing
                ? updateData('daily_work_report', 'id', existing.id, payload)
                : saveData('daily_work_report', payload);
        })
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length) {
        console.error(`[DWR Supabase] ${failed.length} rows failed to save`, failed.map(f => f.reason));
        throw new Error(`${failed.length} row(s) failed to save in Supabase`);
    }

    console.log(`[DWR Supabase] Saved ${rows.length} rows | city=${city} | date=${date}`);
};
