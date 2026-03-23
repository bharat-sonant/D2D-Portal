import { useState, useEffect } from "react";
import { X, Map, Route } from "lucide-react";
import MapSection from "../MapSection";
import VehicleTrackingMap from "../VehicleTrackingMap/VehicleTrackingMap";
import styles from "./MapOffcanvas.module.css";

const MapOffcanvas = ({
  open,
  onClose,
  wardName,
  city,
  selectedWard,
  lineStatusByLine = {},
  focusLocation = null,
  vehicleLocation = null,
}) => {
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
    if (!open) setShowTracking(false);
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Full map view"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {wardName && (
              <div className={styles.headerTitle}>{wardName}</div>
            )}
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close map"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.mapBody}>
          {showTracking ? (
            <VehicleTrackingMap selectedWard={selectedWard} city={city} />
          ) : (
            <MapSection
              city={city}
              selectedWard={selectedWard}
              lineStatusByLine={lineStatusByLine}
              focusLocation={focusLocation}
              vehicleLocation={vehicleLocation}
              showMarkers
              fullHeight
              hideHeader
            />
          )}

          {/* ── Floating accordion-style view toggle ── */}
          <div className={styles.viewToggle}>
            <button
              type="button"
              className={`${styles.viewSegment} ${!showTracking ? styles.viewSegmentActive : styles.viewSegmentInactive}`}
              onClick={() => setShowTracking(false)}
            >
              <Map size={13} />
              <span className={styles.viewSegmentText}>Map View</span>
            </button>

            <span className={styles.viewToggleDivider} />

            <button
              type="button"
              className={`${styles.viewSegment} ${showTracking ? styles.viewSegmentActive : styles.viewSegmentInactive}`}
              onClick={() => setShowTracking(true)}
            >
              <Route size={13} />
              <span className={styles.viewSegmentText}>Travel Path</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapOffcanvas;
