import React, { useEffect, useState } from "react";
import { Phone, ChevronRight, UserStar, UserX } from "lucide-react";
import { useParams } from "react-router-dom";
import fallbackAvatar from "../../../../assets/images/avtarUser.png";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
import styles from "./DutyComparisonReplica.module.css";
import { subscribeWorkerDetails } from "../../../Action/D2DMonitoring/Monitoring/MonitoringAction";

const INITIAL_WORKERS = {
  captain: { name: "", phone: "", profileImage: null },
  pilot:   { name: "", phone: "", profileImage: null, isDummy: false, noHelper: false, nameRed: false },
  vehicle: "",
};

const isCached = (url) => {
  if (!url) return false;
  const img = new window.Image();
  img.src = url;
  return img.complete && img.naturalWidth > 0;
};

const CrewCard = ({ role, roleStyle, member }) => {
  const realSrc = member.profileImage;

  // Always show something immediately:
  //   cached  → sharp real photo at 0 ms
  //   loading → blurred fallback avatar, swap to sharp real photo once loaded
  const [displaySrc, setDisplaySrc] = useState(
    () => (realSrc && isCached(realSrc)) ? realSrc : fallbackAvatar
  );
  const [sharp, setSharp] = useState(() => !realSrc || isCached(realSrc));

  useEffect(() => {
    if (!realSrc) {
      setDisplaySrc(fallbackAvatar);
      setSharp(true);
      return;
    }
    if (isCached(realSrc)) {
      setDisplaySrc(realSrc);
      setSharp(true);
      return;
    }
    // Show blurred fallback while real image downloads in background
    setDisplaySrc(fallbackAvatar);
    setSharp(false);
    const img = new window.Image();
    img.onload  = () => { setDisplaySrc(realSrc); setSharp(true); };
    img.onerror = () => setSharp(true); // keep fallback, un-blur
    img.src = realSrc;
  }, [realSrc]);

  return (
    <div className={styles.heroReplicaCrewCard}>
      <span className={`${styles.heroReplicaRolePill} ${roleStyle}`}>{role}</span>

      <div className={styles.heroReplicaAvatarWrap}>
        <img
          src={displaySrc}
          alt={member.name || role}
          className={sharp ? styles.imgLoaded : styles.imgBlurPlaceholder}
          fetchpriority="high"
          decoding="async"
          width={90}
          height={90}
          onError={(e) => { e.target.src = fallbackAvatar; setSharp(true); }}
        />
      </div>
      <div className={styles.nameBG}>
        <h5 className={member.nameRed ? styles.nameRed : undefined}>
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
};

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
  const { city } = useParams();
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!wardId) { setWorkers(INITIAL_WORKERS); setIsLoading(false); return; }
    setIsLoading(true);
    const handleUpdate = (w) => {
      setWorkers(w);
      setIsLoading(false); // complete data arrived (name + photo + phone all ready)
    };
    const unsub = subscribeWorkerDetails(wardId, handleUpdate, city);
    return () => unsub();
  }, [wardId, city]);

  const { captain, pilot, vehicle } = workers;
  const displayVehicle = vehicle || "";

  return (
    <MonitoringCard
      title="Heroes on Duty"
      icon={<UserStar size={16} />}
      noPadding={true}
    >
      {isLoading ? (
        <div className={styles.heroReplicaCrewGrid}>
          <div className={styles.coverImg}></div>
          <div className={styles.heroReplicaCrewCard}>
            <div className={styles.skeletonPill} />
            <div className={styles.heroReplicaAvatarWrap}><div className={styles.avatarSkeleton} /></div>
            <div className={styles.nameBG}>
              <div className={styles.skeletonName} />
              <div className={styles.skeletonPhone} />
            </div>
          </div>
          <div className={styles.heroReplicaCrewCard}>
            <div className={styles.skeletonPill} />
            <div className={styles.heroReplicaAvatarWrap}><div className={styles.avatarSkeleton} /></div>
            <div className={styles.nameBG}>
              <div className={styles.skeletonName} />
              <div className={styles.skeletonPhone} />
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {/* ── Vehicle row ── */}
      <div className={styles.cardFooter}>
        {isLoading ? (
          <div className={styles.heroReplicaVehicleRow} style={{ pointerEvents: "none" }}>
            <div className={styles.heroReplicaVehicleLeft}>
              🚛
              <div className={styles.skeletonVehicle} />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.heroReplicaVehicleRow}
            // onClick={onVehicleClick}
          >
            <div className={styles.heroReplicaVehicleLeft}>
              🚛
              <div className={styles.vehicleContent}>
                <strong>{displayVehicle || "No Vehicle Assigned"}</strong>
              </div>
            </div>
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </MonitoringCard>
  );
};

export default DutyComparisonReplica;
