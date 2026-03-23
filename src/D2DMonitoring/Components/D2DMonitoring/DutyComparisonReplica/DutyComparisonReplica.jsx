import React, { useEffect, useState } from "react";
import { Phone, ChevronRight, UserStar, UserX } from "lucide-react";
import fallbackAvatar from "../../../../assets/images/avtarUser.png";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
import styles from "./DutyComparisonReplica.module.css";
import { subscribeWorkerDetails } from "../../../Action/D2DMonitoring/Monitoring/MonitoringAction";

const INITIAL_WORKERS = {
  captain: { name: "", phone: "", profileImage: null, experience: "" },
  pilot:   { name: "", phone: "", profileImage: null, experience: "", noHelper: false, nameRed: false },
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
    </div>
    <div className={styles.nameBG}>
      <h5 style={member.nameRed ? { color: "#dc2626" } : undefined}>
        {member.name || `${role} Name`}
      </h5>
      <p className={styles.heroReplicaPhone}>
        <Phone size={11} />
        {member.phone ? (
          <a href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}>{member.phone}</a>
        ) : (
          <span>-</span>
        )}
      </p>
    </div>
  </div>
);

/** Shown instead of helper CrewCard when isDummy=1 and (c) tag present */
const NoHelperCard = () => (
  <div className={styles.noHelperCard}>
    <div className={styles.noHelperIconWrap}>
      <UserX size={22} className={styles.noHelperIcon} />
    </div>
    <span className={styles.noHelperLabel}>Without Helper</span>
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

        {pilot.noHelper ? (
          <NoHelperCard />
        ) : (
          <CrewCard
            role="Helper"
            roleStyle={styles.heroReplicaRoleHelper}
            member={pilot}
          />
        )}
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
