import React, { useEffect, useState } from "react";
import style from "../../Settings/Style/Settings.module.css"
import { saveWebviewUrl, getWebviewUrl } from "../Services/DailyAssignmentWebviewUrlService";
import { getValue, RemoveValue, saveValue } from '../Services/DailyAssignmentViaWebService';
import {savePaneltiesValue, getPaneltiesValue, RemovePaneltiesValue} from "../../Settings/Services/PaneltiesViaWebServise";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";
import { setAlertMessage } from "../../../common/common";


const Settings = () => {

    const [isAssignmentOn, setIsAssignmentOn] = useState(false);
    const [isPenaltiesOn, setIsPenaltiesOn] = useState(false);

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
       Load Daily Assignment Toggle
    ---------------------------------------------------- */
    useEffect(() => {
        async function fetchAssignmentSetting() {
            const response = await getValue();
            setIsAssignmentOn(response.status === "success" && response.data.value === "yes");
        }
        fetchAssignmentSetting();
    }, []);


    /* ----------------------------------------------------
       Load Penalties Toggle
    ---------------------------------------------------- */
    useEffect(() => {
        async function fetchPenaltiesSetting() {
            const response = await getPaneltiesValue();

            if (response.status === "success" && response.data.value === "yes") {
                setIsPenaltiesOn(true);
            } else {
                setIsPenaltiesOn(false);
            }
        }

        fetchPenaltiesSetting();
    }, []);


    /* ----------------------------------------------------
       Load Webview URL
    ---------------------------------------------------- */
    useEffect(() => {
        async function loadURL() {
            const res = await getWebviewUrl();

            if (res.status === "success" && res.data?.url) {
                setWebviewUrl(res.data.url);
            } else {
                setWebviewUrl("");
            }
        }
        loadURL();
    }, []);


    /* ----------------------------------------------------
       Assignment Toggle Handler (with rollback)
    ---------------------------------------------------- */
    const handleAssignmentToggle = async () => {
        const newValue = !isAssignmentOn;
        setIsAssignmentOn(newValue);

        let res;
        if (newValue) res = await saveValue();
        else res = await RemoveValue();

        if (res?.status !== "success") {
            setIsAssignmentOn(isAssignmentOn); // rollback
            setAlertMessage("error", "Failed to update Daily Assignment");
        } else {
            setAlertMessage("success", "Daily Assignment updated");
        }
    };


    /* ----------------------------------------------------
       Penalties Toggle Handler (with rollback)
    ---------------------------------------------------- */
    const handlePenaltiesToggle = async () => {
        const newValue = !isPenaltiesOn;
        setIsPenaltiesOn(newValue);

        let res;
        if (newValue)
            res = await savePaneltiesValue();
        else
            res = await RemovePaneltiesValue();

        if (res?.status !== "success") {
            setIsPenaltiesOn(isPenaltiesOn); // rollback
            setAlertMessage("error", "Failed to update Penalties");
        } else {
            setAlertMessage("success", "Penalties updated");
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

                <p className={style.helpText}>
                    When ON, Daily Assignment opens WebView (AssignmentSummary).
                </p>
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

                <p className={style.helpText}>
                    When ON, Penalties will open in WebView.
                </p>
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

                <p className={style.helpText}>
                    Enter full AssignmentSummary webview URL.
                </p>

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