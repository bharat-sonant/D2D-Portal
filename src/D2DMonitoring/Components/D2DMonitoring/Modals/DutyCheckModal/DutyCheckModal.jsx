import { Clock, AlertCircle, LogIn, LogOut } from "lucide-react";
import WevoisLoader from "../../../../../components/Common/Loader/WevoisLoader";
import avtarUser from "../../../../../assets/images/avtarUser.png";
import MonitoringModal from "../../Common/MonitoringModal/MonitoringModal";
import styles from "./DutyCheckModal.module.css";

const LABELS = {
  dutyIn:  { title: "Duty In",  subtitle: "Shift start attendance record", icon: <LogIn  size={16} /> },
  dutyOff: { title: "Duty Off", subtitle: "Shift end attendance record",   icon: <LogOut size={16} /> },
};

const DutyCheckModal = ({ type = "dutyIn", time, wardName, workers = {}, attendanceImage, isLoading, onClose }) => {
  const meta = LABELS[type] ?? LABELS.dutyIn;
  const isNotDone = !time || time === "00:00" || time === "--:--";

  return (
    <MonitoringModal
      title={meta.title}
      subtitle={wardName ? `${wardName} · ${meta.subtitle}` : meta.subtitle}
      icon={meta.icon}
      width="sm"
      onClose={onClose}
    >
      {/* ── Body ── */}
      {isLoading ? (
        <div className={styles.centerBlock}>
          <WevoisLoader title={`Fetching ${meta.title} record...`} height="120px" />
        </div>
      ) : isNotDone ? (
        <div className={styles.centerBlock}>
          <AlertCircle size={32} className={styles.alertIcon} />
          <p className={styles.alertText}>{meta.title} has not been completed yet.</p>
        </div>
      ) : (
        <div className={styles.crewRow}>
          {/* Image */}
          {attendanceImage ? (
            <div className={styles.largePhotoWrap}>
              <img
                src={attendanceImage}
                alt={meta.title}
                className={styles.largePhoto}
                onError={(e) => { e.target.src = avtarUser; }}
              />
            </div>
          ) : (
            <div className={styles.noImagePlaceholder}>No image available</div>
          )}

          {/* Time — below image */}
          <div className={`${styles.timeStrip} ${isNotDone ? styles.grayTime : ""}`}>
            <Clock size={13} />
            <span>
              {type === "dutyIn" ? "Duty In Time" : "Duty Off Time"}:{" "}
              <strong>{time || "--:--"}</strong>
            </span>
          </div>
        </div>
      )}
    </MonitoringModal>
  );
};

export default DutyCheckModal;
