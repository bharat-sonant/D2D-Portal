import * as common from "../../../common/common";
import * as db from "../../../services/dbServices";
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

/**
 * Firebase onValue listener — fires instantly from cache, then realtime.
 * Returns unsubscribe function; call in useEffect cleanup.
 */
export const subscribeWardLineStatus = (ward, year, month, date, onUpdate) => {
    if (!ward || !year || !month || !date) return () => {};
    const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;
    return db.subscribeData(path, (data) => {
        if (!data) { onUpdate({}); return; }
        saveRealtimeDbServiceHistory('MapSectionService', 'subscribeWardLineStatus');
        saveRealtimeDbServiceDataHistory('MapSectionService', 'subscribeWardLineStatus', data);
        const statusByLine = {};
        for (const key in data) {
            if (data[key] && typeof data[key] === "object") {
                statusByLine[key] = data[key].Status ?? null;
            }
        }
        onUpdate(statusByLine);
    });
};

export const getWardLineStatus = (ward, year, month, date) => {
    return new Promise((resolve) => {
        try {
            if (ward && year && month && date) {
                const statusByLine = {};
                const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;
                db.getData(path).then((resp) => {
                    if (resp !== null) {
                        saveRealtimeDbServiceHistory('MapSectionService', 'getWardLineStatus');
                        saveRealtimeDbServiceDataHistory('MapSectionService', 'getWardLineStatus', resp);
                        for (const key in resp) {
                            if (resp[key] && typeof resp[key] === "object") {
                                statusByLine[key] = resp[key].Status ?? null;
                            }
                        }
                        resolve(common.setResponse("success", "Line status fetched", statusByLine)
                        );
                    } else {
                        resolve(common.setResponse("fail", "No LineStatus data found", {}));
                    }
                }).catch((error) => {
                    resolve(common.setResponse("fail", error.message, {}));
                });
            } else {
                resolve(common.setResponse('fail', "Invalid Params", { ward, year, month, date }));
            };
        } catch (error) {
            resolve(common.setResponse('fail', error.message));
        };
    });
};
