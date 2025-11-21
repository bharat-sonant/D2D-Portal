import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";

// Save value (set yes)
export const saveWorkMonitoringValue = () => {
    return new Promise((resolve) => {
        let path = `/Settings/BackOfficeApplicationSettings/WorkMonitoringViaWeb`;
        db.setData(path, "yes").then((response) => {
            if (response.success !== null) {
                resolve(common.setResponse("success", "WorkMonitoringViaWeb saved successfully", {}));
            } else {
                resolve(common.setResponse("error", "Failed to save WorkMonitoringViaWeb", {}));
            }
        });
    });
};

// Get value
export const getWorkMonitoringValue = () => {
    return new Promise((resolve) => {
        let path = `Settings/BackOfficeApplicationSettings/WorkMonitoringViaWeb`;
        db.getData(path).then((response) => {
            if (response !== null ) {
                resolve(common.setResponse("success", "Fetched successfully", { value: response }));
            } else {
                resolve(common.setResponse("error", "Failed to fetch WorkMonitoringViaWeb", {}));
            }
        });
    });
};

// Remove value
export const removeWorkMonitoringValue = () => {
    return new Promise((resolve) => {
        let path = `Settings/BackOfficeApplicationSettings/WorkMonitoringViaWeb`;
        db.removeData(path).then((response) => {
            if (response !== null) {
                resolve(common.setResponse("success", "WorkMonitoringViaWeb removed successfully", {}));
            } else {
                resolve(common.setResponse("error", "Failed to remove WorkMonitoringViaWeb", {}));
            }
        });
    });
};