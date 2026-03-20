import { X, Map } from "lucide-react";
import MapSection from "../MapSection";
import styles from "./MapOffcanvas.module.css";

/**
 * MapOffcanvas
 * A right-side offcanvas panel (70 vw wide) that renders a full-height map.
 *
 * Props:
 *  open            – boolean, whether panel is visible
 *  onClose         – fn, called when backdrop or X is clicked
 *  wardName        – string, shown in header subtitle
 *  city            – passed to MapSection
 *  selectedWard    – passed to MapSection
 *  lineStatusByLine– passed to MapSection
 *  focusLocation   – passed to MapSection
 */
const MapOffcanvas = ({
  open,
  onClose,
  wardName,
  city,
  selectedWard,
  lineStatusByLine = {},
  focusLocation = null,
}) => {
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
            <span className={styles.headerIcon}>
              <Map size={16} />
            </span>
            <div>
              <div className={styles.headerTitle}>Live Map</div>
              {wardName && (
                <div className={styles.headerSub}>{wardName}</div>
              )}
            </div>
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

        {/* Map body — stretches to fill remaining height */}
        <div className={styles.mapBody}>
          <MapSection
            city={city}
            selectedWard={selectedWard}
            lineStatusByLine={lineStatusByLine}
            focusLocation={focusLocation}
            showMarkers
            fullHeight
          />
        </div>
      </div>
    </>
  );
};

export default MapOffcanvas;
