import * as common from "../../../common/common";
import * as db from "../../../services/dbServices";
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

export const subscribeWardLineStatus = (ward, year, month, date, onUpdate) => {
    if (!ward || !year || !month || !date) return () => {};
    const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;
    return db.subscribeData(path, (data) => {
        if (!data) { onUpdate({}); return; }
        const statusByLine = {};
        for (const key in data) {
            if (data[key] && typeof data[key] === "object") {
                statusByLine[key] = data[key].Status ?? null;
            }
        }
        onUpdate(statusByLine);
    });
};

export const getWardLineStatus = async (ward, year, month, date) => {
    if (!ward || !year || !month || !date) {
        return common.setResponse('fail', "Invalid Params", { ward, year, month, date });
    }
    const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;
    try {
        const resp = await db.getData(path);
        if (resp !== null) {
            const statusByLine = {};
            for (const key in resp) {
                if (resp[key] && typeof resp[key] === "object") {
                    statusByLine[key] = resp[key].Status ?? null;
                }
            }
            saveRealtimeDbServiceHistory('MapServices', 'getWardLineStatus');
            saveRealtimeDbServiceDataHistory('MapServices', 'getWardLineStatus', resp);
            return common.setResponse("success", "Line status fetched", statusByLine);
        }
        return common.setResponse("fail", "No LineStatus data found", {});
    } catch (error) {
        return common.setResponse("fail", error.message, {});
    }
};
