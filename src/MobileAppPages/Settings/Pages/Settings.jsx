import React, { useEffect, useState } from "react";
import style from "../../Settings/Style/Settings.module.css";

import { saveWebviewUrl, getWebviewUrl } from "../Services/DailyAssignmentWebviewUrlService";
import { getValue, RemoveValue, saveValue } from '../Services/DailyAssignmentViaWebService';
import { savePaneltiesValue, getPaneltiesValue, RemovePaneltiesValue } from "../../Settings/Services/PaneltiesViaWebServise";
import { getWorkMonitoringValue, saveWorkMonitoringValue, removeWorkMonitoringValue } from "../../Settings/Services/WorkMonitoringViaWebService";
import { getNavigatorSetting, saveNavigatorSetting, removeNavigatorSetting } from "../../Settings/Services/NavigatorApplicationSettingsService";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";
import { setAlertMessage } from "../../../common/common";
import { getBackOfficeSetting, saveBackOfficeSettings } from "../Services/BackOfficeApplicationSettingsService";

// ⭐ YOUR NEW SERVICE
import { 
    getDutyOnOffImageReport,
    saveDutyOnOffImageReport,
    removeDutyOnOffImageReport 
} from "../Services/DutyOnOffImageReportShowViaNewStructureServise.js";


const Settings = () => {

    const [isAssignmentOn, setIsAssignmentOn] = useState(false);
    const [isPenaltiesOn, setIsPenaltiesOn] = useState(false);
    const [isWorkMonitoringOn, setIsWorkMonitoringOn] = useState(false);
    const [isNavigatorSettingOn, setIsNavigatorSettingOn] = useState(false);
    const [isDutyOnOffImageReportShow, setIsDutyOnOffImageReportShow] = useState(false);

    const [webviewUrl, setWebviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");
    const [loader, setLoader] = useState(false);
    const [pageLoader, setPageLoader] = useState(true);

    const [driverLargeImageWidth, setDriverLargeImageWidth] = useState("");
    const [driverThumbnailWidth, setDriverThumbnailWidth] = useState("");

    const city = localStorage.getItem('city') || "DevTest";

    const initFirebase = async () => {
        if (city) {
            localStorage.setItem("city", city);
            let config = getCityFirebaseConfig(city);
            connectFirebase(config, city);
        }
    };

    const loadAssignment = async () => {
        const response = await getValue(setLoader);
        setIsAssignmentOn(response.status === "success" && response.data.value === "yes");
    };

    const loadPenalties = async () => {
        const response = await getPaneltiesValue(setLoader);
        setIsPenaltiesOn(response.status === "success" && response.data.value === "yes");
    };

    const loadWorkMonitoring = async () => {
        const response = await getWorkMonitoringValue(setLoader);
        setIsWorkMonitoringOn(response.status === "success" && response.data.value === "yes");
    };

    const loadNavigator = async () => {
        const response = await getNavigatorSetting(setLoader);
        setIsNavigatorSettingOn(response.status === "success" && response.data === "yes");
    };

    const loadWebviewURL = async () => {
        const res = await getWebviewUrl(setLoader);
        setWebviewUrl(res.status === "success" ? res.data.url : "");
    };

    const loadBackOfficeSettings = async () => {
        try {
            const resp = await getBackOfficeSetting();
            if (resp.status === "success") {
                setDriverLargeImageWidth(resp.data.data[0].DriverLargeImageWidthInPx);
                setDriverThumbnailWidth(resp.data.data[0].DriverThumbnailWidthInPx);
            }
        } catch (_) { }
    };

    const loadDutyOnOffImageReport = async () => {
        const response = await getDutyOnOffImageReport(setLoader);
        setIsDutyOnOffImageReportShow(response.status === "success" && response.data.value === "yes");
    };

    const handleAssignmentToggle = async () => {
        const newValue = !isAssignmentOn;
        setIsAssignmentOn(newValue);

        const res = newValue ? await saveValue() : await RemoveValue();

        if (res?.status !== "success") {
            setIsAssignmentOn(isAssignmentOn);
            setAlertMessage("error", "Failed to update Daily Assignment");
        } else {
            setAlertMessage("success", "Daily Assignment updated");
        }
    };

    const handlePenaltiesToggle = async () => {
        const newValue = !isPenaltiesOn;
        setIsPenaltiesOn(newValue);

        const res = newValue ? await savePaneltiesValue() : await RemovePaneltiesValue();

        if (res?.status !== "success") {
            setIsPenaltiesOn(isPenaltiesOn);
            setAlertMessage("error", "Failed to update Penalties");
        } else {
            setAlertMessage("success", "Penalties updated");
        }
    };

    const handleWorkMonitoringToggle = async () => {
        const newValue = !isWorkMonitoringOn;
        setIsWorkMonitoringOn(newValue);

        const res = newValue ? await saveWorkMonitoringValue() : await removeWorkMonitoringValue();

        if (res?.status !== "success") {
            setIsWorkMonitoringOn(isWorkMonitoringOn);
            setAlertMessage("error", "Failed to update Work Monitoring");
        } else {
            setAlertMessage("success", "Work Monitoring updated");
        }
    };

    const handleNavigatorToggle = async () => {
        const newValue = !isNavigatorSettingOn;
        setIsNavigatorSettingOn(newValue);

        const res = newValue ? await saveNavigatorSetting() : await removeNavigatorSetting();

        if (res?.status !== "success") {
            setIsNavigatorSettingOn(isNavigatorSettingOn);
            setAlertMessage("error", "Failed to update Navigator Setting");
        } else {
            setAlertMessage("success", "Navigator Setting updated");
        }
    };

    const handleDutyOnOffImageReportToggle = async () => {
        const newValue = !isDutyOnOffImageReportShow;
        setIsDutyOnOffImageReportShow(newValue);

        const res = newValue ? await saveDutyOnOffImageReport() : await removeDutyOnOffImageReport();

        if (res?.status !== "success") {
            setIsDutyOnOffImageReportShow(isDutyOnOffImageReportShow);
            setAlertMessage("error", "Failed to update Duty On/Off Image Setting");
        } else {
            setAlertMessage("success", "Duty On/Off Image Setting updated");
        }
    };

    const saveUrlHandler = async () => {
        setUrlError("");

        if (!webviewUrl.trim()) {
            setUrlError("URL cannot be empty");
            return;
        }

        const urlPattern = /^(http:\/\/|https:\/\/)[^\s]+$/;

        if (!urlPattern.test(webviewUrl.trim())) {
            setUrlError("Invalid URL format. Must start with http:// or https://");
            return;
        }

        const res = await saveWebviewUrl(webviewUrl);

        if (res.status === "success") {
            setAlertMessage("success", "Webview URL saved successfully!");
        } else {
            setAlertMessage("error", "Failed to save Webview URL");
        }
    };

    useEffect(() => {
        async function initialize() {
            setPageLoader(true);

            await initFirebase();
            await loadAssignment();
            await loadPenalties();
            await loadWorkMonitoring();
            await loadNavigator();
            await loadWebviewURL();
            await loadBackOfficeSettings();
            await loadDutyOnOffImageReport();

            setPageLoader(false);
        }

        initialize();
    }, []);

    if (pageLoader) {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold"
            }}>
                Loading Settings...
            </div>
        );
    }

    return (
        <div className={style.pageContainer}>

            {loader && <div>Loading...</div>}

            {/* ---------------- DAILY ASSIGNMENT ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Daily Assignment</h3>

                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>DailyAssignmentViaWeb</label>

                    <div
                        className={`${style.toggleSwitch} ${isAssignmentOn ? style.on : style.off}`}
                        onClick={handleAssignmentToggle}
                    >
                        <div className={style.toggleCircle}>
                            {isAssignmentOn ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- PENALTIES ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Penalties</h3>
                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>PenaltiesViaWeb</label>

                    <div
                        className={`${style.toggleSwitch} ${isPenaltiesOn ? style.on : style.off}`}
                        onClick={handlePenaltiesToggle}
                    >
                        <div className={style.toggleCircle}>
                            {isPenaltiesOn ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- WORK MONITORING ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Work Monitoring</h3>

                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>WorkMonitoringViaWeb</label>

                    <div
                        className={`${style.toggleSwitch} ${isWorkMonitoringOn ? style.on : style.off}`}
                        onClick={handleWorkMonitoringToggle}
                    >
                        <div className={style.toggleCircle}>
                            {isWorkMonitoringOn ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- NAVIGATOR ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Navigator Application Settings</h3>

                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>NavigationViaEmployeeCode</label>

                    <div
                        className={`${style.toggleSwitch} ${isNavigatorSettingOn ? style.on : style.off}`}
                        onClick={handleNavigatorToggle}
                    >
                        <div className={style.toggleCircle}>
                            {isNavigatorSettingOn ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- WEBVIEW URL ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Daily Assignment Webview URL</h3>

                <div className={style.inputRow}>
                    <label className={style.inputLabel}>Webview URL</label>

                    <input
                        type="text"
                        className={style.textInput}
                        placeholder="https://yourdomain.com/AssignmentSummary"
                        value={webviewUrl}
                        onChange={(e) => {
                            setWebviewUrl(e.target.value);
                            setUrlError("");
                        }}
                    />
                </div>

                {urlError && (
                    <p style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>
                        {urlError}
                    </p>
                )}

                <div className={style.saveRow}>
                    <button className={style.saveButton} onClick={saveUrlHandler}>
                        Save
                    </button>
                </div>
            </div>

            {/* ---------------- BACKOFFICE SETTINGS ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>BackOffice Application Settings</h3>

                <div className={style.inputRow}>
                    <label className={style.inputLabel}>DriverLargeImageWidthInPx</label>

                    <input
                        type="text"
                        className={style.textInput}
                        placeholder="Enter large image width"
                        value={driverLargeImageWidth}
                        onChange={(e) => {
                            let v = e.target.value;
                            if (/^\d{0,4}$/.test(v)) {   // NUMERIC ONLY
                                setDriverLargeImageWidth(v);
                            }
                        }}
                    />
                </div>

                <div className={style.inputRow}>
                    <label className={style.inputLabel}>DriverThumbnailWidthInPx</label>

                    <input
                        type="text"
                        className={style.textInput}
                        placeholder="Enter thumbnail image width"
                        value={driverThumbnailWidth}
                        onChange={(e) => {
                            let v = e.target.value;
                            if (/^\d{0,4}$/.test(v)) {   // NUMERIC ONLY
                                setDriverThumbnailWidth(v);
                            }
                        }}
                    />
                </div>

                <div className={style.saveRow}>
                    <button
                        className={style.saveButton}
                        onClick={async () => {

                            if (!driverLargeImageWidth.trim() || !driverThumbnailWidth.trim()) {
                                setAlertMessage("error", "Both width fields are required");
                                return;
                            }

                            const numericPattern = /^[1-9]\d{0,3}$/; // 1–9999 only

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

                            if (res?.status === "success") {
                                setAlertMessage("success", "Back Office settings saved successfully!");
                            } else {
                                setAlertMessage("error", "Failed to save Back Office settings");
                            }
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* ---------------- DUTY ON/OFF IMAGE REPORT ---------------- */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Duty On/Off Image</h3>

                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>DutyOnOffImageReportShowViaNewStructure</label>

                    <div
                        className={`${style.toggleSwitch} ${isDutyOnOffImageReportShow ? style.on : style.off}`}
                        onClick={handleDutyOnOffImageReportToggle}
                    >
                        <div className={style.toggleCircle}>
                            {isDutyOnOffImageReportShow ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default Settings;
