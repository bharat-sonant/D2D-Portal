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

const buildRow = (wardId, zone, summary, workerDetails) => ({
    wardId,
    zone,
    dutyOn:              normalizeTime(summary?.dutyInTime,    "first"),
    enteredWardBoundary: normalizeTime(summary?.wardReachedOn, "first"),
    dutyOff:             normalizeTime(summary?.dutyOutTime,   "last"),
    vehicle:             workerDetails?.vehicle      ?? null,
    driver:              workerDetails?.driverName   ?? null,
    helper:              workerDetails?.helperName   ?? null,
    secondHelper:        workerDetails?.secondHelperName ?? null,
});

// Past date — 2 reads per ward: Summary + WorkerDetails (parallel)
export const fetchReportData = async (wards, date) => {
    const rows = await Promise.all(
        wards.map(async ({ id, name }) => {
            try {
                const [summary, workerDetails] = await Promise.all([
                    db.getData(getSummaryPath(id, date)),
                    db.getData(getWorkerDetailsPath(id, date)),
                ]);
                return buildRow(id, name, summary, workerDetails);
            } catch {
                return buildRow(id, name, null, null);
            }
        })
    );
    return rows;
};

