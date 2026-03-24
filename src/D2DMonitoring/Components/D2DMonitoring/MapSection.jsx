import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import mcStyles from "./Common/MonitoringCard/MonitoringCard.module.css";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import { MoveUpRight } from "lucide-react";
import * as action from "../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import tippperIcon from "../../../assets/images/tipper-green.png";
import goIcon from "../../../assets/images/go-image.png";
import endIcon from "../../../assets/images/end-image.png";

const CAR_ICON = {
  url: tippperIcon,
  scaledSize: { width: 41, height: 26 },
  anchor: { x: 24, y: 24 },
};

const GO_ICON = {
  url: goIcon,
  scaledSize: { width: 23, height: 41 },
  anchor: { x: 18, y: 36 },
};

const END_ICON = {
  url: endIcon,
  scaledSize: { width: 32, height: 41 },
  anchor: { x: 18, y: 36 },
};

const MapSection = ({
  city,
  selectedWard,
  onWardLengthResolved,
  onWardLinesResolved,
  lineStatusByLine = {},
  focusLocation = null,
  onExpandMap,
  fullHeight = false,
  showMarkers = false,
  hideHeader = false,
  vehicleLocation = null,
  wardStartPoint = null,
  wardEndPoint = null,
}) => {
  const [isGoogleReady, setIsGoogleReady] = useState(
    action.isGoogleMapsReady(),
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapAnimating, setIsMapAnimating] = useState(false);
  const [fullscreenFrame, setFullscreenFrame] = useState(null);
  const [mapPlaceholderHeight, setMapPlaceholderHeight] = useState(0);
  const [boundaryJson, setBoundaryJson] = useState(null);
  const [linesGeoJson, setLinesGeoJson] = useState(null);
  const mapRef = useRef(null);
  const mapSectionRef = useRef(null);
  const mapAnimationTimerRef = useRef(null);

  const fullscreenSetters = {
    setIsMapAnimating,
    setIsFullscreen,
    setFullscreenFrame,
    setMapPlaceholderHeight,
  };

  useEffect(() => {
    if (!city || !selectedWard?.id) return;
    setBoundaryJson(null);
    setLinesGeoJson(null);
    action.fetchWardMapData(
      city,
      selectedWard.id,
      setBoundaryJson,
      setLinesGeoJson,
    );
  }, [city, selectedWard?.id]);

  const wardBoundary = useMemo(
    () => action.getBoundaryPathFromWardBoundaryJson(boundaryJson),
    [boundaryJson],
  );

  const selectedWardLinePaths = useMemo(
    () => action.getLinePathsFromGeoJson(linesGeoJson),
    [linesGeoJson],
  );

  const selectedWardLengthInMeter = useMemo(
    () => action.getWardLengthInMeter(linesGeoJson),
    [linesGeoJson],
  );

  const lineOptionsByIndex = useMemo(
    () =>
      action.getLineOptionsForPaths(selectedWardLinePaths, lineStatusByLine),
    [selectedWardLinePaths, lineStatusByLine],
  );

  useEffect(() => {
    if (isGoogleReady) return;
    return action.waitForGoogleMapsReady(setIsGoogleReady);
  }, [isGoogleReady]);

  useEffect(() => {
    if (!isGoogleReady) return;
    return action.scheduleMapZoom(mapRef, selectedWardLinePaths, wardBoundary);
  }, [isGoogleReady, wardBoundary, selectedWardLinePaths]);

  useEffect(() => {
    if (!isGoogleReady) return;
    action.focusOnLocation(mapRef, focusLocation);
  }, [
    isGoogleReady,
    focusLocation?.id,
    focusLocation?.lat,
    focusLocation?.lng,
  ]);

  useEffect(() => {
    if (typeof onWardLengthResolved === "function") {
      onWardLengthResolved(selectedWardLengthInMeter);
    }
  }, [onWardLengthResolved, selectedWardLengthInMeter]);

  useEffect(() => {
    if (typeof onWardLinesResolved === "function") {
      onWardLinesResolved(linesGeoJson);
    }
  }, [onWardLinesResolved, linesGeoJson]);

  useEffect(() => {
    return () => {
      if (mapAnimationTimerRef.current)
        clearTimeout(mapAnimationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return undefined;
    return action.lockBodyScroll();
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return undefined;
    return action.registerEscapeHandler(
      mapSectionRef,
      mapAnimationTimerRef,
      fullscreenSetters,
    );
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return undefined;
    return action.registerResizeHandler(setFullscreenFrame);
  }, [isFullscreen]);

  useEffect(() => {
    const timer = setTimeout(() => action.triggerMapResize(mapRef), 90);
    return () => clearTimeout(timer);
  }, [isFullscreen, selectedWard?.id]);

  if (!isGoogleReady) return null;

  return (
    <div
      ref={mapSectionRef}
      className={styles.mapSectionShell}
      style={{
        ...(isFullscreen && mapPlaceholderHeight > 0
          ? { minHeight: `${mapPlaceholderHeight}px` }
          : {}),
        ...(fullHeight
          ? {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              marginBottom: 0,
            }
          : {}),
      }}
    >
      {isFullscreen && (
        <button
          type="button"
          className={styles.mapFullscreenBackdrop}
          onClick={() =>
            action.closeFullscreen(
              mapSectionRef,
              mapAnimationTimerRef,
              fullscreenSetters,
            )
          }
          aria-label="Close fullscreen map"
        />
      )}
      <div
        className={`${styles.glassCard} ${styles.mapCard} ${isFullscreen ? styles.mapCardFullscreen : ""} ${
          isMapAnimating ? styles.mapCardTransitioning : ""
        }`}
        style={{
          display: "flex",
          flexDirection: "column",
          ...(isFullscreen && fullscreenFrame
            ? {
                top: `${fullscreenFrame.top}px`,
                left: `${fullscreenFrame.left}px`,
                width: `${fullscreenFrame.width}px`,
                height: `${fullscreenFrame.height}px`,
              }
            : fullHeight
              ? { height: "auto", flex: 1, minHeight: 0 }
              : {}),
        }}
      >
        {/* ── Card Header ── */}
        {!hideHeader && (
          <div className={mcStyles.cardHeader}>
            <h3 className={mcStyles.cardTitle}>Live Map</h3>
            <div className={mcStyles.cardHeaderRight}>
              {onExpandMap && (
                <button
                  type="button"
                  className={styles.mapFullscreenBtn}
                  onClick={onExpandMap}
                  aria-label="Open large map"
                  title="Expand map"
                  style={{ position: "static", margin: 0 }}
                >
                  <MoveUpRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Map Area ── */}
        <div
          className={mcStyles.mapBody}
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {" "}
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              defaultCenter={{ lat: 27.625, lng: 75.13 }}
              defaultZoom={14}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{ disableDefaultUI: true }}
              style={{ borderRadius: "6px" }}
            >
              {wardBoundary.length > 0 && (
                <Polyline
                  path={wardBoundary}
                  options={action.WARD_BOUNDARY_STYLE}
                />
              )}

              {selectedWardLinePaths.map((path, index) => (
                <Polyline
                  key={`${selectedWard?.id}-line-${index}`}
                  path={path}
                  options={lineOptionsByIndex[index]}
                />
              ))}

              {showMarkers &&
                Number.isFinite(focusLocation?.lat) &&
                Number.isFinite(focusLocation?.lng) && (
                  <Marker
                    position={{
                      lat: Number(focusLocation.lat),
                      lng: Number(focusLocation.lng),
                    }}
                    title={focusLocation?.title || "Selected location"}
                  />
                )}

              {vehicleLocation?.lat && vehicleLocation?.lng && (
                <Marker
                  position={{ lat: vehicleLocation.lat, lng: vehicleLocation.lng }}
                  icon={CAR_ICON}
                  title="Vehicle Location"
                />
              )}

              {wardStartPoint?.lat && wardStartPoint?.lng && (
                <Marker
                  position={{ lat: wardStartPoint.lat, lng: wardStartPoint.lng }}
                  icon={GO_ICON}
                  title="Ward Start"
                />
              )}

              {wardEndPoint?.lat && wardEndPoint?.lng && (
                <Marker
                  position={{ lat: wardEndPoint.lat, lng: wardEndPoint.lng }}
                  icon={END_ICON}
                  title="Ward End"
                />
              )}

            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
