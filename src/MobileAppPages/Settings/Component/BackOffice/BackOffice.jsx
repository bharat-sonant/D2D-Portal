import { useEffect, useState } from 'react'
import style from "../../Style/Settings.module.css"
import { setAlertMessage } from '../../../../common/common';
import { getBackOfficeSetting, saveBackOfficeSettings } from '../../Services/BackOfficeApplicationSettingsService';

const BackOffice = () => {
    const [driverLargeImageWidth, setDriverLargeImageWidth] = useState("");
    const [driverThumbnailWidth, setDriverThumbnailWidth] = useState("");

    useEffect(() => {
        loadBackOfficeSettings();
    }, [])

    const loadBackOfficeSettings = async () => {
        const resp = await getBackOfficeSetting();
        if (resp.status === "success") {
            setDriverLargeImageWidth(resp.data.data[0].DriverLargeImageWidthInPx);
            setDriverThumbnailWidth(resp.data.data[0].DriverThumbnailWidthInPx);
        }
    };

    const saveBackOfficeSettingsHandler = async () => {
        if (!driverLargeImageWidth.trim() || !driverThumbnailWidth.trim()) {
            setAlertMessage("error", "Both width fields are required");
            return;
        }

        const numericPattern = /^[1-9]\d{0,3}$/;
        if (!numericPattern.test(driverLargeImageWidth)) {
            setAlertMessage("error", "Large Image Width must be a valid number (1–9999).");
            return;
        }

        if (!numericPattern.test(driverThumbnailWidth)) {
            setAlertMessage("error", "Thumbnail Width must be a valid number (1–9999).");
            return;
        }

        const res = await saveBackOfficeSettings({
            DriverLargeImageWidthInPx: driverLargeImageWidth,
            DriverThumbnailWidthInPx: driverThumbnailWidth
        });

        if (res?.status === "success") setAlertMessage("success", "Back Office settings saved successfully!");
        else setAlertMessage("error", "Failed to save Back Office settings");
    };

    return (
        <div>
            <div className={style.card}>
                <h3 className={style.cardTitle}>BackOffice Application Settings</h3>

                <div className={style.inputRow}>
                    <label className={style.inputLabel}>Driver Large Image Width In px</label>
                    <input
                        type="text"
                        className={style.textInput}
                        value={driverLargeImageWidth}
                        onChange={(e) => {
                            if (/^\d{0,4}$/.test(e.target.value)) setDriverLargeImageWidth(e.target.value);
                        }}
                    />
                </div>

                <div className={style.inputRow}>
                    <label className={style.inputLabel}>Driver Thumbnail Width In px</label>
                    <input
                        type="text"
                        className={style.textInput}
                        value={driverThumbnailWidth}
                        onChange={(e) => {
                            if (/^\d{0,4}$/.test(e.target.value)) setDriverThumbnailWidth(e.target.value);
                        }}
                    />
                </div>

                <div className={style.saveRow}>
                    <button className={style.saveButton} onClick={saveBackOfficeSettingsHandler}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default BackOffice
