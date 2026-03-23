import { useState } from "react";
import { X } from "lucide-react";
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
}) => {
  const [showTracking, setShowTracking] = useState(false);

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
              <div className={styles.headerSub}>{wardName}</div>
            )}
          </div>

          {/* Toggle */}
          <div className={styles.tabToggle}>
            <button
              type="button"
              className={`${styles.tabBtn} ${!showTracking ? styles.tabBtnActive : ""}`}
              onClick={() => setShowTracking(false)}
            >
              Live Map
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${showTracking ? styles.tabBtnActive : ""}`}
              onClick={() => setShowTracking(true)}
            >
              Vehicle Tracking
            </button>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close map"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.mapBody}>
          {showTracking ? (
            <VehicleTrackingMap />
          ) : (
            <MapSection
              city={city}
              selectedWard={selectedWard}
              lineStatusByLine={lineStatusByLine}
              focusLocation={focusLocation}
              showMarkers
              fullHeight
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MapOffcanvas;
