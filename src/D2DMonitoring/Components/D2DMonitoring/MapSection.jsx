import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import { Maximize2, Minimize2 } from "lucide-react";
//ward boundaries for ward 1 to 5
import ward1Boundary from "../../../assets/Sikar/WardBoundaries/1.json";
import ward2Boundary from "../../../assets/Sikar/WardBoundaries/2.json";
import ward3Boundary from "../../../assets/Sikar/WardBoundaries/3.json";
import ward4Boundary from "../../../assets/Sikar/WardBoundaries/4.json";
import ward5Boundary from "../../../assets/Sikar/WardBoundaries/5.json";
//ward lines for ward 1 to 5
import ward1Line from '../../../assets/Sikar/WardLines/1.json';
import ward2Line from '../../../assets/Sikar/WardLines/2.json';
import ward3Line from '../../../assets/Sikar/WardLines/3.json';
import ward4Line from '../../../assets/Sikar/WardLines/4.json';
import ward5Line from '../../../assets/Sikar/WardLines/5.json';
import * as action from "../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import { getLineColorByStatus } from "../../Action/D2DMonitoring/Monitoring/MonitoringAction";

const wardBoundariesById = {
    1: ward1Boundary,
    2: ward2Boundary,
    3: ward3Boundary,
    4: ward4Boundary,
    5: ward5Boundary,
};

const wardLinesById = {
    1: ward1Line,
    2: ward2Line,
    3: ward3Line,
    4: ward4Line,
    5: ward5Line
};

const DEFAULT_LINE_STYLE = {
    strokeColor: "#79c0f0",
    strokeOpacity: 1,
    strokeWeight: 2,
    zIndex: 3,
};

const MAP_FULLSCREEN_GAP = 10;
const MAP_FULLSCREEN_ANIMATION_MS = 320;

const getViewportFrame = () => ({
    top: MAP_FULLSCREEN_GAP,
    left: MAP_FULLSCREEN_GAP,
    width: Math.max(window.innerWidth - MAP_FULLSCREEN_GAP * 2, 320),
    height: Math.max(window.innerHeight - MAP_FULLSCREEN_GAP * 2, 220),
});

const getElementFrame = (element) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
    };
};

