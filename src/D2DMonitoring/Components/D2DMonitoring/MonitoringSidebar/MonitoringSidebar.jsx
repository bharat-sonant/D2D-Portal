import React from "react";
import { RefreshCw } from "lucide-react";
import styles from "./MonitoringSidebar.module.css";

const MonitoringSidebar = ({
  wardList,
  selectedWard,
  lastRefreshed,
  refreshing,
  onWardSelect,
  onRefresh,
  getZoneLabel,
  getProgressStyle,
  wardCoverageById = {},
}) => {
  return (
    <div className={styles.sidebar}>
      {/* <div className={styles.sidebarHeader}>
        <div className={styles.sidebarHeaderTop}>
          <div className={styles.sidebarSubText}>
            <h3>Zone Summary</h3>
            Last Update: {lastRefreshed}
          </div>
          <button
            type="button"
            className={styles.sidebarRefreshBtn}
            onClick={onRefresh}
          >
            <RefreshCw
              size={14}
              className={refreshing ? styles.spinIcon : ""}
            />
          </button>
        </div>
      </div> */}
      <div className={styles.wardItems}>
        {wardList.map((ward) => (
          <div
            key={ward.id}
            className={`${styles.wardRow} ${selectedWard?.id === ward.id ? styles.wardRowActive : ""}`}
            onClick={() => onWardSelect(ward)}
          >
            <div className={styles.wardRowHead}>
              <div className={styles.wardPrimaryName}>
                {`Zone ${getZoneLabel(ward)}`}
              </div>
              <div
                className={styles.progressChip}
                style={getProgressStyle(wardCoverageById[ward.id] ?? 0)}
              >
                {wardCoverageById[ward.id] ?? 0}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitoringSidebar;
