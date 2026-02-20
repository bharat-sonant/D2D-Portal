import { useState } from "react";
import SidePannel from "../../../components/Reports/Sidebar/SidePannel";
import styles from "./DailyReport.module.css";
// import Binlifting from "../../components/Reports/Binlifting/Binlifting";
import DailyZoneReport from "./DailyZoneReport";

const DailyReport = () => {
  const [selectedReport, setSelectedReport] = useState("Zone");

  const renderRightComponent = () => {
    switch (selectedReport) {
      case "Zone":
        return <DailyZoneReport />;
      // case "Binlifting":
      //   return <Binlifting />;
      default:
        return <div>Select a report</div>;
    }
  };

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.background}>
        <div className={`${styles.gradientOrb} ${styles.orb1}`} />
        <div className={`${styles.gradientOrb} ${styles.orb2}`} />
        <div className={`${styles.gradientOrb} ${styles.orb3}`} />
        <div className={styles.gridOverlay} />
      </div>

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
          forceDesktop={true}
        />
      </div>
      <div className={styles.rightSection}>{renderRightComponent()}</div>
    </div>
  );
};

export default DailyReport;
