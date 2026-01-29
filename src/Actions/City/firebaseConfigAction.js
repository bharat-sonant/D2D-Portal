import api from "../../api/api";
import * as common from "../../common/common";
import { saveCityFirebaseConfig } from "../../services/CityService/firebaseConfigService";

/**
 * Action to save Firebase configuration for a city.
 * @param {string} cityId - The ID of the city.
 * @param {string} dbPath - The Firebase database path (URL).
 * @param {Function} setLoader - Function to set loading state.
 * @param {Function} onSuccess - Callback function on successful save.
 */
export const saveFirebaseConfigAction = async (siteId, dbPath, setLoader, onSuccess) => {
    if (!siteId) {
        common.setAlertMessage("error", "City ID is missing!");
        return;
    }
    const payload ={
        firebase_db_path : dbPath,
    }
    setLoader(true);
    try {
        // await saveCityFirebaseConfig(siteId, dbPath);
        await api.patch(`sites/${siteId}`,payload)
        common.setAlertMessage("success", "Firebase configuration saved successfully!");
        if (onSuccess) onSuccess();
    } catch (error) {
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Something went wrong while saving configuration!";
        common.setAlertMessage("error", message);
    } finally {
        setLoader(false);
    }
};
