import * as common from "../../../common/common";
import * as db from "../../../services/dbServices";

export const getWardLineStatus = (ward, year, month, date) => {
    return new Promise((resolve) => {
        try {
            if (ward && year && month && date) {
                const statusByLine = {};
                const path = `WasteCollectionInfo/${ward}/${year}/${month}/${date}/LineStatus`;
                db.getData(path).then((resp) => {
                    if (resp !== null) {
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
            console.log('Error while fetching ward line status', error);
            resolve(common.setResponse('fail', error.message));
        };
    });
};
