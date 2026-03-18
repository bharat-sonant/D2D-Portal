import React from "react";
import { X, Truck, ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { Fuel, ArrowRight, LogOut, MapPin, Flag } from "lucide-react";
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
  routeSnapshotView,
  summaryText,
  onRouteSnapshotViewToggle,
  onClose,
}) => {
  return (
    <div className={styles.vehicleJourneyModal}>
      <div className={styles.vehicleJourneyHeader}>
        <div className={styles.vehicleJourneyHeadingWrap}>
          <span className={styles.vehicleJourneyTagIcon}>
            <Truck size={14} />
          </span>
          <div>
            <h3 className={styles.vehicleJourneyTitle}>Vehicle Status</h3>
            <p className={styles.vehicleJourneySubTitle}>
              {wardData.vehicleNumber} · Today
            </p>
          </div>
        </div>
        <button className={styles.modalCloseBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className={styles.vehicleJourneyBody}>
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
            <button
              type="button"
              className={styles.vehicleJourneyViewToggle}
              onClick={onRouteSnapshotViewToggle}
              title={routeSnapshotView === "detail" ? "Switch to compact view" : "Switch to detailed view"}
              aria-label={routeSnapshotView === "detail" ? "Switch to compact view" : "Switch to detailed view"}
            >
              {routeSnapshotView === "detail" ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {routeSnapshotView === "detail" ? (
            <div className={styles.vehicleJourneyEventList}>
              {routeSnapshotRows.map((entry, index) => {
                const meta = getJourneyKindMeta(entry.kind);
                const EventIcon = meta.icon;
                return (
                  <div
                    key={entry.id || `${entry.time}-${index}`}
                    className={styles.vehicleJourneyEventRow}
                  >
                    <div className={styles.vehicleJourneyEventAxis}>
                      <span className={`${styles.vehicleJourneyEventDot} ${styles[`vehicleJourneyTone${meta.tone}`]}`}>
                        <EventIcon size={12} />
                      </span>
                      {index < routeSnapshotRows.length - 1 && (
                        <span className={styles.vehicleJourneyEventLine} />
                      )}
                    </div>
                    <div className={`${styles.vehicleJourneyEventCard} ${styles[`vehicleJourneyEvent${meta.tone}`]}`}>
                      <div className={styles.vehicleJourneyEventTop}>
                        <h4>{entry.title}</h4>
                        <span>{entry.time}</span>
                      </div>
                      <p>{entry.description}</p>
                      <div className={styles.vehicleJourneyEventMeta}>
                        <span className={styles.vehicleJourneyEventTag}>{entry.tag}</span>
                        <span className={styles.vehicleJourneyEventDuration}>{entry.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
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
          )}
        </div>

        <div className={styles.vehicleJourneySummaryStrip}>
          <span className={styles.vehicleJourneySummaryIcon}>
            <Trophy size={12} />
          </span>
          <p dangerouslySetInnerHTML={{ __html: summaryText }} />
        </div>
      </div>
    </div>
  );
};

export default VehicleJourneyModal;
