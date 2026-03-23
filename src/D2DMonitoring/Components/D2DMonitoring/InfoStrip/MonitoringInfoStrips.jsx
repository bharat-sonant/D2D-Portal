import { Route, PauseCircle, Smartphone, Repeat, LayoutList, CheckCircle2, Clock4, XCircle, ListOrdered } from "lucide-react";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
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

/* ─── Card 2: Line Count Grid ───────────────────────────────────
   2×2 grid showing completed / pending / skipped / total lines.
   MonitoringCard header (same style as Shift Timeline card).
──────────────────────────────────────────────────────────────── */
export const FieldMetricsGrid = ({ lineCounts = {} }) => {
  const cells = [
    { label: "Total",     value: lineCounts.total     ?? "--", accent: "var(--themeColor)", icon: <ListOrdered size={14} /> },
    { label: "Completed", value: lineCounts.completed ?? "--", accent: "#16a34a",           icon: <CheckCircle2 size={14} /> },
    { label: "Skipped",   value: lineCounts.skipped   ?? "--", accent: "#dc2626",           icon: <XCircle      size={14} /> },
    { label: "Pending",   value: lineCounts.pending   ?? "--", accent: "#d97706",           icon: <Clock4       size={14} /> },
  ];

  return (
    <MonitoringCard title="Ward Lines" icon={<LayoutList size={16} />}>
      <div className={styles.metricsGrid}>
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            className={`${styles.metricCell} ${i < 2 ? styles.borderBottom : ""} ${i % 2 === 0 ? styles.borderRight : ""}`}
          >
            <div className={styles.metricValueRow}>
              <span className={styles.metricValue} style={{ color: cell.accent }}>{cell.value}</span>
              <span className={styles.metricIcon} style={{ color: cell.accent }}>{cell.icon}</span>
            </div>
            <span className={styles.metricCellLabel}>{cell.label}</span>
          </div>
        ))}
      </div>
    </MonitoringCard>
  );
};
