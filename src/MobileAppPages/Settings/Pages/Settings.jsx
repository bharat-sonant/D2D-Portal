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

const Settings = () => {

  const [activeTab, setActiveTab] = useState("daily");
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const city = localStorage.getItem('city') || "DevTest";

  // ------------ Firebase Init ------------
  const initFirebase = async () => {
    const config = getCityFirebaseConfig(city);
    connectFirebase(config, city);
  };

  // ------------ useEffect ------------
  useEffect(() => {
    async function init() {
      setPageLoader(true);
      await initFirebase();
      setPageLoader(false);
    }
    init();
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

      {/* Left Vertical Tabs */}
      <div className={style.verticalTabs}>
        <div className={`${style.tabItem} ${activeTab === "daily" ? style.activeTab : ""}`} onClick={() => setActiveTab("daily")}>
          Daily Assignment
        </div>
        <div className={`${style.tabItem} ${activeTab === "penalties" ? style.activeTab : ""}`} onClick={() => setActiveTab("penalties")}>
          Penalties
        </div>
        <div className={`${style.tabItem} ${activeTab === "work" ? style.activeTab : ""}`} onClick={() => setActiveTab("work")}>
          Work Monitoring
        </div>
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

      {/* Right Content */}
      <div className={style.verticalContent}>

        {/* ---------------- DAILY ASSIGNMENT ---------------- */}
        {activeTab === "daily" && (
          <DailyAssignment />
        )}

        {/* ---------------- PENALTIES ---------------- */}
        {activeTab === "penalties" && (
          <Penalties />
        )}

        {/* ---------------- WORK MONITORING ---------------- */}
        {activeTab === "work" && (
          <WorkMonitoring />
        )}

        {/* ---------------- NAVIGATOR ---------------- */}
        {activeTab === "navigator" && (
          <Navigator />
        )}

        {/* ---------------- DUTY REPORT TOGGLE ---------------- */}
        {activeTab === "report" && (
          <DutyReport />
        )}

        {/* ---------------- BACKOFFICE SETTINGS ---------------- */}
        {activeTab === "backoffice" && (
          <BackOffice />
        )}
      </div>
    </div>
  );
};

export default Settings;
