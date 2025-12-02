import React, { useEffect, useState } from 'react'
import style from "../../Style/Settings.module.css"
import { getDutyOnOffImageReportUrl, saveDutyOnOffImageReportUrl } from '../../Services/DutyOnOffImageReportUrl';
import { removeDutyOnOffImageReport, saveDutyOnOffImageReport } from '../../Services/DutyOnOffImageReportShowViaNewStructureServise';
import { setAlertMessage } from '../../../../common/common';

const DutyReport = () => {
      const [isDutyOnOffImageReportShow, setIsDutyOnOffImageReportShow] = useState(false);
      const [dutyOnOffImageReportUrl, setDutyOnOffImageReportUrl] = useState("");
        const [dutyUrlError, setDutyUrlError] = useState("");
          const [loader, setLoader] = useState(false);
      


      useEffect(()=>{
           loadDutyOnOffImageReport();
           loadDutyOnOffImageReportUrlHandler();
      },[])

        const loadDutyOnOffImageReportUrlHandler = async () => {
    const res = await getDutyOnOffImageReportUrl();
    setDutyOnOffImageReportUrl(res.status === "success" ? res.data.url : "");
  };

    const loadDutyOnOffImageReport = async () => {
    const response = await getDutyOnOffImageReportUrl(setLoader);
    setIsDutyOnOffImageReportShow(response.status === "success" && response.data.value === "yes");
  };


    const toggleDutyOnOffImageReport = async () => {
      const newValue = !isDutyOnOffImageReportShow;
      setIsDutyOnOffImageReportShow(newValue);
  
      const res = newValue ? await saveDutyOnOffImageReport() : await removeDutyOnOffImageReport();
      if (res?.status !== "success") {
        setIsDutyOnOffImageReportShow(isDutyOnOffImageReportShow);
        setAlertMessage("error", "Failed to update Duty On/Off Image Setting");
      } else setAlertMessage("success", "Duty On/Off Image Setting updated");
    };

      const saveDutyOnOffImageReportUrlHandlerFn = async () => {
        setDutyUrlError("");
    
        if (!dutyOnOffImageReportUrl.trim()) {
          setDutyUrlError("URL cannot be empty");
          return;
        }
    
        const urlPattern = /^(http:\/\/|https:\/\/)[^\s]+$/;
        if (!urlPattern.test(dutyOnOffImageReportUrl.trim())) {
          setDutyUrlError("Invalid URL format. Must start with http:// or https://");
          return;
        }
    
        const res = await saveDutyOnOffImageReportUrl(dutyOnOffImageReportUrl.trim());
        if (res.status === "success") setAlertMessage("success", "Duty On/Off Image Report URL saved successfully!");
        else setAlertMessage("error", "Failed to save Duty On/Off Image Report URL");
      };
    
  return (
     <>
            <div className={style.card}>
              {/* <h3 className={style.cardTitle}>Report Via New Structure</h3> */}
              <div className={style.toggleWrapper}>
                <label className={style.toggleLabel}>Duty On Off Image Report</label>
                <div className={`${style.toggleSwitch} ${isDutyOnOffImageReportShow ? style.on : style.off}`} onClick={toggleDutyOnOffImageReport}>
                  <div className={style.toggleCircle}>{isDutyOnOffImageReportShow ? "ON" : "OFF"}</div>
                </div>
              </div>
            </div>

            <div className={style.card}>
              {/* <h3 className={style.cardTitle}>Duty On/Off Image Report URL</h3> */}
              <div className={style.inputRow}>
                <label className={style.inputLabel}>Report Webview URL</label>
                <input
                  type="text"
                  className={style.textInput}
                  value={dutyOnOffImageReportUrl}
                  onChange={(e) => {
                    setDutyOnOffImageReportUrl(e.target.value);
                    setDutyUrlError("");
                  }}
                />
              </div>
              {dutyUrlError && <p style={{ color: "red", fontSize: "12px" }}>{dutyUrlError}</p>}
              <div className={style.saveRow}>
                <button className={style.saveButton} onClick={saveDutyOnOffImageReportUrlHandlerFn}>Save</button>
              </div>
            </div>
          </>
  )
}

export default DutyReport
