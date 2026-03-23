import { useState } from "react";
import { X, Map, Layers } from "lucide-react";
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
            <span className={`${styles.headerIcon} ${showTracking ? styles.headerIconActivity : ""}`}>
              {showTracking ? <Layers size={16} /> : <Map size={16} />}
            </span>
            <div>
              <div className={styles.headerTitle}>
                {showTracking ? "Vehicle Tracking" : "Live Map"}
              </div>
              {wardName && (
                <div className={styles.headerSub}>{wardName}</div>
              )}
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${showTracking ? styles.toggleBtnActive : ""}`}
              onClick={() => setShowTracking((prev) => !prev)}
              aria-label="Toggle vehicle tracking"
              title={showTracking ? "Switch to Live Map" : "Track Vehicle"}
            >
              <Layers size={16} />
            </button>
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
