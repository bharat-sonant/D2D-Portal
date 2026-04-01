import React from "react";
import { Route, PauseCircle, Smartphone, Repeat, LayoutList, CheckCircle2, Clock4, XCircle, ListOrdered } from "lucide-react";
import styles from "./MonitoringInfoStrips.module.css";

/* ─── Card 1: Shift Snapshot Strip ─────────────────────────────
   Horizontal row of 4 chips. No graph, no title — just ambient
   data that a user can glance at without stopping.
──────────────────────────────────────────────────────────────── */
export const ShiftSnapshotStrip = ({ wardData }) => {
  const items = [
    {
      key: "trips",
      icon: <Repeat size={13} />,
      label: "Trips",
      value: `${wardData?.tripsDone ?? wardData?.trips ?? 0}`,
    },
    {
      key: "halt",
      icon: <PauseCircle size={13} />,
      label: "Total Halt",
      value: wardData?.halt?.total || "--",
    },
    {
      key: "km",
      icon: <Route size={13} />,
      label: "Dist. Covered",
      value: wardData?.kmStats?.total || "--",
    },
    {
      key: "app",
      icon: <Smartphone size={13} />,
      label: "App",
      value: wardData?.appStatus || "--",
      tone: wardData?.appStatus === "Opened" ? "open" : "closed",
    },
  ];

  return (
    <div className={styles.stripCard}>
      <span className={styles.stripAccent} />
      <div className={styles.stripRow}>
        {items.map((item, i) => (
          <>
            <div key={item.key} className={styles.stripChip}>
              <span className={styles.chipIcon}>{item.icon}</span>
              <span className={styles.chipLabel}>{item.label}</span>
              <span className={`${styles.chipValue} ${item.tone ? styles[`tone_${item.tone}`] : ""}`}>
                {item.value}
              </span>
            </div>
            {i < items.length - 1 && <span key={`div-${i}`} className={styles.stripDivider} />}
          </>
        ))}
      </div>
    </div>
  );
};

/* ─── Card 2: Ward Lines Strip ──────────────────────────────────
   Compact single-row strip — low-priority section, minimal space.
──────────────────────────────────────────────────────────────── */
export const FieldMetricsGrid = ({ lineCounts = {} }) => {
  const items = [
    { label: "Total",     value: lineCounts.total     ?? "--", color: "var(--themeColor)" },
    { label: "Completed", value: lineCounts.completed ?? "--", color: "#16a34a" },
    { label: "Skipped",   value: lineCounts.skipped   ?? "--", color: "#dc2626" },
    { label: "Pending",   value: lineCounts.pending   ?? "--", color: "#d97706" },
  ];

  return (
    <div className={styles.wardLinesStrip}>
      <span className={styles.wardLinesLabel}>
        <LayoutList size={11} style={{ opacity: 0.5 }} />
        Ward Lines
      </span>
      <div className={styles.wardLinesDivider} />
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <div className={styles.wardLinesCell}>
            <span className={styles.wardLinesValue} style={{ color: item.color }}>{item.value}</span>
            <span className={styles.wardLinesCellLabel}>{item.label}</span>
          </div>
          {i < items.length - 1 && <span className={styles.wardLinesSep} />}
        </React.Fragment>
      ))}
    </div>
  );
};
