import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import { Maximize2, Minimize2 } from "lucide-react";
import * as action from "../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";

const MapSection = ({ city, selectedWard, onWardLengthResolved, onWardLinesResolved, lineStatusByLine = {}, focusLocation = null }) => {
    const [isGoogleReady, setIsGoogleReady] = useState(action.isGoogleMapsReady());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMapAnimating, setIsMapAnimating] = useState(false);
    const [fullscreenFrame, setFullscreenFrame] = useState(null);
    const [mapPlaceholderHeight, setMapPlaceholderHeight] = useState(0);
    const [boundaryJson, setBoundaryJson] = useState(null);
    const [linesGeoJson, setLinesGeoJson] = useState(null);
    const mapRef = useRef(null);
    const mapSectionRef = useRef(null);
    const mapAnimationTimerRef = useRef(null);

    const fullscreenSetters = { setIsMapAnimating, setIsFullscreen, setFullscreenFrame, setMapPlaceholderHeight };

    useEffect(() => {
        if (!city || !selectedWard?.id) return;
        setBoundaryJson(null);
        setLinesGeoJson(null);
        action.fetchWardMapData(city, selectedWard.id, setBoundaryJson, setLinesGeoJson);
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
        () => action.getLineOptionsForPaths(selectedWardLinePaths, lineStatusByLine),
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
    }, [isGoogleReady, focusLocation?.id, focusLocation?.lat, focusLocation?.lng]);

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
        return () => { if (mapAnimationTimerRef.current) clearTimeout(mapAnimationTimerRef.current); };
    }, []);

    useEffect(() => {
        if (!isFullscreen) return undefined;
        return action.lockBodyScroll();
    }, [isFullscreen]);

    useEffect(() => {
        if (!isFullscreen) return undefined;
        return action.registerEscapeHandler(mapSectionRef, mapAnimationTimerRef, fullscreenSetters);
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
            style={isFullscreen && mapPlaceholderHeight > 0 ? { minHeight: `${mapPlaceholderHeight}px` } : undefined}
        >
            {isFullscreen && (
                <button
                    type="button"
                    className={styles.mapFullscreenBackdrop}
                    onClick={() => action.closeFullscreen(mapSectionRef, mapAnimationTimerRef, fullscreenSetters)}
                    aria-label="Close fullscreen map"
                />
            )}
            <div
                className={`${styles.glassCard} ${styles.mapCard} ${isFullscreen ? styles.mapCardFullscreen : ""} ${
                    isMapAnimating ? styles.mapCardTransitioning : ""
                }`}
                style={
                    isFullscreen && fullscreenFrame
                        ? {
                            top: `${fullscreenFrame.top}px`,
                            left: `${fullscreenFrame.left}px`,
                            width: `${fullscreenFrame.width}px`,
                            height: `${fullscreenFrame.height}px`,
                        }
                        : undefined
                }
            >
                {/* <button
                    type="button"
                    className={styles.mapFullscreenBtn}
                    onClick={isFullscreen
                        ? () => action.closeFullscreen(mapSectionRef, mapAnimationTimerRef, fullscreenSetters)
                        : () => action.openFullscreen(mapSectionRef, mapAnimationTimerRef, fullscreenSetters)
                    }
                    aria-label={isFullscreen ? "Exit fullscreen map" : "Open fullscreen map"}
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button> */}
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    defaultCenter={{ lat: 27.625, lng: 75.13 }}
                    defaultZoom={14}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{ disableDefaultUI: true }}
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

                    {Number.isFinite(focusLocation?.lat) && Number.isFinite(focusLocation?.lng) && (
                        <Marker
                            position={{ lat: Number(focusLocation.lat), lng: Number(focusLocation.lng) }}
                            title={focusLocation?.title || "Selected location"}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default MapSection;
