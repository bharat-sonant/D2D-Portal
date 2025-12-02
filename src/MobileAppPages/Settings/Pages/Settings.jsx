import { useEffect, useState } from "react";
import style from "../../Settings/Style/Settings.module.css";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";
import DailyAssignment from "../Component/DailyAssignment/DailyAssignment.jsx";
import Penalties from "../Component/Penalties/Penalties.jsx";
import WorkMonitoring from "../Component/WorkMonitoring/WorkMonitoring.jsx";
import Navigator from "../Component/Navigator/Navigator.jsx";
import DutyReport from "../Component/DutyReport/DutyReport.jsx";
import BackOffice from "../Component/BackOffice/BackOffice.jsx";
import { getBackOfficeSettingKey } from "../Action/BackOffice/BackOfficeAction.js";
import { getDailyAssignmentKey, getWebViewUrl } from "../Action/DailyAssignment/DailyAssignment.js";
import { getPenaltiesKey } from "../Action/Penalties/PenaltiesAction.js";
import { getWorkMonitoringKey } from "../Action/WorkMonitoring/WorkMonitoringAction.js";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("navigator");
  const [pageLoader, setPageLoader] = useState(true);
  //Image width setting.
  const [driverLargeImageWidth, setDriverLargeImageWidth] = useState("");
  const [driverThumbnailWidth, setDriverThumbnailWidth] = useState("");
  //DailyAssignment Url & Toggle.
  const [isAssignmentOn, setIsAssignmentOn] = useState(false);
  const [webviewUrl, setWebviewUrl] = useState("");
  //Penalties setting toggle.
  const [isPenaltiesOn, setIsPenaltiesOn] = useState(false);
  //Work Monitoring setting toggle.
  const [isWorkMonitoringOn, setIsWorkMonitoringOn] = useState(false);
  const city = localStorage.getItem('city') || "DevTest";

  const initFirebase = async () => {
    const config = getCityFirebaseConfig(city);
    connectFirebase(config, city);
  };

  useEffect(() => {
    async function init() {
      setPageLoader(true);
      await initFirebase();
      setPageLoader(false);
    }
    init();
  }, []);

  useEffect(() => {
    getBackOfficeSettingKey(setDriverLargeImageWidth, setDriverThumbnailWidth);
    getDailyAssignmentKey(setIsAssignmentOn);
    getWebViewUrl(setWebviewUrl);
    getPenaltiesKey(setIsPenaltiesOn);
    getWorkMonitoringKey(setIsWorkMonitoringOn);
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
    <div className={style.verticalContainer}>
      <div className={style.verticalTabs}>
        <div className={`${style.tabItem} ${activeTab === "navigator" ? style.activeTab : ""}`} onClick={() => setActiveTab("navigator")}>
          Navigator Settings
        </div>
        <div className={`${style.tabItem} ${activeTab === "report" ? style.activeTab : ""}`} onClick={() => setActiveTab("report")}>
          Duty On/Off Report
        </div>
        <div className={`${style.tabItem} ${activeTab === "backoffice" ? style.activeTab : ""}`} onClick={() => setActiveTab("backoffice")}>
          BackOffice Settings
        </div>
      </div>

      <div className={style.verticalContent}>
        {activeTab === "navigator" && (
          <Navigator />
        )}

        {activeTab === "report" && (
          <DutyReport />
        )}

        {activeTab === "backoffice" && (
          <div className={style.backofficeRow}>

            <div className={style.backofficeCol}>
              <BackOffice
                driverLargeImageWidth={driverLargeImageWidth}
                driverThumbnailWidth={driverThumbnailWidth}
                setDriverLargeImageWidth={setDriverLargeImageWidth}
                setDriverThumbnailWidth={setDriverThumbnailWidth}
              />

              <DailyAssignment
                isAssignmentOn={isAssignmentOn}
                setIsAssignmentOn={setIsAssignmentOn}
                webviewUrl={webviewUrl}
                setWebviewUrl={setWebviewUrl}
              />
            </div>

            <div className={style.backofficeCol}>
              <Penalties
                isPenaltiesOn={isPenaltiesOn}
                setIsPenaltiesOn={setIsPenaltiesOn}
              />

              <WorkMonitoring
                isWorkMonitoringOn={isWorkMonitoringOn}
                setIsWorkMonitoringOn={setIsWorkMonitoringOn}
              />
            </div>

          </div>
        )}



      </div>
    </div>
  );
};

export default Settings;
