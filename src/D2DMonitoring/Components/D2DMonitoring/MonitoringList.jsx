import React, { useState } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { RefreshCw } from "lucide-react";

const MonitoringList = () => {
  // ✅ Local Ward Array (5 Wards)
  const [wardList] = useState([
    { id: 1, name: "Ward 1", progress: 25 },
    { id: 2, name: "Ward 2", progress: 40 },
    { id: 3, name: "Ward 3", progress: 65 },
    { id: 4, name: "Ward 4", progress: 80 },
    { id: 5, name: "Ward 5", progress: 95 },
  ]);

  const [selectedWard, setSelectedWard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just Now");

  const handleWardSelect = (ward) => {
    setSelectedWard(ward);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed("Updated Now");
    }, 800);
  };

  const getZoneLabel = (ward) => ward.name;

  const getProgressStyle = (progress) => ({
    "--progressWidth": `${progress}%`,
  });

  return (
    <div className={styles.realtimePage}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderTop}>
            <div className={styles.sidebarSubText}>
              <h3>Zone Summary</h3>
              Last Update: {lastRefreshed}
            </div>
            <button
              type="button"
              className={styles.sidebarRefreshBtn}
              onClick={handleRefresh}
            >
              <RefreshCw
                size={14}
                className={refreshing ? styles.spinIcon : ""}
              />
            </button>
          </div>
        </div>

        <div className={styles.wardItems}>
          {wardList.map((ward) => (
            <div
              key={ward.id}
              className={`${styles.wardRow} ${
                selectedWard?.id === ward.id ? styles.wardRowActive : ""
              }`}
              onClick={() => handleWardSelect(ward)}
            >
              <div className={styles.wardRowHead}>
                <div className={styles.wardPrimaryName}>
                  {getZoneLabel(ward)}
                </div>
                <div
                  className={styles.progressChip}
                  style={getProgressStyle(ward.progress)}
                >
                  {ward.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <h2 style={{ padding: "30px" }}>
          {selectedWard
            ? `Selected: ${selectedWard.name}`
            : "Select a Ward"}
        </h2>
      </div>
    </div>
  );
};

export default MonitoringList;