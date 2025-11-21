import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";

/* ---------------------------------------------------------
   Save PaneltiesViaWeb = "yes"
--------------------------------------------------------- */
export const savePaneltiesValue = () => {
    return new Promise((resolve) => {
        let path = `Settings/BackOfficeApplicationSettings/PaneltiesViaWeb`;

        db.setData(path, "yes").then((response) => {
            if (response.success === true) {
                resolve(common.setResponse("success", "PaneltiesViaWeb saved successfully", {}));
            } else {
                resolve(common.setResponse("error", "Failed to save PaneltiesViaWeb", {}));
            }
        });
    });
};


/* ---------------------------------------------------------
   Get PaneltiesViaWeb
--------------------------------------------------------- */
export const getPaneltiesValue = () => {
    return new Promise((resolve) => {
        let path = `Settings/BackOfficeApplicationSettings/PaneltiesViaWeb`;

        db.getData(path).then((response) => {

            if (response !== null) {
                resolve (common.setResponse("success", "Data fetched successfully", { value: response }));
            } else {
                resolve(common.setResponse("error", "No data found", {}));
            }
        });
    });
};


/* ---------------------------------------------------------
   Remove PaneltiesViaWeb
--------------------------------------------------------- */
export const RemovePaneltiesValue = () => {
    return new Promise((resolve) => {
        let path = `Settings/BackOfficeApplicationSettings/PaneltiesViaWeb`;

        db.removeData(path).then((response) => {
            if (response.success === true) {
                resolve(common.setResponse("success", "PaneltiesViaWeb removed successfully", {}));
            } else {
                resolve(common.setResponse("error", "Failed to remove PaneltiesViaWeb", {}));
            }
        });
    });
};
