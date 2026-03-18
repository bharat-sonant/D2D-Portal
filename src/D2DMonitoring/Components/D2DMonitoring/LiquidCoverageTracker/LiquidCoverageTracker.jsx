import React from "react";
import { Truck } from "lucide-react";
import styles from "./LiquidCoverageTracker.module.css";

const LiquidCoverageTracker = ({
  liquidCoveragePercent,
  liquidTotalKm,
  liquidCoveredKm,
  liquidLeftKm,
  liquidTrackFillWidth,
}) => {
  return (
    <div className={`${styles.glassCard} ${styles.liquidTankCard}`}>
      <div className={styles.liquidTankTopRow}>
        <span className={styles.liquidTankLiveTag}>Live Tracking</span>
        <div className={styles.liquidTankPercentBlock}>
          <strong>{Math.round(liquidCoveragePercent)}</strong>
          <span>%</span>
        </div>
      </div>
      <div className={styles.liquidTankBody}>
        <div className={styles.liquidTankVisualWrap}>
          <div className={styles.liquidTankVisual}>
            <div
              className={styles.liquidTankFill}
              style={{ "--fillHeight": `${liquidCoveragePercent}%` }}
            />
            <span>{Math.round(liquidCoveragePercent)}%</span>
          </div>
        </div>
        <div className={styles.liquidTankMetrics}>
          <div className={styles.liquidTankMetricHead}>
            <div>
              <label>Total</label>
              <strong>{liquidTotalKm.toFixed(2)} km</strong>
            </div>
            <div>
              <label>Covered</label>
              <strong className={styles.liquidTankCoveredValue}>
                {liquidCoveredKm.toFixed(2)} km
              </strong>
            </div>
          </div>
          <div className={styles.liquidTankTrack}>
            <div
              className={styles.liquidTankTrackFill}
              style={{ "--trackWidth": `${liquidTrackFillWidth}%` }}
            >
              <span className={styles.liquidTankTrackDash} />
              <span className={styles.liquidTankTruckIcon}>
                <Truck size={11} />
              </span>
            </div>
          </div>
          <div className={styles.liquidTankAlertRow}>
            <span>Almost there!</span>
            <strong>{liquidLeftKm.toFixed(2)} km left</strong>
          </div>
        </div>
      </div>
      <div className={styles.liquidTankFooter}>
        <div>
          <strong>{liquidCoveredKm.toFixed(2)}</strong>
          <span>Done Km</span>
        </div>
        <div>
          <strong>{liquidLeftKm.toFixed(2)}</strong>
          <span>Left Km</span>
        </div>
        <div>
          <strong>{Math.round(liquidCoveragePercent)}%</strong>
          <span>Coverage</span>
        </div>
      </div>
    </div>
  );
};

export default LiquidCoverageTracker;
