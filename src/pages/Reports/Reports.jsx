import { useState } from "react";
import SidePannel from "../../components/Reports/Sidebar/SidePannel";
import style from "../../Style/Reports_Style/Report.module.css";
import styles from "../Reports/Reports.module.css";
import DailyWorkReport from "../../components/Reports/DailyWorkReport/DailyWorkReport";
const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("Daily Work Report");
  const renderRightComponent = () => {
    switch (selectedReport) {
      case "Daily Work Report":
        return <DailyWorkReport />;
      default:
        return <div>Select a report</div>;
    }
  };
  return (
    <div className={styles.container}>
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
      <div className={styles.rightSection}>{renderRightComponent()}</div>
    </div>
  );
};

export default Reports;
