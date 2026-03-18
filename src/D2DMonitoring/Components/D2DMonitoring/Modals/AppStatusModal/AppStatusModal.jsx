import React from "react";
import { X } from "lucide-react";
import styles from "./AppStatusModal.module.css";

const AppStatusModal = ({
  appSessionLogs,
  appOpenedCount,
  appClosedCount,
  appStatusTab,
  filteredAppSessionLogs,
  phoneClockTime,
  phoneClockDate,
  onTabChange,
  onClose,
}) => {
  return (
    <div className={styles.appStatusWrap}>
      <div className={styles.appPhoneShell}>
        <span className={`${styles.appSideBtn} ${styles.appSideBtnLeft}`} />
        <span className={`${styles.appSideBtn} ${styles.appSideBtnRightTop}`} />
        <span className={`${styles.appSideBtn} ${styles.appSideBtnRightBottom}`} />
        <div className={styles.appPhoneFrame}>
          <div className={styles.appPhoneTop}>
            <span>{phoneClockTime}</span>
            <span className={styles.appPhoneNotch}>
              <span className={styles.appNotchSpeaker} />
              <span className={styles.appNotchCam} />
            </span>
            <span className={styles.appPhoneDate}>{phoneClockDate}</span>
          </div>

          <div className={styles.appPanelHeader}>
            <div className={styles.appPanelLeft}>
              <span className={styles.appPanelIcon}>&#9638;</span>
              <div>
                <p className={styles.appPanelTitle}>App Status</p>
                <p className={styles.appPanelSub}>Today&apos;s full session log</p>
              </div>
            </div>
            <button type="button" className={styles.appPanelClose} onClick={onClose}>
              <X size={14} />
            </button>
          </div>

          <div className={styles.appChipRow}>
            <button
              type="button"
              className={`${styles.appChip} ${appStatusTab === "all" ? styles.appTabActive : ""}`}
              onClick={() => onTabChange("all")}
            >
              All {appSessionLogs.length}
            </button>
            <button
              type="button"
              className={`${styles.appChip} ${styles.appChipOpen} ${appStatusTab === "opened" ? styles.appTabActive : ""}`}
              onClick={() => onTabChange("opened")}
            >
              Opened {appOpenedCount}
            </button>
            <button
              type="button"
              className={`${styles.appChip} ${styles.appChipClosed} ${appStatusTab === "closed" ? styles.appTabActive : ""}`}
              onClick={() => onTabChange("closed")}
            >
              Closed {appClosedCount}
            </button>
          </div>

          <div className={styles.appLogList}>
            {filteredAppSessionLogs.map((entry, index) => (
              <div key={`${entry.time}-${index}`} className={styles.appLogRow}>
                <span
                  className={`${styles.appLogDot} ${
                    entry.tone === "opened"
                      ? styles.appLogDotOpen
                      : entry.tone === "closed"
                        ? styles.appLogDotClose
                        : styles.appLogDotMin
                  }`}
                />
                <span className={styles.appLogTime}>{entry.time}</span>
                <span
                  className={`${styles.appLogBadge} ${
                    entry.tone === "opened"
                      ? styles.appLogBadgeOpen
                      : entry.tone === "closed"
                        ? styles.appLogBadgeClose
                        : styles.appLogBadgeMin
                  }`}
                >
                  {entry.status}
                </span>
                <span className={styles.appLogDuration}>{entry.duration}</span>
              </div>
            ))}
          </div>

          <div className={styles.appPanelFooter}>
            App opened {appOpenedCount}x · avg 32m 17s · closed{" "}
            {appClosedCount}x · screen off 1x
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStatusModal;
