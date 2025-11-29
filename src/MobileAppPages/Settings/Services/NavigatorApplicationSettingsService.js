import { setResponse } from "../../../common/common";
import * as db from '../../../services/dbServices'
/* ----------------------------------------------------
   SAVE NavigatorApplicationSettings
   Path: /Settings/NavigatorApplicationSettings/NavigationViaEmployeeCode
---------------------------------------------------- */
export const saveNavigatorSetting = async (setLoader) => {
    return new Promise(async (resolve) => {
        try {
            const path = "Settings/NavigatorApplicationSettings/";
            const payload = {
                "NavigationViaEmployeeCode" : "yes"
            }
            const result = db.saveData(path, payload)

            // console.log('result', result)

            resolve(setResponse("success", "Value saved", result));
        } catch (error) {
            resolve(setResponse("fail", "Error saving value", error));
        }
    });
};


/* ----------------------------------------------------
   REMOVE NavigatorApplicationSettings
---------------------------------------------------- */
export const removeNavigatorSetting = async () => {
    return new Promise(async (resolve) => {
        try {
            const path = "Settings/NavigatorApplicationSettings/NavigationViaEmployeeCode"
            
            const result = await db.removeData(path)
            // console.log('resussss', result)
            resolve(setResponse("success", "Value removed", {}));
        } catch (error) {
            resolve(setResponse("fail", "Error removing value", error));
        }
    });
};


/* ----------------------------------------------------
   GET NavigatorApplicationSettings
---------------------------------------------------- */
export const getNavigatorSetting = async () => {
    return new Promise(async (resolve) => {
        try {
            const path = "Settings/NavigatorApplicationSettings/NavigationViaEmployeeCode"

            const snapshot = await db.getData(path)
            if (snapshot) {
                resolve(setResponse("success", "Value fetched", snapshot));
            } else {
                resolve(setResponse("success", "No value found", { value: "no" }));
            }

        } catch (error) {
            resolve(setResponse("fail", "Error fetching value", error));
        }
    });
};
