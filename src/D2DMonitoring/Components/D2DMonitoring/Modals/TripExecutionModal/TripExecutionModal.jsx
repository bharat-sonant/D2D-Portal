import React from "react";
import { Package, Trophy, Clock, Navigation, MapPin, Map } from "lucide-react";
import MonitoringModal from "../../Common/MonitoringModal/MonitoringModal";
import styles from "./TripExecutionModal.module.css";

const TripExecutionModal = ({ wardData, tripCompleted, tripActive, onClose }) => {
  const footer = (
    <div className={styles.vehicleJourneySummaryStrip}>
      <span className={styles.vehicleJourneySummaryIcon}>
        <Trophy size={12} />
      </span>
      <p>Vehicle made <b>{tripCompleted}</b> trips today · Total distance <b>4.55 km</b> · <b>{tripActive}</b> trip active</p>
    </div>
  );

  return (
    <MonitoringModal
      title="Trip Execution"
      subtitle={`${wardData.vehicleNumber} · Today`}
      icon={<Package size={16} />}
      width="lg"
      onClose={onClose}
      footer={footer}
    >
      <div className={styles.tripLogSection}>
        <div className={styles.tripItem}>
          <div className={`${styles.tripNumber} ${styles.tripNumberDone}`}>#1</div>
          <div className={styles.tripContent}>
            <div className={styles.tripTop}>
              <h5>Morning Run</h5>
              <span className={`${styles.tripBadge} ${styles.tripBadgeDone}`}>✓ Done</span>
            </div>
            <div className={styles.tripMeta}>
              <div className={styles.tripMetaItem}><Clock size={12} className={styles.tripMetaIcon} /> <b>06:23</b>  → 07:45</div>
              <div className={styles.tripMetaItem}><Navigation size={12} className={styles.tripMetaIcon} /> 4.55 km</div>
              <div className={styles.tripMetaItem}><MapPin size={12} className={styles.tripMetaIcon} /> 3 zones</div>
              <div className={styles.tripMetaItem}><Map size={12} className={styles.tripMetaIcon} /> 14 lines</div>
            </div>
          </div>
        </div>
        <div className={styles.tripItem}>
          <div className={`${styles.tripNumber} ${styles.tripNumberActive}`}>#2</div>
          <div className={styles.tripContent}>
            <div className={styles.tripTop}>
              <h5>Current Run</h5>
              <span className={`${styles.tripBadge} ${styles.tripBadgeActive}`}>• Active</span>
            </div>
            <div className={styles.tripMeta}>
              <div className={styles.tripMetaItem}><Clock size={12} className={styles.tripMetaIcon} /><b>  08:56</b>  → now</div>
              <div className={styles.tripMetaItem}><Navigation size={12} className={styles.tripMetaIcon} /> 0 km</div>
              <div className={styles.tripMetaItem}><MapPin size={12} className={styles.tripMetaIcon} /> 1 zones</div>
              <div className={styles.tripMetaItem}><Map size={12} className={styles.tripMetaIcon} /> 18 lines</div>
            </div>
          </div>
        </div>
      </div>
    </MonitoringModal>
  );
};

export default TripExecutionModal;
