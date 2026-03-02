import React from "react";
import styles from "./WorkTimelineModal.module.css";

const durationRows = [
  { time: "08:07", minutes: "11 min", fillClass: styles.fillFull, toneClass: styles.fillDanger },
  { time: "08:31", minutes: "11 min", fillClass: styles.fillFull, toneClass: styles.fillDanger },
  { time: "09:49", minutes: "9 min", fillClass: styles.fillMedium, toneClass: styles.fillWarning },
];

const breakItems = [
  {
    time: "08:07",
    duration: "11 min",
    status: "WORK-STOPPED",
    address: "352, Mohalla Naarwan, Mohalla Vapariyan, Sikar",
    statusTone: styles.statusDanger,
    nodeTone: styles.nodeTeal,
    badgeTone: styles.badgeDanger,
  },
  {
    time: "08:31",
    duration: "11 min",
    status: "WORK-STOPPED",
    address: "Deen Mohammed Road Hareejan bsati, word number 5, Fatehpur Rd, Mohalla Vapariyan, Sikar",
    statusTone: styles.statusDanger,
    nodeTone: styles.nodeTeal,
    badgeTone: styles.badgeDanger,
  },
  {
    time: "09:49",
    duration: "9 min",
    status: "ONGOING STOP",
    address: "120/18, Bajaj Rd, Imam Ganj, Kalwaria Kunj, Sikar",
    statusTone: styles.statusWarning,
    nodeTone: styles.nodeRed,
    badgeTone: styles.badgeWarning,
  },
];

const WorkTimelineModal = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Work Timeline">
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.iconBox} aria-hidden="true">
              <span className={styles.barOne} />
              <span className={styles.barTwo} />
              <span className={styles.barThree} />
            </div>
            <div>
              <h2 className={styles.title}>Work Timeline</h2>
              <p className={styles.subtitle}>Complete halt chart for today</p>
            </div>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={`${styles.statValue} ${styles.statDanger}`}>31 min</p>
            <p className={styles.statLabel}>TOTAL LOST</p>
          </div>
          <div className={styles.statCard}>
            <p className={`${styles.statValue} ${styles.statWarning}`}>3</p>
            <p className={styles.statLabel}>BREAKS</p>
          </div>
          <div className={styles.statCard}>
            <p className={`${styles.statValue} ${styles.statMuted}`}>10 min</p>
            <p className={styles.statLabel}>AVG BREAK</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>HALT DURATION CHART</h3>
          <div className={styles.durationList}>
            {durationRows.map((row) => (
              <div key={row.time} className={styles.durationRow}>
                <span className={styles.timeText}>{row.time}</span>
                <div className={styles.durationTrack}>
                  <div className={`${styles.durationFill} ${row.fillClass} ${row.toneClass}`}>
                    <span className={styles.inlineBadge}>{row.minutes}</span>
                  </div>
                </div>
                <span className={styles.durationText}>{row.minutes}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>BREAK LOG</h3>
          <div className={styles.breakLogList}>
            {breakItems.map((item) => (
              <div key={item.time} className={styles.breakRow}>
                <div className={`${styles.node} ${item.nodeTone}`} aria-hidden="true" />
                <article className={styles.breakCard}>
                  <div className={styles.breakHeader}>
                    <p className={styles.breakTime}>{item.time}</p>
                    <span className={`${styles.durationBadge} ${item.badgeTone}`}>{item.duration}</span>
                  </div>
                  <p className={styles.breakStatus}>
                    <span className={`${styles.statusDot} ${item.statusTone}`} />
                    {item.status}
                  </p>
                  <p className={styles.breakAddress}>{item.address}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTimelineModal;
