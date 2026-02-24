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
