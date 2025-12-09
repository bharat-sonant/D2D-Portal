
import { useState } from "react";
import SidePannel from "../../components/Reports/Sidebar/SidePannel";
import style from "../../Style/Reports_Style/Report.module.css";
import DailyWorkReport from "../../components/Reports/DailyWorkReport/DailyWorkReport";
import DailyFuelReport from "../../components/Reports/DailyFuelReport/DailyFuelReport";
import WardMonitoring from "../../components/Reports/WardMonitoring/WardMonitoring";
import WardSwipeReport from "../../components/Reports/WardSwipeReport/WardSwipeReport";
import DailyWasteCollection from "../../components/Reports/DailyWasteCollection/DailyWasteCollection";
import SevenDaysWorkReport from "../../components/Reports/SevenDaysWorkReport/SevenDaysWorkReport";
import VehicleAssignedReport from "../../components/Reports/VehicleAssignedReport/VehicleAssignedReport";
const Reports = () => {
     const [selectedReport, setSelectedReport] = useState("Daily Work Report");
     const renderRightComponent = () => {
    switch (selectedReport) {
      case "Daily Work Report":
        return <DailyWorkReport />;
      case "Daily Fuel Report":
        return <DailyFuelReport />;
      case "Zone Work Progress":
        return <WardMonitoring />;
    
      case "Ward Swipe Report":
        return <WardSwipeReport />;
      case "Daily Waste Collection":
        return <DailyWasteCollection />;
      case "7 Days Work Report":
        return <SevenDaysWorkReport />;
      case "Vehicle Assigned Report":
        return <VehicleAssignedReport />;
    
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
