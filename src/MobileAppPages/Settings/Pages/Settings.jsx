import React, { useEffect, useState } from "react";
import style from "../../Settings/Style/Settings.module.css";

import { saveWebviewUrl, getWebviewUrl } from "../Services/DailyAssignmentWebviewUrlService";

import { getValue, RemoveValue, saveValue } from '../Services/DailyAssignmentViaWebService';
import { savePaneltiesValue, getPaneltiesValue, RemovePaneltiesValue } from "../../Settings/Services/PaneltiesViaWebServise";

import { getWorkMonitoringValue,saveWorkMonitoringValue,removeWorkMonitoringValue } from "../../Settings/Services/WorkMonitoringViaWebService";

// ⭐ NEW SERVICES (YOU MUST CREATE THESE)
import { getNavigatorSetting,saveNavigatorSetting, removeNavigatorSetting } from "../../Settings/Services/NavigatorApplicationSettingsService";

import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";
import { setAlertMessage } from "../../../common/common";

const Settings = () => {

    const [isAssignmentOn, setIsAssignmentOn] = useState(false);
    const [isPenaltiesOn, setIsPenaltiesOn] = useState(false);
    const [isWorkMonitoringOn, setIsWorkMonitoringOn] = useState(false);

    // ⭐ NEW NAVIGATOR STATE
    const [isNavigatorSettingOn, setIsNavigatorSettingOn] = useState(false);

    const [webviewUrl, setWebviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");

    const city = localStorage.getItem('city') || "DevTest";


    /* ----------------------------------------------------
       Firebase Init
    ---------------------------------------------------- */
    useEffect(() => {
        if (city) {
            localStorage.setItem("city", city);
            let config = getCityFirebaseConfig(city);
            connectFirebase(config, city);
        }
    }, [city]);


    /* ----------------------------------------------------
       Load Daily Assignment
    ---------------------------------------------------- */
    useEffect(() => {
        async function fetchAssignmentSetting() {
            const response = await getValue();
            setIsAssignmentOn(response.status === "success" && response.data.value === "yes");
        }
        fetchAssignmentSetting();
    }, []);


    /* ----------------------------------------------------
       Load Penalties
    ---------------------------------------------------- */
    useEffect(() => {
        async function fetchPenaltiesSetting() {
            const response = await getPaneltiesValue();
            setIsPenaltiesOn(response.status === "success" && response.data.value === "yes");
        }
        fetchPenaltiesSetting();
    }, []);


    /* ----------------------------------------------------
       Load Work Monitoring
    ---------------------------------------------------- */
    useEffect(() => {
        async function fetchWorkMonitoringSetting() {
            const response = await getWorkMonitoringValue();
            setIsWorkMonitoringOn(response.status === "success" && response.data.value === "yes");
        }
        fetchWorkMonitoringSetting();
    }, []);


    /* ----------------------------------------------------
       ⭐ Load NavigatorApplicationSettings
    ---------------------------------------------------- */
    useEffect(() => {
        async function fetchNavigatorSetting() {
            const response = await getNavigatorSetting();
            // console.log(response,"hjhj");
            
            setIsNavigatorSettingOn(response.status === "success" && response.data === "yes");
        }
        fetchNavigatorSetting();
    }, []);


    /* ----------------------------------------------------
       Load URL
    ---------------------------------------------------- */
    useEffect(() => {
        async function loadURL() {
            const res = await getWebviewUrl();
            setWebviewUrl(res.status === "success" && res.data?.url ? res.data.url : "");
        }
        loadURL();
    }, []);


    /* ----------------------------------------------------
       Assignment Toggle Handler
    ---------------------------------------------------- */
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


    /* ----------------------------------------------------
       Penalties Toggle Handler
    ---------------------------------------------------- */
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


    /* ----------------------------------------------------
       Work Monitoring Toggle Handler
    ---------------------------------------------------- */
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


    /* ----------------------------------------------------
       ⭐ NavigatorApplicationSettings Toggle Handler
    ---------------------------------------------------- */
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


    /* ----------------------------------------------------
       Save Webview URL
    ---------------------------------------------------- */
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
            setAlertMessage("success", "URL updated successfully!");
        } else {
            setAlertMessage("error", "Failed to update URL");
        }
    };


    /* ----------------------------------------------------
       PAGE UI
    ---------------------------------------------------- */
    return (
        <div className={style.pageContainer}>

            {/* ================= DAILY ASSIGNMENT ================= */}
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


            {/* ================= PENALTIES ================= */}
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


            {/* ================= WORK MONITORING ================= */}
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


            {/* ================= ⭐ NAVIGATOR APPLICATION SETTINGS ================= */}
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


            {/* ================= URL CONFIG ================= */}
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
                    <button
                        className={style.saveButton}
                        onClick={saveUrlHandler}
                    >
                        Save
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Settings;
