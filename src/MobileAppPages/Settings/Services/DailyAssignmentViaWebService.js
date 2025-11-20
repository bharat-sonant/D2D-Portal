import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";

// Save the value "yes" for DailyAssignmentViaWeb
export const saveValue = async () => {
    try {
        const path = `Settings/BackOfficeApplicationSettings/DailyAssignmentViaWeb`;
        const response = await db.setData(path, "yes");

        if (response.success === true) {
            return common.setResponse("success", "DailyAssignmentViaWeb saved successfully", {});
        } else {
            return common.setResponse("fail", "DailyAssignmentViaWeb failed to save data", {});
        }
    } catch (error) {
        return common.setResponse("fail", "Error while saving DailyAssignmentViaWeb", { error });
    }
};

// Remove DailyAssignmentViaWeb key
export const RemoveValue = async () => {
    try {
        const path = `Settings/BackOfficeApplicationSettings/DailyAssignmentViaWeb`;
        const response = await db.removeData(path);

        if (response.success === true) {
            return common.setResponse("success", "DailyAssignmentViaWeb removed successfully", {});
        } else {
            return common.setResponse("fail", "DailyAssignmentViaWeb failed to remove", {});
        }
    } catch (error) {
        return common.setResponse("fail", "Error while removing DailyAssignmentViaWeb", { error });
    }
};
