import { useState } from "react";
import ZoneList from "../../components/Realtime-Monitoring/zoneList";
import style from "../../MobileAppPages/Settings/Style/Settings.module.css";
import styles from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css'
import ZoneName from "../../components/Realtime-Monitoring/zoneName";
import ZoneSummaryCard from "../../components/Realtime-Monitoring/zoneSummaryCard";
import VehicleCurrentStatus from "../../components/Realtime-Monitoring/vehicleCurrentStatus";
import TripCounts from "../../components/Realtime-Monitoring/tripCounts";
import AppStatus from "../../components/Realtime-Monitoring/appStatus";
import DutyOnTime from "../../components/Realtime-Monitoring/dutyOnTime";
import WardReachTime from "../../components/Realtime-Monitoring/wardReachTime";
import DutyOffTime from "../../components/Realtime-Monitoring/dutyOffTime";
import LineSummary from "../../components/Realtime-Monitoring/lineSummary";
import CurrentLine from "../../components/Realtime-Monitoring/currentLine";
import HaltInfo from "../../components/Realtime-Monitoring/haltInfo";
import TotalWorkSummary from "../../components/Realtime-Monitoring/totalWorkSummary";
import ZoneWorkSummary from "../../components/Realtime-Monitoring/zoneWorkSummary";
import VehicleNumber from "../../components/Realtime-Monitoring/vehicleNumber";
import DriverInfo from "../../components/Realtime-Monitoring/driverInfo";
import HelperInfo from "../../components/Realtime-Monitoring/helperInfo";
import HerosOnWork from "../../components/Realtime-Monitoring/herosOnWork";
import OtherDuty from "../../components/Realtime-Monitoring/otherDuty";
import MapView from "../../components/Realtime-Monitoring/mapView";
import CardSummary from "../../components/Realtime-Monitoring/cardSummary";
import CardType from "../../components/Realtime-Monitoring/cardType";
import WorkPercentage from "../../components/Realtime-Monitoring/workPercentage";

const RealtimeMonitoring = () => {
  const [selectedZone,setSelectedZone] = useState(null);
  return (
    <div className={style.verticalContainer}>
      <ZoneList selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
      <div className={styles.section_right}>
        <div className="row g-3">
          <div className="col-md-2">
            <ZoneName name={selectedZone} />
          </div>
        
          <div className="col-md-2">
            <VehicleCurrentStatus />
          </div>
          <div className="col-md-1">
            <TripCounts/>
          </div>
           <div className="col-md-1">
            <AppStatus/>
          </div>
           <div className="col-md-2">
            <DutyOnTime/>
          </div>
          <div className="col-md-2">
            <WardReachTime/>
          </div>
          <div className="col-md-2">
            <DutyOffTime/>
          </div>
            <div className="col-md-3">
            <ZoneSummaryCard />
          </div>
           <div className="col-md-2">
            <LineSummary/>
          </div>        
          <div className="col-md-2">
            <HaltInfo/>
          </div>
          <div className="col-md-3">
            <TotalWorkSummary/>
          </div>
          <div className="col-md-3">
            <ZoneWorkSummary/>
          </div>
          <div className="col-md-2">
            <CurrentLine/>
          </div>
          <div className="col-md-2">
            <VehicleNumber/>
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-md-3">
            <DriverInfo/>
          </div>
           <div className="col-md-3">
            <HelperInfo/>
          </div>
          <div className="col-md-1">
            <HerosOnWork/>
          </div>
           <div className="col-md-1">
            <OtherDuty/>
          </div>
           <div className="col-md-3">
            <CardSummary/>
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <MapView/>
          </div>
          <div className="col-md-2">
            <CardType/>
          </div>
           <div className="col-md-2">
            <WorkPercentage/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealtimeMonitoring;