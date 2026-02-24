import { useState } from "react";
import SidePannel from "../../../components/Reports/Sidebar/SidePannel";
import styles from "../D2DReports/Reports.module.css";
import DailyWorkReport from "../../../components/Reports/DailyWorkReport/DailyWorkReport";
import Binlifting from "../../../components/Reports/Binlifting/Binlifting";

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
      <div className={styles.reportsContainer}>
    
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
