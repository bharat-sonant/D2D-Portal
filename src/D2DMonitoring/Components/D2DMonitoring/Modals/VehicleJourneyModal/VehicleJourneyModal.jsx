import React from "react";
import { Truck } from "lucide-react";
import { Fuel, ArrowRight, LogOut, MapPin, Flag } from "lucide-react";
import MonitoringModal from "../../Common/MonitoringModal/MonitoringModal";
import styles from "./VehicleJourneyModal.module.css";

const getJourneyKindMeta = (kind = "") => {
  const normalized = String(kind || "").trim().toLowerCase();
  if (normalized.includes("fuel")) return { icon: Fuel, tone: "fuel" };
  if (normalized.includes("depart")) return { icon: ArrowRight, tone: "departed" };
  if (normalized.includes("exit")) return { icon: LogOut, tone: "exited" };
  if (normalized.includes("entry") || normalized.includes("enter")) return { icon: MapPin, tone: "entered" };
  if (normalized.includes("flag")) return { icon: Flag, tone: "checkpoint" };
  return { icon: MapPin, tone: "entered" };
};

const VehicleJourneyModal = ({
  wardData,
  vehicleJourneyMeta,
  routeQuickStats,
  routeSnapshotRows,
  summaryText,
  onClose,
}) => {
  // const footer = (
  //   <div className={styles.vehicleJourneySummaryStrip}>
  //     <span className={styles.vehicleJourneySummaryIcon}>
  //       <Trophy size={12} />
  //     </span>
  //     <p dangerouslySetInnerHTML={{ __html: summaryText }} />
  //   </div>
  // );

  return (
    <MonitoringModal
      title="Vehicle Status"
      subtitle={`${wardData.vehicleNumber} · Today`}
      icon={<Truck size={16} />}
      width="md"
      onClose={onClose}
      // footer={footer}
    >
      <div
        className={`${styles.vehicleJourneyStatusCard} ${
          vehicleJourneyMeta.tone === "danger"
            ? styles.vehicleJourneyStatusDanger
            : vehicleJourneyMeta.tone === "warning"
              ? styles.vehicleJourneyStatusWarning
              : vehicleJourneyMeta.tone === "success"
                ? styles.vehicleJourneyStatusSuccess
                : styles.vehicleJourneyStatusNeutral
        }`}
      >
        <div className={styles.vehicleJourneyStatusCopy}>
          <p className={styles.vehicleJourneyStatusLabel}>Current Status</p>
          <h4 className={styles.vehicleJourneyStatusTitle}>{vehicleJourneyMeta.title}</h4>
          <p className={styles.vehicleJourneyStatusDesc}>{vehicleJourneyMeta.description}</p>
        </div>
      </div>

      <div className={styles.vehicleJourneyQuickStrip}>
        {routeQuickStats.map((chip) => (
          <div
            key={chip.key}
            className={`${styles.vehicleJourneyQuickChip} ${styles[`vehicleJourneyQuick${chip.key}`]}`}
          >
            <span className={styles.vehicleJourneyQuickIcon}>{chip.icon}</span>
            <strong>{chip.value}</strong>
            <span className={styles.vehicleJourneyQuickLabel}>{chip.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.vehicleJourneySection}>
        <div className={styles.vehicleJourneySectionHead}>
          <div className={styles.vehicleJourneySectionTitle}>Route Snapshot</div>
        </div>

        <div className={styles.vehicleJourneyCompactList}>
          {routeSnapshotRows.map((entry, index) => {
            const meta = getJourneyKindMeta(entry.kind);
            const EventIcon = meta.icon;
            const shouldShowMeta =
              String(entry.duration || "").toLowerCase().includes("active") ||
              index === routeSnapshotRows.length - 1;
            return (
              <div
                key={entry.id || `${entry.time}-${index}`}
                className={styles.vehicleJourneyCompactRow}
              >
                <div className={styles.vehicleJourneyCompactAxis}>
                  <span className={`${styles.vehicleJourneyCompactDot} ${styles[`vehicleJourneyTone${meta.tone}`]}`}>
                    <EventIcon size={11} />
                  </span>
                  {index < routeSnapshotRows.length - 1 && (
                    <span className={styles.vehicleJourneyCompactLine} />
                  )}
                </div>
                <div className={styles.vehicleJourneyCompactCopy}>
                  <div className={styles.vehicleJourneyCompactTop}>
                    <h4>{entry.title}</h4>
                    <span>{entry.time}</span>
                  </div>
                  {shouldShowMeta && (
                    <div className={styles.vehicleJourneyCompactMeta}>
                      <span className={styles.vehicleJourneyCompactMetaTag}>{entry.tag}</span>
                      <span className={styles.vehicleJourneyCompactMetaTime}>{entry.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MonitoringModal>
  );
};

export default VehicleJourneyModal;
