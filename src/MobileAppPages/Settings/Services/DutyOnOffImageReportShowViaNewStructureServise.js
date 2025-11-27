import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";

/* ---------------------------------------------------------
   Save DutyOnOffImageReportShowViaNewStructure = "yes"
   Path: /Settings/GeneralSettings/DutyOnOffImageReportShowViaNewStructure
--------------------------------------------------------- */
export const saveDutyOnOffImageReport = () => {
    return new Promise((resolve) => {
        let path = `Settings/GeneralSettings/DutyOnOffImageReportShowViaNewStructure`;

        db.setData(path, "yes").then((response) => {
            if (response.success === true) {
                resolve(common.setResponse("success", "DutyOnOffImageReportShowViaNewStructure saved successfully", {}));
            } else {
                resolve(common.setResponse("error", "Failed to save DutyOnOffImageReportShowViaNewStructure", {}));
            }
        });
    });
};


/* ---------------------------------------------------------
   Get DutyOnOffImageReportShowViaNewStructure
--------------------------------------------------------- */
export const getDutyOnOffImageReport = () => {
    return new Promise((resolve) => {
        let path = `Settings/GeneralSettings/DutyOnOffImageReportShowViaNewStructure`;

        db.getData(path).then((response) => {
            if (response !== null) {
                resolve(common.setResponse("success", "Data fetched successfully", { value: response }));
            } else {
                resolve(common.setResponse("error", "No data found", {}));
            }
        });
    });
};


/* ---------------------------------------------------------
   Remove DutyOnOffImageReportShowViaNewStructure
--------------------------------------------------------- */
export const removeDutyOnOffImageReport = () => {
    return new Promise((resolve) => {
        let path = `Settings/GeneralSettings/DutyOnOffImageReportShowViaNewStructure`;

        db.removeData(path).then((response) => {
            if (response.success === true) {
                resolve(common.setResponse("success", "DutyOnOffImageReportShowViaNewStructure removed successfully", {}));
            } else {
                resolve(common.setResponse("error", "Failed to remove DutyOnOffImageReportShowViaNewStructure", {}));
            }
        });
    });
};
