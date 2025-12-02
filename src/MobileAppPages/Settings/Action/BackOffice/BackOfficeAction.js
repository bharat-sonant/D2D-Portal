import { setAlertMessage } from "../../../../common/common";
import { getBackOfficeSetting, saveBackOfficeSettings } from "../../Services/BackOfficeApplicationSettingsService";

export const getBackOfficeSettingKey = async (setDriverLargeImageWidth, setDriverThumbnailWidth) => {
    const resp = await getBackOfficeSetting();
    if (resp.status === "success") {
        setDriverLargeImageWidth(resp.data.data[0].DriverLargeImageWidthInPx);
        setDriverThumbnailWidth(resp.data.data[0].DriverThumbnailWidthInPx);
    } else {
        setDriverLargeImageWidth('');
        setDriverThumbnailWidth('');
    };
};

export const saveBackOfficeSettingsHandler = async (props) => {
    if (!props.driverLargeImageWidth.trim() || !props.driverThumbnailWidth.trim()) {
        setAlertMessage("error", "Both width fields are required");
        return;
    }

    const numericPattern = /^[1-9]\d{0,3}$/;
    if (!numericPattern.test(props.driverLargeImageWidth)) {
        setAlertMessage("error", "Large Image Width must be a valid number (1–9999).");
        return;
    }

    if (!numericPattern.test(props.driverThumbnailWidth)) {
        setAlertMessage("error", "Thumbnail Width must be a valid number (1–9999).");
        return;
    }

    const res = await saveBackOfficeSettings({
        DriverLargeImageWidthInPx: props.driverLargeImageWidth,
        DriverThumbnailWidthInPx: props.driverThumbnailWidth
    });

    if (res?.status === "success") {
        setAlertMessage("success", "Back Office settings saved successfully!");
    } else {
        setAlertMessage("error", "Failed to save Back Office settings");
    }
};