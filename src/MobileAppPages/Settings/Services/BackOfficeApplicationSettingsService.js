import * as db from '../../../services/dbServices';
import * as common from "../../../common/common";
const basePath = "Settings/BackOfficeApplicationSettings";

/* -----------------------------------------------------------
   GET Setting (DriverLargeImageWidthInPx or DriverThumbnailWidthInPx)
----------------------------------------------------------- */
export const getBackOfficeSetting = () => {
    return new Promise((resolve) => {

        const finalPath = `${basePath}`;
        const data = [];

        db.getData(finalPath).then((response) => {

            if (response !== null) {
                data.push({
                    DriverLargeImageWidthInPx: response['DriverLargeImageWidthInPx'],
                    DriverThumbnailWidthInPx: response['DriverThumbnailWidthInPx']

                })
                resolve(
                    common.setResponse("success", "Setting fetched", { data })
                );
            } else {
                resolve(
                    common.setResponse("error", "Setting does not exist", {})
                );
            }
        });

    });
};

/* -----------------------------------------------------------
   SAVE or UPDATE Setting
----------------------------------------------------------- */
export const saveBackOfficeSettings = (settingsObj) => {
    return new Promise((resolve) => {

        db.saveData(basePath, settingsObj).then((response) => {
            if (response !== null) {
                resolve(
                    common.setResponse("success", "All settings saved", {})
                );
            } else {
                resolve(
                    common.setResponse("error", "Failed to save settings", {})
                );
            }
        });

    });
};


