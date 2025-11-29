import { useEffect, useState } from 'react';
import style from '../../Style/Settings.module.css';
import { setAlertMessage } from '../../../../common/common';
import { getValue, RemoveValue, saveValue } from '../../Services/DailyAssignmentViaWebService';
import { getWebviewUrl, saveWebviewUrl } from '../../Services/DailyAssignmentWebviewUrlService';

const DailyAssignment = () => {
    const [isAssignmentOn, setIsAssignmentOn] = useState(false);
    const [loader, setLoader] = useState(false);
    const [webviewUrl, setWebviewUrl] = useState("");
    const [urlError, setUrlError] = useState("");

    useEffect(() => {
        loadAssignment();
        loadWebviewURL();
    }, [])

    const loadAssignment = async () => {
        const response = await getValue(setLoader);
        setIsAssignmentOn(response.status === "success" && response.data.value === "yes");
    };

    const loadWebviewURL = async () => {
        const res = await getWebviewUrl(setLoader);
        setWebviewUrl(res.status === "success" ? res.data.url : "");
    };

    const toggleAssignment = async () => {
        const newValue = !isAssignmentOn;
        setIsAssignmentOn(newValue);

        const res = newValue ? await saveValue() : await RemoveValue();
        if (res?.status !== "success") {
            setIsAssignmentOn(isAssignmentOn);
            setAlertMessage("error", "Failed to update Daily Assignment");
        } else setAlertMessage("success", "Daily Assignment updated");
    };

    const saveDailyAssignmentUrl = async () => {
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

        const res = await saveWebviewUrl(webviewUrl.trim());
        if (res.status === "success") setAlertMessage("success", "Webview URL saved successfully!");
        else setAlertMessage("error", "Failed to save Webview URL");
    };

    return (
        <div>
            <div className={style.card}>
                <h3 className={style.cardTitle}>Daily Assignment</h3>
                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>DailyAssignment Via Web</label>
                    <div className={`${style.toggleSwitch} ${isAssignmentOn ? style.on : style.off}`} onClick={toggleAssignment}>
                        <div className={style.toggleCircle}>{isAssignmentOn ? "ON" : "OFF"}</div>
                    </div>
                </div>
            </div>
            <div className={style.card}>
                <h3 className={style.cardTitle}>Daily Assignment Webview URL</h3>
                <div className={style.inputRow}>
                    <label className={style.inputLabel}>Webview URL</label>
                    <input
                        type="text"
                        className={style.textInput}
                        value={webviewUrl}
                        onChange={(e) => {
                            setWebviewUrl(e.target.value);
                            setUrlError("");
                        }}
                    />
                </div>
                {urlError && <p style={{ color: "red", fontSize: "12px" }}>{urlError}</p>}
                <div className={style.saveRow}>
                    <button className={style.saveButton} onClick={saveDailyAssignmentUrl}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default DailyAssignment
