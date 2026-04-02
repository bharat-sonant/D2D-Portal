import * as db from '../../../services/dbServices';

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

const getSummaryPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WasteCollectionInfo/${wardId}/${year}/${month}/${date}/Summary`;
};

const getWorkerDetailsPath = (wardId, date) => {
    const [year, monthNum] = date.split('-');
    const month = MONTHS[Number(monthNum) - 1];
    return `WasteCollectionInfo/${wardId}/${year}/${month}/${date}/WorkerDetails`;
};

const normalizeTime = (value, mode = "first") => {
    if (!value) return null;
    const arr = Array.isArray(value)
        ? value
        : String(value).split(",").map(t => t.trim()).filter(Boolean);
    if (!arr.length) return null;
    return mode === "last" ? arr[arr.length - 1] : arr[0];
};

const fetchVehicleRegNo = async (vehicleStr) => {
    if (!vehicleStr) return null;
    const ids = [...new Set(vehicleStr.split(',').map(v => v.trim()).filter(Boolean))];
    const regNos = await Promise.all(
        ids.map(async id => {
            try {
                const regNo = await db.getData(`VehicleDetails/${id}/regNumber`);
                return regNo || null;
            } catch {
                return id;
            }
        })
    );
    const valid = regNos.filter(Boolean);
    return valid.length ? valid.join(', ') : null;
};

const buildRow = (wardId, zone, summary, workerDetails, vehicleRegNo = null) => ({
    wardId,
    zone,
    dutyOn:               normalizeTime(summary?.dutyInTime,    "first"),
    enteredWardBoundary:  normalizeTime(summary?.wardReachedOn, "first"),
    dutyOff:              normalizeTime(summary?.dutyOutTime,   "last"),
    vehicle:              workerDetails?.vehicle               ?? null,
    vehicleRegNo,
    driver:               workerDetails?.driverName            ?? null,
    helper:               workerDetails?.helperName            ?? null,
    secondHelper:         workerDetails?.secondHelperName      ?? null,
    remark:               summary?.workPercentageRemark                           ?? null,
    actualWorkPercentage: summary?.workPercentage       != null ? Math.round(Number(summary.workPercentage))        : null,
    workPercentage:       summary?.updatedWorkPercentage != null ? Math.round(Number(summary.updatedWorkPercentage)) : null,
});

// Past date — 2 reads per ward: Summary + WorkerDetails (parallel), + vehicle reg fetch
export const fetchReportData = async (wards, date) => {
    const totalReads = wards.length * 2;
    console.log(`[DWR Firebase] date=${date} | wards=${wards.length} | Firebase reads=${totalReads}`);
    const t0 = performance.now();

    const rows = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const [summary, workerDetails] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    db.getData(getWorkerDetailsPath(id, date)),
                ]);
                const vehicleRegNo = await fetchVehicleRegNo(workerDetails?.vehicle);
                return buildRow(id, name, summary, workerDetails, vehicleRegNo);
            } catch {
                return buildRow(id, name, null, null);
            }
        })
    );

    const withData = rows.filter(r =>
        r.dutyOn || r.dutyOff || r.enteredWardBoundary ||
        r.vehicle || r.driver || r.helper ||
        r.remark || r.actualWorkPercentage != null || r.workPercentage != null
    );

    const sizeKB = (new TextEncoder().encode(JSON.stringify(withData)).length / 1024).toFixed(1);
    console.log(`[DWR Firebase] Done in ${(performance.now() - t0).toFixed(0)}ms | zones with data=${withData.length}/${rows.length} | ~${sizeKB} KB`);

    return withData;
};
