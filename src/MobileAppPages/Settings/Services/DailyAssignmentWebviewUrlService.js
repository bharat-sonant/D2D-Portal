import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";

const path = "Settings/BackOfficeApplicationSettings/DailyAssignmentWebviewUrl";

export const getWebviewUrl = () => {
    return new Promise((resolve) => {
        db.getData(path).then((response) => {
            if (response !== null) {
                resolve(common.setResponse("success", "URL fetched", { url: response }));
            } else {
                resolve(common.setResponse("error", "URL does not exist", {}));
            }
        });
    });
};

export const saveWebviewUrl = (url) => {
    return new Promise((resolve) => {
        db.setData(path, url).then((response) => {
            if (response.success === true) {
                resolve(common.setResponse("success", "URL saved", {}));
            } else {
                resolve(common.setResponse("error", "Failed to save URL", {}));
            }
        });
    });
};
