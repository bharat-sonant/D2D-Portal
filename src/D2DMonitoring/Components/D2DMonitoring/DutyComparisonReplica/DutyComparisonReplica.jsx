import React from "react";
import { Phone, ChevronRight, UserStar } from "lucide-react";
import Chetan from "../../../../assets/images/Chetan.jpeg";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
import styles from "./DutyComparisonReplica.module.css";

const getVehicleJourneyMeta = (rawStatus = "") => {
  const normalizedStatus = String(rawStatus || "").trim().toLowerCase();
  if (normalizedStatus.includes("petrol") || normalizedStatus.includes("fuel") || normalizedStatus.includes("pump")) {
    return { tone: "warning" };
  }
  if (normalizedStatus.includes("dump")) return { tone: "danger" };
  if (normalizedStatus.includes("garage") || normalizedStatus.includes("service") || normalizedStatus.includes("workshop")) {
    return { tone: "neutral" };
  }
  return { tone: "success" };
};

const DutyComparisonReplica = ({ data, onVehicleClick }) => {
  const driver = data?.profiles?.driver || {};
  const helper = data?.profiles?.helper || {};

  return (
    <MonitoringCard
      title="Heroes on Duty"
      icon={<UserStar size={16} />}
      noPadding={true}
    >
      <div className={styles.heroReplicaCrewGrid}>
        <div className={styles.coverImg}></div>
        <div className={styles.heroReplicaCrewCard}>
          <span className={`${styles.heroReplicaRolePill} ${styles.heroReplicaRoleCaptain}`}>Captain</span>
          <div className={styles.heroReplicaAvatarWrap}>
            <img src={Chetan} alt="Driver" />
            <span className={styles.heroReplicaOnlineDot} />
          </div>
          <h5>{driver.name || "Driver Name"}</h5>
          <p className={styles.heroReplicaPhone}>
            <Phone size={11} />
            <a href={`tel:${String(driver.phone || "").replace(/[^\d+]/g, "")}`}>
              {driver.phone || "-"}
            </a>
          </p>
          <p className={styles.heroReplicaRating}>5.0 Star</p>
          <div className={styles.heroReplicaStatsRow}>
            <div>
              <strong>5 yrs</strong>
              <span>Exp.</span>
            </div>
            <div>
              <strong>640Km</strong>
              <span>Driven</span>
            </div>
          </div>
        </div>

        <div className={styles.heroReplicaCrewCard}>
          <span className={`${styles.heroReplicaRolePill} ${styles.heroReplicaRoleHelper}`}>Pilot</span>
          <div className={styles.heroReplicaAvatarWrap}>
            <img src={Chetan} alt="Helper" />
            <span className={styles.heroReplicaOnlineDot} />
          </div>
          <h5>{helper.name || "Helper Name"}</h5>
          <p className={styles.heroReplicaPhone}>
            <Phone size={11} />
            <a href={`tel:${String(helper.phone || "").replace(/[^\d+]/g, "")}`}>
              {helper.phone || "-"}
            </a>
          </p>
          <p className={styles.heroReplicaRating}>5.0 Star</p>
          <div className={styles.heroReplicaStatsRow}>
            <div>
              <strong>1.5 yrs</strong>
              <span>Exp.</span>
            </div>
            <div>
              <strong>180Km</strong>
              <span>Driven</span>
            </div>
          </div>
        </div>
      </div>
        <div  className={styles.cardFooter}>
      <button
        type="button"
        className={styles.heroReplicaVehicleRow}
        onClick={onVehicleClick}
      >
        <div className={styles.heroReplicaVehicleLeft}>
          🚛
          <div className={styles.vehicleContent}>
            <strong>{data?.vehicleNumber}</strong>
          </div>
        </div>
        <ChevronRight size={14} />
      </button>
</div>
      {/* <div className={styles.heroReplicaFooter}>
        <div>
          <strong>{replica?.summary?.tripsDone ?? data?.trips ?? 0}</strong>
          <span>Trips Done</span>
        </div>
        <div>
          <strong>{replica?.summary?.totalLines ?? data?.lines?.total ?? 0}</strong>
          <span>Total Lines</span>
        </div>
        <div>
          <strong>{replica?.summary?.teamRating ?? 5.0}</strong>
          <span>Team Rating</span>
        </div>
      </div> */}
    </MonitoringCard>
  );
};

export default DutyComparisonReplica;
