import { useState, useEffect } from "react";
import { X, Map, Route, Play, Square } from "lucide-react";
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
  wardStartPoint = null,
  wardEndPoint = null,
}) => {
  const [showTracking, setShowTracking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!open) { setShowTracking(false); setIsPlaying(false); }
  }, [open]);

  useEffect(() => {
    if (!showTracking) setIsPlaying(false);
  }, [showTracking]);

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
            {showTracking && (
              <button
                type="button"
                className={`${styles.toggleBtn} ${isPlaying ? styles.toggleBtnActive : ""}`}
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Stop animation" : "Play route animation"}
                title={isPlaying ? "Stop" : "Play VTS Route"}
              >
                {isPlaying ? <Square size={14} /> : <Play size={14} />}
              </button>
            )}
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
            <VehicleTrackingMap
              selectedWard={selectedWard}
              city={city}
              isPlaying={isPlaying}
              onPlayingChange={setIsPlaying}
            />
          ) : (
            <MapSection
              city={city}
              selectedWard={selectedWard}
              lineStatusByLine={lineStatusByLine}
              focusLocation={focusLocation}
              vehicleLocation={vehicleLocation}
              wardStartPoint={wardStartPoint}
              wardEndPoint={wardEndPoint}
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
