import { setResponse } from '../../common/common';
import * as db from '../../services/dbServices';

export const getWardDutyOnTimeFromDB = async (year, month, day, Ward) => {
    return new Promise((resolve) => {
        try {
            if (!year || !month || !day || !Ward) {
                resolve(setResponse("Fail", "Invalid Params !!", { year, month, day, Ward }));
                return;
            };

            db.getData(`WasteCollectionInfo/${Ward}/${year}/${month}/${day}/Summary/dutyInTime`).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Duty In Time Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Duty In Time Found !!", {}));
                }
            })
        } catch (error) {
            console.error("Error fetching Duty In Time: ", error);
            resolve(setResponse("Fail", "Error fetching Duty In Time !!", error.message));
        };
    });
};