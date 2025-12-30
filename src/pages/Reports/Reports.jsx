
import { useState } from "react";
import SidePannel from "../../components/Reports/Sidebar/SidePannel";
import style from "../../Style/Reports_Style/Report.module.css";
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
        <div className={style.container}>
            <div className={style.leftSection} >
                <SidePannel selectedReport={selectedReport} setSelectedReport={setSelectedReport}/>
            </div>
            <div className={style.rightSection}>
                {renderRightComponent()}
            </div>
        </div>
    );
};

export default Reports;
