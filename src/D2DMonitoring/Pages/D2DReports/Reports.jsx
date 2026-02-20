import { useState } from "react";
import SidePannel from "../../../components/Reports/Sidebar/SidePannel";
import styles from "../D2DReports/Reports.module.css";
import DailyWorkReport from "../../../components/Reports/DailyWorkReport/DailyWorkReport";
import Binlifting from "../../../components/Reports/Binlifting/Binlifting";
import d2dStyle from '../../../assets/css/D2DMonitoring/Dashboard/D2DMonitoringDashboard.module.css';

const D2DReports = () => {
  const [selectedReport, setSelectedReport] = useState("Zone");
  const renderRightComponent = () => {
    switch (selectedReport) {
      case "Zone":
        return <DailyWorkReport />;
      case "Binlifting":
        return <Binlifting />;
      default:
        return <div>Select a report</div>;
    }
  };
  return (
    <>
      <div className={d2dStyle.dashboardHeader}>
        <h1 className={d2dStyle.dashboardTitle}>Realtime</h1>
        <p className={d2dStyle.dashboardSubtitle}>
          Track field activity, monitor team performance, and review live updates.
        </p>
      </div>
      <div className={styles.reportsContainer}>
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
        <div className={styles.leftSection}>
          <SidePannel
            selectedReport={selectedReport}
            setSelectedReport={setSelectedReport}
          />
        </div>
        <div className={styles.rightSection} >{renderRightComponent()}</div>
      </div>
    </>
  );
};

export default D2DReports;
