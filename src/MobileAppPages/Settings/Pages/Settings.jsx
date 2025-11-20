import React, { useEffect, useState } from "react";
import style from "../../Settings/Style/Settings.module.css";
import {  RemoveValue, saveValue } from "../Services/DailyAssignmentViaWebService";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";

const Settings = () => {
    const [isOn, setIsOn] = useState(false);
    const city = localStorage.getItem('city') || "DevTest";

    useEffect(() => {
        if (city) {
            localStorage.setItem("city", city);

            let config = getCityFirebaseConfig(city);
            connectFirebase(config, city)
        } else {
            localStorage.setItem("city", "DevTest");
            console.warn("⚠️ No city found, defaulting to DevTest");
        }
    }, [city]);

    const handleToggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);

        if (newValue) {
            saveValue();
            // console.log("Saving DailyAssignmentViaWeb = yes");
            // Call service: enableDailyAssignmentViaWeb()
        } else {
            RemoveValue();
            // disableDailyAssignmentViaWeb();
            // console.log("Removing DailyAssignmentViaWeb");
            // Call service: disableDailyAssignmentViaWeb()
        }
    };

    return (
        <div className={style.pageContainer}>
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

            </div>
        </div>
    );
};

export default Settings;
