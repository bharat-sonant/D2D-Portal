import React from "react";
import { Activity, Truck, Package, Zap, ChevronRight } from "lucide-react";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
import styles from "./LiveStatusBoard.module.css";

const LiveStatusBoard = ({
  wardData,
  vehicleTone,
  getTripStatusTone,
  appTone,
  onVehicleClick,
  onTripsClick,
  onAppClick,
}) => {
  return (
    <MonitoringCard
      title="Live Status Board"
      icon={<Activity size={18} />}
    >
      <div className={styles.liveStatusGrid}>
        <div className={styles.liveBoardCard} onClick={onVehicleClick}>
          <div className={styles.liveStatusGridLeft}>
            <div className={styles.liveBoardIcon}>
              <Truck size={18} />
            </div>
            <div className={styles.liveBoardLabel}>Vehicle Status</div>
          </div>
          <div className={styles.liveBoardValueWrap}>
            <div className={`${styles.liveBoardValue} ${styles[vehicleTone]}`}>
              {wardData.vehicleStatus}
            </div>
            <span className={styles.liveBoardArrow}>
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* <div className={styles.liveBoardCard} onClick={onTripsClick}>
          <div className={styles.liveStatusGridLeft}>
            <div className={styles.liveBoardIcon}>
              <Package size={18} />
            </div>
            <div className={styles.liveBoardLabel}>Trip Execution</div>
          </div>
          <div className={styles.liveBoardValueWrap}>
            <div className={`${styles.liveBoardValue} ${styles[getTripStatusTone()]}`}>
              {wardData.trips} Trips
            </div>
            <span className={styles.liveBoardArrow}>
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

        <div className={styles.liveBoardCard} onClick={onAppClick}>
          <div className={styles.liveStatusGridLeft}>
            <div className={styles.liveBoardIcon}>
              <Zap size={18} />
            </div>
            <div className={styles.liveBoardLabel}>App Status</div>
          </div>
          <div className={styles.liveBoardValueWrap}>
            <div className={`${styles.liveBoardValue} ${styles[appTone]}`}>
              {wardData.appStatus}
            </div>
            <span className={styles.liveBoardArrow}>
              <ChevronRight size={14} />
            </span>
          </div>
        </div> */}
      </div>
    </MonitoringCard>
  );
};

export default LiveStatusBoard;
