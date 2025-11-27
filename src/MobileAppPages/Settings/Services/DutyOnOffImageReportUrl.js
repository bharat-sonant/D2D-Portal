import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";

// 🔥 NEW FIREBASE PATH
const path = "Settings/GeneralSettings/DutyOnOffImageReportUrl";

/* ----------------------------------------------------
   GET DutyOnOffImageReportUrl
---------------------------------------------------- */
export const getDutyOnOffImageReportUrl = () => {
    return new Promise((resolve) => {
        db.getData(path).then((response) => {
            if (response !== null) {
                resolve(
                    common.setResponse("success", "URL fetched", { url: response })
                );
            } else {
                resolve(
                    common.setResponse("error", "URL does not exist", {})
                );
            }
        });
    });
};

/* ----------------------------------------------------
   SAVE DutyOnOffImageReportUrl
---------------------------------------------------- */
export const saveDutyOnOffImageReportUrl = (url) => {
    return new Promise((resolve) => {
        db.setData(path, url).then((response) => {
            if (response.success === true) {
                resolve(
                    common.setResponse("success", "URL saved", {})
                );
            } else {
                resolve(
                    common.setResponse("error", "Failed to save URL", {})
                );
            }
        });
    });
};
