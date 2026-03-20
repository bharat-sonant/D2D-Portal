import React, { useEffect, useState } from "react";
import { Phone, ChevronRight, UserStar } from "lucide-react";
import fallbackAvatar from "../../../../assets/images/avtarUser.png";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
import styles from "./DutyComparisonReplica.module.css";
import { subscribeWorkerDetails } from "../../../Action/D2DMonitoring/Monitoring/MonitoringAction";

const INITIAL_WORKERS = {
  captain: { name: "", phone: "", profileImage: null, experience: "" },
  pilot:   { name: "", phone: "", profileImage: null, experience: "" },
  vehicle: "",
};

const CrewCard = ({ role, roleStyle, member }) => (
  <div className={styles.heroReplicaCrewCard}>
    <span className={`${styles.heroReplicaRolePill} ${roleStyle}`}>{role}</span>

    <div className={styles.heroReplicaAvatarWrap}>
      <img
        src={member.profileImage || fallbackAvatar}
        alt={member.name || role}
        onError={(e) => { e.target.src = fallbackAvatar; }}
      />
      {/* <span className={styles.heroReplicaOnlineDot} /> */}
    </div>

    <h5>{member.name || `${role} Name`}</h5>

    <p className={styles.heroReplicaPhone}>
      <Phone size={11} />
      {member.phone ? (
        <a href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}>
          {member.phone}
        </a>
      ) : (
        <span>-</span>
      )}
    </p>


  </div>
);

const DutyComparisonReplica = ({ data, wardId, onVehicleClick }) => {
  const [workers, setWorkers] = useState(INITIAL_WORKERS);

  useEffect(() => {
    if (!wardId) return;
    const unsubscribe = subscribeWorkerDetails(wardId, setWorkers);
    return () => unsubscribe();
  }, [wardId]);

  const { captain, pilot, vehicle } = workers;
  const displayVehicle = vehicle || data?.vehicleNumber || "";

  return (
    <MonitoringCard
      title="Heroes on Duty"
      icon={<UserStar size={16} />}
      noPadding={true}
    >
      <div className={styles.heroReplicaCrewGrid}>
        <div className={styles.coverImg}></div>

        <CrewCard
          role="Driver"
          roleStyle={styles.heroReplicaRoleCaptain}
          member={captain}
        />

        <CrewCard
          role="Helper"
          roleStyle={styles.heroReplicaRoleHelper}
          member={pilot}
        />
      </div>

      {/* ── Vehicle row ── */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.heroReplicaVehicleRow}
          // onClick={onVehicleClick}
        >
          <div className={styles.heroReplicaVehicleLeft}>
            🚛
            <div className={styles.vehicleContent}>
              <strong>{displayVehicle}</strong>
            </div>
          </div>
          <ChevronRight size={14} />
        </button>
      </div>
    </MonitoringCard>
  );
};

export default DutyComparisonReplica;
