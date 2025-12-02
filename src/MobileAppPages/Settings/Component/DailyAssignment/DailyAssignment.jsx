import { useState } from 'react';
import style from '../../Style/Settings.module.css';
import { saveDailyAssignmentUrl, toggleAssignment } from '../../Action/DailyAssignment/DailyAssignment';

const DailyAssignment = (props) => {
    const [urlError, setUrlError] = useState("");

    const handleSaveUrl = () => {
        saveDailyAssignmentUrl(props, setUrlError)
    }

    return (
        <div>
            <div className={style.card}>
                <h3 className={style.cardTitle}>Daily Assignment</h3>
                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>DailyAssignment Via Web</label>
                    <div className={`${style.toggleSwitch} ${props.isAssignmentOn ? style.on : style.off}`} onClick={toggleAssignment}>
                        <div className={style.toggleCircle}>{props.isAssignmentOn ? "ON" : "OFF"}</div>
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
                        value={props.webviewUrl}
                        onChange={(e) => {
                            props.setWebviewUrl(e.target.value);
                            setUrlError("");
                        }}
                    />
                </div>
                {urlError && <p style={{ color: "red", fontSize: "12px" }}>{urlError}</p>}
                <div className={style.saveRow}>
                    <button className={style.saveButton} onClick={handleSaveUrl}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default DailyAssignment
