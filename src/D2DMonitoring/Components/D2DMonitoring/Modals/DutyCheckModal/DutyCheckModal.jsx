import { X, Clock, AlertCircle } from "lucide-react";
import WevoisLoader from "../../../../../components/Common/Loader/WevoisLoader";
import avtarUser from "../../../../../assets/images/avtarUser.png";
import realtimeStyles from "../../../../Pages/D2DRealtime/Realtime.module.css";
import styles from "./DutyCheckModal.module.css";

const LABELS = {
  dutyIn:  { title: "Duty In",  subtitle: "Shift start attendance record" },
  dutyOff: { title: "Duty Off", subtitle: "Shift end attendance record"   },
};

const CrewCard = ({ role, name, profileImage, isLarge = false, noImage = false }) => (
  <div className={styles.crewCard}>
    <div className={styles.roleChip}>{role}</div>
    {noImage ? (
      <div className={styles.noImagePlaceholder}>
        No image available
      </div>
    ) : (
      <div className={`${styles.photoWrap} ${isLarge ? styles.largePhotoWrap : ""}`}>
        <img
          src={profileImage || avtarUser}
          alt={name || role}
          className={`${styles.photo} ${isLarge ? styles.largePhoto : ""}`}
          onError={(e) => { e.target.src = avtarUser; }}
        />
      </div>
    )}
    <div className={styles.crewName}>{name || "—"}</div>
  </div>
);

const DutyCheckModal = ({ type = "dutyIn", time, wardName, workers = {}, attendanceImage, isLoading, onClose }) => {
  const meta = LABELS[type] ?? LABELS.dutyIn;
  const isNotDone = !time || time === "00:00" || time === "--:--";

  return (
    <div
      className={`${realtimeStyles.modalContent} ${styles.shell}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <div className={styles.headerTop}>
            <span className={`${styles.typeBadge} ${styles[`badge_${type}`]}`}>
              <Clock size={11} /> {meta.title}
            </span>
          </div>
          <p className={styles.subtitle}>{meta.subtitle}</p>
        </div>
        <button className={realtimeStyles.modalCloseBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* ── Time strip ── */}
      <div className={styles.timeStrip}>
        <Clock size={13} className={isNotDone ? styles.grayTime : ""} />
        <span>{type === "dutyIn" ? "Duty in Time" : "Duty off Time"}: <strong className={isNotDone ? styles.grayTime : ""}>{time || "--:--"}</strong></span>
      </div>

      {/* ── Crew cards ── */}
      <div className={styles.crewRow}>
        {isLoading ? (
          <div style={{ padding: "40px 0", width: "100%", display: "flex", justifyContent: "center" }}>
            <WevoisLoader title={`Fetching ${meta.title} record...`} height="120px" />
          </div>
        ) : isNotDone ? (
           <div style={{ padding: "20px", width: "100%", textAlign: "center", color: "#6b7280" }}>
             <AlertCircle size={32} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
             <p>{meta.title} has not been completed yet.</p>
           </div>
        ) : (
          <CrewCard
            role="Captain"
            name={workers.captain?.name}
            profileImage={attendanceImage || workers.captain?.profileImage}
            isLarge={!!attendanceImage}
            noImage={!attendanceImage}
          />
        )}
      </div>
    </div>
  );
};

export default DutyCheckModal;
