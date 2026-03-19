import { setResponse } from '../../../common/common';
import * as db from '../../../services/dbServices';

export const getHaltInfoFromDB = async (year, month, date, ward) => {
    return new Promise((resolve) => {
        try {
            if (!year || !month || !date || !ward) {
                resolve(setResponse("Fail", "Invalid Params !!", { year, month, date, ward }));
                return;
            }
            const path = `HaltInfo/${ward}/${year}/${month}/${date}`;
            db.getData(path).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Halt Info Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Halt Info Found !!", {}));
                }
            });
        } catch (error) {
            console.error("Error fetching Halt Info: ", error);
            resolve(setResponse("Fail", "Error fetching Halt Info !!", error.message));
        }
    });
};
