import * as common from "../../common/common";
import { saveCityFirebaseConfig } from "../../services/CityService/firebaseConfigService";

/**
 * Action to save Firebase configuration for a city.
 * @param {string} cityId - The ID of the city.
 * @param {Object} config - The Firebase configuration object.
 * @param {Function} setLoader - Function to set loading state.
 * @param {Function} onSuccess - Callback function on successful save.
 */
export const saveFirebaseConfigAction = async (cityId, config, setLoader, onSuccess) => {
    if (!cityId) {
        common.setAlertMessage("error", "City ID is missing!");
        return;
    }

    setLoader(true);
    try {
        await saveCityFirebaseConfig(cityId, config);
        common.setAlertMessage("success", "Firebase configuration saved successfully!");
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Error in saveFirebaseConfigAction:", error);
        common.setAlertMessage("error", error || "Something went wrong while saving configuration!");
    } finally {
        setLoader(false);
    }
};
