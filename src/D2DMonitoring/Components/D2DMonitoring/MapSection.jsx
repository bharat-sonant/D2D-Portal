import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import { Maximize2, Minimize2 } from "lucide-react";
import axios from "axios";
import * as action from "../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import { getLineColorByStatus } from "../../Action/D2DMonitoring/Monitoring/MonitoringAction";
import { getWardBoundaryFromStorage, getWardLinesFromStorage } from "../../Services/WardsService/WardMapService";
import { calculateWardLineLengthInMeter } from "../../../common/common";

const CITY_DETAILS_URL =
    "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/CityDetails%2FCityDetails.json?alt=media";

let _cityDetailsCache = null;

const fetchCityDetails = async () => {
    if (_cityDetailsCache) return _cityDetailsCache;
    try {
        const res = await axios.get(CITY_DETAILS_URL);
        _cityDetailsCache = res.data || [];
    } catch {
        _cityDetailsCache = [];
    }
    return _cityDetailsCache;
};

const getCityStorageInfo = async (city) => {
    const cityDetails = await fetchCityDetails();
    const normalizedCity = city?.trim()?.toLowerCase();
    const detail = cityDetails.find(
        (item) =>
            item?.city?.toString()?.trim()?.toLowerCase() === normalizedCity ||
            item?.cityName?.toString()?.trim()?.toLowerCase() === normalizedCity
    );
    if (!detail) return null;
    return {
        cityName: detail.cityName,
        storagePath: detail.firebaseStoragePath ||
            `https://firebasestorage.googleapis.com/v0/b/${detail.storageBucket}/o/`,
    };
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

const MapSection = ({ city, selectedWard, onWardLengthResolved, lineStatusByLine = {}, focusLocation = null }) => {
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
    const mapContainerStyle = { width: "100%", height: "100%" };
    const defaultCenter = { lat: 27.625, lng: 75.13 };

    // Selected ward badlne par boundary + lines fetch karo
    useEffect(() => {
        if (!city || !selectedWard?.id) return;
        setBoundaryJson(null);
        setLinesGeoJson(null);

        getCityStorageInfo(city).then((info) => {
            console.log("MapSection city info:", info, "| wardId:", selectedWard.id);
            if (!info) { console.warn("MapSection: city not found in CityDetails"); return; }
            const { storagePath, cityName } = info;

            getWardBoundaryFromStorage(storagePath, cityName, selectedWard.id)
                .then((res) => {
                    console.log("Boundary response:", res);
                    if (res?.status === "Success") setBoundaryJson(res.data);
                });

            getWardLinesFromStorage(storagePath, cityName, selectedWard.id)
                .then((res) => {
                    console.log("Lines response:", res);
                    if (res?.status === "Success") setLinesGeoJson(res.data);
                });
        });
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
        () => calculateWardLineLengthInMeter(linesGeoJson),
        [linesGeoJson],
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
