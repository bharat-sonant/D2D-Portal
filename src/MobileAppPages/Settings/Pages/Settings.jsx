import { useEffect, useState } from "react";
import styles from "../Pages/Settings.module.css";
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
import DailyAssignmentToggle from "../Component/DailyAssignment/DailyAssignmentToggle.jsx";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("backoffice");
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
    <div className={styles.verticalContainer}>
       {/* Background */}
      <div className={styles.background}>
        <div className={`${styles.gradientOrb} ${styles.orb1}`} />
        <div className={`${styles.gradientOrb} ${styles.orb2}`} />
        <div className={`${styles.gradientOrb} ${styles.orb3}`} />
        <div className={styles.gridOverlay} />
      </div>

      {/* Particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      <div className={styles.verticalTabs}>
        <div className={`${styles.tabItem} ${activeTab === "backoffice" ? styles.activeTab : ""}`} onClick={() => setActiveTab("backoffice")}>
          BackOffice Settings
        </div>
        <div className={`${styles.tabItem} ${activeTab === "report" ? styles.activeTab : ""}`} onClick={() => setActiveTab("report")}>
          Duty On/Off Report
        </div>
        <div className={`${styles.tabItem} ${activeTab === "navigator" ? styles.activeTab : ""}`} onClick={() => setActiveTab("navigator")}>
          Navigator Settings
        </div>
      </div>

      <div className={styles.verticalContent}>
          {activeTab === "backoffice" && (
          <>
            <div className={styles.backofficeRow}>
              <Penalties
                isPenaltiesOn={isPenaltiesOn}
                setIsPenaltiesOn={setIsPenaltiesOn}
              />
              <WorkMonitoring
                isWorkMonitoringOn={isWorkMonitoringOn}
                setIsWorkMonitoringOn={setIsWorkMonitoringOn}
              />

              <DailyAssignmentToggle
                isAssignmentOn={isAssignmentOn}
                setIsAssignmentOn={setIsAssignmentOn}
              />

              <DailyAssignment
                isAssignmentOn={isAssignmentOn}
                setIsAssignmentOn={setIsAssignmentOn}
                webviewUrl={webviewUrl}
                setWebviewUrl={setWebviewUrl}
              />

              <BackOffice
                driverLargeImageWidth={driverLargeImageWidth}
                driverThumbnailWidth={driverThumbnailWidth}
                setDriverLargeImageWidth={setDriverLargeImageWidth}
                setDriverThumbnailWidth={setDriverThumbnailWidth}
              />
            </div>
          </>
        )}
        {activeTab === "report" && (
          <div className={styles.backofficeRow}>
            <DutyReport />
          </div>
        )}

        {activeTab === "navigator" && (
          <div className={styles.backofficeRow}>
            <Navigator />
          </div>
        )}

      
      </div>
    </div>
  );
};

export default Settings;
