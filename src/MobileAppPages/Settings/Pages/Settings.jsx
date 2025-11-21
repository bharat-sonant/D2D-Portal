import React, { useEffect, useState } from "react";
import style from "../../Settings/Style/Settings.module.css";
import { saveWebviewUrl, getWebviewUrl } from "../Services/DailyAssignmentWebviewUrlService";
import { getValue, RemoveValue, saveValue } from '../Services/DailyAssignmentViaWebService';
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";
import { setAlertMessage } from "../../../common/common";

const Settings = () => {

    const [isOn, setIsOn] = useState(false);
    const [webviewUrl, setWebviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");

    const city = localStorage.getItem('city') || "DevTest";

    // -------------------- Firebase Init --------------------
    useEffect(() => {
        if (city) {
            localStorage.setItem("city", city);
            let config = getCityFirebaseConfig(city);
            connectFirebase(config, city);
        } else {
            localStorage.setItem("city", "DevTest");
        }
    }, [city]);

    // -------------------- Load Toggle Value --------------------
    useEffect(() => {
        async function fetchSetting() {
            const response = await getValue();

            if (response.status === "success") {
                setIsOn(response.data.value === "yes");
            } else {
                setIsOn(false);
            }
        }
        fetchSetting();
    }, []);

    // -------------------- Load Webview URL --------------------
    useEffect(() => {
        async function loadURL() {
            const res = await getWebviewUrl();

            if (res.status === "success" && res.data?.url) {
                setWebviewUrl(res.data.url);
            } else {
                setWebviewUrl(""); // no URL found → empty box
            }
        }
        loadURL();
    }, []);

    // -------------------- Toggle Handler --------------------
    const handleToggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);

        if (newValue) {
            saveValue();
        } else {
            RemoveValue();
        }
    };

    // -------------------- Save URL Handler --------------------
    const saveUrlHandler = async () => {

        setUrlError("");

        // Empty validation
        if (!webviewUrl.trim()) {
            setUrlError("URL cannot be empty");
            return;
        }

        // URL format validation
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

    // -------------------- Page --------------------
    return (
        <div className={style.pageContainer}>

            {/* ================= CARD 1 ================= */}
            <div className={style.card}>
                <h3 className={style.cardTitle}>Settings</h3>

                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>DailyAssignmentViaWeb</label>

                    <div
                        className={`${style.toggleSwitch} ${isOn ? style.on : style.off}`}
                        onClick={handleToggle}
                    >
                        <div className={style.toggleCircle}>
                            {isOn ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>

                <p className={style.helpText}>
                    When ON, Daily Assignment clicks redirect to webview (AssignmentSummary).
                </p>
            </div>

            {/* ================= CARD 2 ================= */}
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
                            setUrlError(""); // clear inline error during typing
                        }}
                    />
                </div>

                {urlError && (
                    <p style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>
                        {urlError}
                    </p>
                )}

                <p className={style.helpText}>
                    Enter full URL of portal AssignmentSummary page (https://...).
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
