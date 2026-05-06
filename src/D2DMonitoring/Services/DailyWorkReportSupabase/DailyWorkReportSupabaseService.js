import { getDataByColumns, saveData, updateData } from '../../../services/supabaseServices';

export const getReportFromSupabase = async (city, date) => {
    const res = await getDataByColumns('daily_work_report', { city, date });
    return res?.data || [];
};

const buildPayload = (city, date, row) => ({
    city,
    date,
    zone:                  row.zone                 ?? null,
    duty_on:               row.dutyOn               ?? row.duty_on ?? null,
    entered_ward_boundary: row.enteredWardBoundary  ?? row.entered_ward_boundary ?? null,
    duty_off:              row.dutyOff              ?? row.duty_off ?? null,
    vehicle:               row.vehicle              ?? null,
    driver:                row.driver               ?? null,
    helper:                row.helper               ?? null,
    second_helper:         row.secondHelper         ?? row.second_helper ?? null,
    vehicle_reg_no:        row.vehicleRegNo         ?? row.vehicle_reg_no ?? null,
    trip_bins:             row.tripBins             ?? row.trip_bins ?? null,
    total_working_hrs:     row.totalWorkingHrs      ?? row.total_working_hrs ?? null,
    run_km:                row.runKm                ?? row.run_km ?? null,
    remark:                row.remark               ?? null,
    actual_work_percentage: row.actualWorkPercentage ?? row.actual_work_percentage ?? null,
    work_percentage:       row.workPercentage        ?? row.work_percentage ?? null,
    zone_run_km:           row.zoneRunKm             ?? row.zone_run_km ?? null,
    ward_halt_duration:    row.haltDuration          ?? row.ward_halt_duration ?? null,
});

export const saveReportToSupabase = async (city, date, rows, existingMap = null) => {
    if (!city || !date || !rows?.length) return;

    const resolvedMap = existingMap ?? Object.fromEntries(
        ((await getDataByColumns('daily_work_report', { city, date }))?.data || []).map(r => [r.zone, r])
    );

    const results = await Promise.allSettled(
        rows.map(async row => {
            if (!row.zone) return Promise.resolve();
            const payload  = buildPayload(city, date, row);
            const existing = resolvedMap[row.zone];
            const response = await (existing
                ? updateData('daily_work_report', 'id', existing.id, payload)
                : saveData('daily_work_report', payload));
            if (!response?.success) {
                throw response?.error || new Error('Failed to save row');
            }
            return response;
        })
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length) {
        console.error(`[DWR Supabase] ${failed.length} rows failed to save`, failed.map(f => f.reason));
        throw new Error(`${failed.length} row(s) failed to save in Supabase`);
    }
};