const MapSection = ({ selectedWard, onWardLengthResolved, lineStatusByLine = {}, focusLocation = null }) => {
    const [isGoogleReady, setIsGoogleReady] = useState(action.isGoogleMapsReady());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMapAnimating, setIsMapAnimating] = useState(false);
    const [fullscreenFrame, setFullscreenFrame] = useState(null);
    const [mapPlaceholderHeight, setMapPlaceholderHeight] = useState(0);
    const mapRef = useRef(null);
    const mapSectionRef = useRef(null);
    const mapAnimationTimerRef = useRef(null);
    const mapContainerStyle = { width: "100%", height: "100%" };
    const defaultCenter = { lat: 27.625, lng: 75.13 };

    const { wardBoundary, selectedWardLinePaths, selectedWardLengthInMeter } = useMemo(
        () =>
            action.getSelectedWardMapData({
                wardId: selectedWard?.id,
                wardBoundariesById,
                wardLinesById,
            }),
        [selectedWard?.id],
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
        if (!isGoogleReady || !mapRef.current) return;
        if (!Number.isFinite(focusLocation?.lat) || !Number.isFinite(focusLocation?.lng)) return;
        mapRef.current.panTo({ lat: Number(focusLocation.lat), lng: Number(focusLocation.lng) });
        mapRef.current.setZoom(16);
    }, [isGoogleReady, focusLocation?.id, focusLocation?.lat, focusLocation?.lng]);

    useEffect(() => {
        if (typeof onWardLengthResolved === "function") {
            onWardLengthResolved(selectedWardLengthInMeter);
        }
    }, [onWardLengthResolved, selectedWardLengthInMeter]);

    useEffect(() => {
        return () => {
            if (mapAnimationTimerRef.current) {
                clearTimeout(mapAnimationTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isFullscreen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isFullscreen]);

    useEffect(() => {
        if (!isFullscreen) return undefined;
        const onEscPress = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsMapAnimating(true);
                const targetFrame = getElementFrame(mapSectionRef.current);
                if (targetFrame) {
                    setFullscreenFrame(targetFrame);
                }
                mapAnimationTimerRef.current = setTimeout(() => {
                    setIsMapAnimating(false);
                    setIsFullscreen(false);
                    setFullscreenFrame(null);
                    setMapPlaceholderHeight(0);
                }, MAP_FULLSCREEN_ANIMATION_MS);
            }
        };
        window.addEventListener("keydown", onEscPress);
        return () => window.removeEventListener("keydown", onEscPress);
    }, [isFullscreen]);

    useEffect(() => {
        if (!isFullscreen) return undefined;
        const onWindowResize = () => {
            setFullscreenFrame(getViewportFrame());
        };
        window.addEventListener("resize", onWindowResize);
        return () => window.removeEventListener("resize", onWindowResize);
    }, [isFullscreen]);

    useEffect(() => {
        if (!mapRef.current) return;
        const resizeMap = () => {
            if (!window.google?.maps?.event || !mapRef.current) return;
            window.google.maps.event.trigger(mapRef.current, "resize");
        };
        const timer = setTimeout(resizeMap, 90);
        return () => clearTimeout(timer);
    }, [isFullscreen, selectedWard?.id]);

    const lineOptionsByIndex = useMemo(() => {
        return selectedWardLinePaths.map((_, index) => {
            const lineId = String(index + 1);
            return {
                ...DEFAULT_LINE_STYLE,
                strokeColor: getLineColorByStatus(lineStatusByLine[lineId], DEFAULT_LINE_STYLE),
            };
        });
    }, [selectedWardLinePaths, lineStatusByLine]);

    const closeMapFullscreen = () => {
        if (!isFullscreen || isMapAnimating) return;
        const targetFrame = getElementFrame(mapSectionRef.current);
        if (!targetFrame) {
            setIsFullscreen(false);
            setFullscreenFrame(null);
            setMapPlaceholderHeight(0);
            return;
        }
        setIsMapAnimating(true);
        setFullscreenFrame(targetFrame);
        mapAnimationTimerRef.current = setTimeout(() => {
            setIsMapAnimating(false);
            setIsFullscreen(false);
            setFullscreenFrame(null);
            setMapPlaceholderHeight(0);
        }, MAP_FULLSCREEN_ANIMATION_MS);
    };

    const openMapFullscreen = () => {
        if (isFullscreen || isMapAnimating) return;
        const originFrame = getElementFrame(mapSectionRef.current);
        if (!originFrame) return;
        setMapPlaceholderHeight(originFrame.height);
        setFullscreenFrame(originFrame);
        setIsFullscreen(true);
        setIsMapAnimating(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setFullscreenFrame(getViewportFrame());
            });
        });
        mapAnimationTimerRef.current = setTimeout(() => {
            setIsMapAnimating(false);
        }, MAP_FULLSCREEN_ANIMATION_MS);
    };

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
                    onClick={closeMapFullscreen}
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
                <button
                    type="button"
                    className={styles.mapFullscreenBtn}
                    onClick={isFullscreen ? closeMapFullscreen : openMapFullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen map" : "Open fullscreen map"}
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    defaultCenter={defaultCenter}
                    defaultZoom={14}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{ disableDefaultUI: true }}
                >

                    {/* Ward Boundary */}
                    {wardBoundary.length > 0 && (
                        <Polyline
                            path={wardBoundary}
                            options={{
                                strokeColor: "#000000",
                                strokeWeight: 3,
                                strokeOpacity: 1,
                                zIndex: 2,
                            }}
                        />
                    )}

                    {/* 🟢 Ward Lines */}
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
                {/* 
                <div className={styles.mapFooter}>
                    <div className={styles.mapStat}>
                        <UsersIcon size={14} color="var(--themeColor)" />
                        <span>Heroes: <b>2</b></span>
                    </div>

                    <div className={styles.mapStat}>
                        <Truck size={14} color="var(--themeColor)" />
                        <span>Garage: <b>1</b></span>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default MapSection
