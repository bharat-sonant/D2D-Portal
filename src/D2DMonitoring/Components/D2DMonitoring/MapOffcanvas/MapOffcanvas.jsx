import { useState } from "react";
import { X, Map, Layers } from "lucide-react";
import MapSection from "../MapSection";
import VehicleTrackingMap from "../VehicleTrackingMap/VehicleTrackingMap";
import styles from "./MapOffcanvas.module.css";

/**
 * MapOffcanvas
 * A right-side offcanvas panel (70 vw wide) that renders a full-height map.
 *
 * Props:
 *  open            – boolean, whether panel is visible
 *  onClose         – fn, called when backdrop or X is clicked
 *  wardName        – string, shown in header subtitle
 *  city            – passed to MapSection / VehicleTrackingMap
 *  selectedWard    – passed to MapSection / VehicleTrackingMap
 *  lineStatusByLine– passed to MapSection / VehicleTrackingMap
 *  focusLocation   – passed to MapSection
 *  vehicleId       – passed to VehicleTrackingMap for live status subscription
 *  vehicleNumber   – vehicle registration label shown in VehicleTrackingMap sidebar
 */
const MapOffcanvas = ({
  open,
  onClose,
  wardName,
  city,
  selectedWard,
  lineStatusByLine = {},
  focusLocation = null,
  vehicleId,
  vehicleNumber,
}) => {
  const [showActivityMap, setShowActivityMap] = useState(false);

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
            <span className={`${styles.headerIcon} ${showActivityMap ? styles.headerIconActivity : ""}`}>
              {showActivityMap ? <Layers size={16} /> : <Map size={16} />}
            </span>
            <div>
              <div className={styles.headerTitle}>
                {showActivityMap ? "Vehicle Tracking" : "Live Map"}
              </div>
              {wardName && (
                <div className={styles.headerSub}>{wardName}</div>
              )}
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${showActivityMap ? styles.toggleBtnActive : ""}`}
              onClick={() => setShowActivityMap((prev) => !prev)}
              aria-label="Toggle vehicle tracking"
              title={showActivityMap ? "Switch to Live Map" : "Track Vehicle Activity"}
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
          {showActivityMap ? (
            <VehicleTrackingMap
              vehicleId={vehicleId || selectedWard?.id}
              vehicleNumber={vehicleNumber}
              city={city}
              selectedWard={selectedWard}
              lineStatusByLine={lineStatusByLine}
            />
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
