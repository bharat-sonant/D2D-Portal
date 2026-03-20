import { X, Clock } from "lucide-react";
import avtarUser from "../../../../../assets/images/avtarUser.png";
import realtimeStyles from "../../../../Pages/D2DRealtime/Realtime.module.css";
import styles from "./DutyCheckModal.module.css";

const LABELS = {
  dutyIn:  { title: "Duty In",  subtitle: "Shift start attendance record" },
  dutyOff: { title: "Duty Off", subtitle: "Shift end attendance record"   },
};

const CrewCard = ({ role, name, profileImage, isLarge = false }) => (
  <div className={styles.crewCard}>
    <div className={styles.roleChip}>{role}</div>
    <div className={`${styles.photoWrap} ${isLarge ? styles.largePhotoWrap : ""}`}>
      <img
        src={profileImage || avtarUser}
        alt={name || role}
        className={`${styles.photo} ${isLarge ? styles.largePhoto : ""}`}
        onError={(e) => { e.target.src = avtarUser; }}
      />
    </div>
    <div className={styles.crewName}>{name || "—"}</div>
  </div>
);

const DutyCheckModal = ({ type = "dutyIn", time, wardName, workers = {}, dutyInImage, onClose }) => {
  const meta = LABELS[type] ?? LABELS.dutyIn;

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
        <Clock size={13} />
        <span>Duty in Time: <strong>{time || "—"}</strong></span>
      </div>

      {/* ── Crew cards ── */}
      <div className={styles.crewRow}>
        <CrewCard
          role="Captain"
          name={workers.captain?.name}
          profileImage={type === "dutyIn" && dutyInImage ? dutyInImage : workers.captain?.profileImage}
          isLarge={type === "dutyIn" && !!dutyInImage}
        />
      </div>
    </div>
  );
};

export default DutyCheckModal;
