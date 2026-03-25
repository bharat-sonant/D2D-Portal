import axios from "axios";
import { calculateWardLineLengthInMeter } from "../../../../common/common";
import { getWardBoundaryFromStorage, getWardLinesFromStorage } from "../../../Services/WardsService/WardMapService";
import { getLineColorByStatus } from "../Monitoring/MonitoringAction";

// ─── Constants ────────────────────────────────────────────────────────────────

const CITY_DETAILS_URL =
    "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/CityDetails%2FCityDetails.json?alt=media";

export const MAP_FULLSCREEN_GAP = 10;
export const MAP_FULLSCREEN_ANIMATION_MS = 320;

export const DEFAULT_LINE_STYLE = {
    strokeColor: "#79c0f0",
    strokeOpacity: 1,
    strokeWeight: 2,
    zIndex: 3,
};

export const WARD_BOUNDARY_STYLE = {
    strokeColor: "#000000",
    strokeWeight: 3,
    strokeOpacity: 1,
    zIndex: 2,
};

// ─── City Details Cache ───────────────────────────────────────────────────────

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

export const getCityStorageInfo = async (city) => {
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

// ─── Ward Map Data Cache (session-level) ─────────────────────────────────────
// Avoids re-fetching even across component remounts for the same city+ward

const _wardMapDataCache = new Map(); // key: "city__wardId" → { boundaryJson, linesGeoJson }

// ─── Ward Map Data Fetch ──────────────────────────────────────────────────────

export const fetchWardMapData = (city, wardId, setBoundaryJson, setLinesGeoJson) => {
    const cacheKey = `${city}__${wardId}`;

    // Serve from action-level cache instantly — no promise overhead
    if (_wardMapDataCache.has(cacheKey)) {
        const cached = _wardMapDataCache.get(cacheKey);
        if (cached.boundaryJson) setBoundaryJson(cached.boundaryJson);
        if (cached.linesGeoJson) setLinesGeoJson(cached.linesGeoJson);
        return;
    }

    getCityStorageInfo(city).then((info) => {
        if (!info) return;
        const { storagePath, cityName } = info;
        const entry = _wardMapDataCache.get(cacheKey) || {};

        getWardBoundaryFromStorage(storagePath, cityName, wardId)
            .then((res) => {
                if (res?.status === "Success") {
                    entry.boundaryJson = res.data;
                    _wardMapDataCache.set(cacheKey, entry);
                    setBoundaryJson(res.data);
                }
            });

        getWardLinesFromStorage(cityName, wardId)
            .then((res) => {
                if (res?.status === "Success") {
                    entry.linesGeoJson = res.data;
                    _wardMapDataCache.set(cacheKey, entry);
                    setLinesGeoJson(res.data);
                }
            });
    });
};

/**
 * Background prefetch — fills cache for all wards silently.
 * Call once after ward list loads; subsequent getWardLinesFromStorage calls return instantly.
 */
const _prefetchedCities = new Set(); // skip re-prefetch per session

export const prefetchAllWardLines = async (city, wardList = [], onWardLinesReady = null) => {
    if (!city || !wardList.length) return;

    // Already prefetched for this city in this session — skip
    if (_prefetchedCities.has(city)) {
        // Still fire callbacks with cached data
        if (typeof onWardLinesReady === "function") {
            wardList.forEach((ward) => {
                const cached = _wardMapDataCache.get(`${city}__${ward.id}`);
                if (cached?.linesGeoJson) onWardLinesReady(ward.id, cached.linesGeoJson);
            });
        }
        return;
    }
    _prefetchedCities.add(city);
    
    try {
        const info = await getCityStorageInfo(city);
        if (!info) return;
        const { cityName } = info;
        
        const { storagePath } = info;
        const batchSize = 10;
        for (let i = 0; i < wardList.length; i += batchSize) {
            const batch = wardList.slice(i, i + batchSize);
            await Promise.all(
                batch.map(async (ward) => {
                    if (!ward?.id) return;
                    const cacheKey = `${city}__${ward.id}`;
                    const entry = _wardMapDataCache.get(cacheKey) || {};
                    try {
                        const [linesRes, boundaryRes] = await Promise.all([
                            getWardLinesFromStorage(cityName, ward.id),
                            getWardBoundaryFromStorage(storagePath, cityName, ward.id),
                        ]);
                        if (linesRes?.status === "Success") {
                            entry.linesGeoJson = linesRes.data;
                            if (typeof onWardLinesReady === "function") onWardLinesReady(ward.id, linesRes.data);
                        }
                        if (boundaryRes?.status === "Success") {
                            entry.boundaryJson = boundaryRes.data;
                        }
                        _wardMapDataCache.set(cacheKey, entry);
                    } catch (err) {
                        console.warn("Error prefetching ward data", err);
                    }
                })
            );
        }
    } catch (e) {
        console.error("Error in prefetchAllWardLines", e);
    }
};

// ─── GeoJSON / Boundary Parsers ───────────────────────────────────────────────

const toLatLngFromGeo = ([lng, lat]) => ({ lat: Number(lat), lng: Number(lng) });
const toLatLngFromCustom = ([lat, lng]) => ({ lat: Number(lat), lng: Number(lng) });
const toKey = (point, precision = 6) => `${Number(point.lat).toFixed(precision)},${Number(point.lng).toFixed(precision)}`;

const closePath = (path = []) => {
    if (!path.length) return path;
    const first = path[0];
    const last = path[path.length - 1];
    if (toKey(first) !== toKey(last)) return [...path, first];
    return path;
};

const dedupeConsecutive = (path = []) => {
    const out = [];
    path.forEach((point) => {
        if (!out.length || toKey(out[out.length - 1]) !== toKey(point)) out.push(point);
    });
    return out;
};

const getBoundaryFromCustomBoundaryJson = (boundaryJson) => {
    if (Array.isArray(boundaryJson?.points) && boundaryJson.points.length > 1) {
        const path = dedupeConsecutive(boundaryJson.points.map(toLatLngFromCustom));
        return closePath(path);
    }
    return [];
};

export const getBoundaryPathFromWardBoundaryJson = (boundaryJson) => {
    if (!boundaryJson) return [];
    return getBoundaryFromCustomBoundaryJson(boundaryJson);
};

export const getLinePathsFromGeoJson = (geoJson) => {
    if (!geoJson) return [];

    // Custom format: { "1": { points: [[lat,lng],...] }, ... }
    if (typeof geoJson === "object" && !Array.isArray(geoJson) && !geoJson.type) {
        const numericKeys = Object.keys(geoJson).filter((key) => !isNaN(key));
        if (numericKeys.length > 0) {
            return numericKeys
                .map((key) => geoJson[key]?.points)
                .filter((points) => Array.isArray(points) && points.length > 1)
                .map((points) => points.map(([lat, lng]) => ({ lat: Number(lat), lng: Number(lng) })));
        }
    }

    // GeoJSON FeatureCollection
    if (!geoJson?.features?.length) return [];
    return geoJson.features.flatMap((feature) => {
        const geometry = feature?.geometry;
        if (!geometry) return [];
        if (geometry.type === "LineString") return [geometry.coordinates.map(toLatLngFromGeo)];
        if (geometry.type === "MultiLineString") return geometry.coordinates.map((line = []) => line.map(toLatLngFromGeo));
        return [];
    });
};

export const getWardLengthInMeter = (linesGeoJson) => calculateWardLineLengthInMeter(linesGeoJson);

export const getLineOptionsForPaths = (linePaths, lineStatusByLine) => {
    return linePaths.map((_, index) => {
        const lineId = String(index + 1);
        const strokeColor = getLineColorByStatus(lineStatusByLine[lineId], DEFAULT_LINE_STYLE);
        return {
            ...DEFAULT_LINE_STYLE,
            strokeColor,
        };
    });
};

// ─── Google Maps Helpers ──────────────────────────────────────────────────────

export const isGoogleMapsReady = () => Boolean(window.google?.maps);

export const waitForGoogleMapsReady = (onReady, interval = 100) => {
    if (isGoogleMapsReady()) { onReady(true); return null; }
    const intervalId = setInterval(() => {
        if (isGoogleMapsReady()) { onReady(true); clearInterval(intervalId); }
    }, interval);
    return () => clearInterval(intervalId);
};

export const scheduleMapZoom = (mapRef, linePaths, boundaryPath, delay = 50) => {
    const timer = setTimeout(() => mapZoom(mapRef, linePaths, boundaryPath), delay);
    return () => clearTimeout(timer);
};

export const mapZoom = (mapRef, linePaths, boundaryPath) => {
    if (!mapRef.current || !window.google?.maps) return;
    const paths = boundaryPath?.length ? [boundaryPath] : linePaths;
    if (!paths?.length) return;
    const bounds = new window.google.maps.LatLngBounds();
    paths.forEach((path) => {
        path.forEach((point) => {
            if (Number.isFinite(point?.lat) && Number.isFinite(point?.lng)) bounds.extend(point);
        });
    });
    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
};

export const focusOnLocation = (mapRef, focusLocation) => {
    if (!mapRef.current) return;
    if (!Number.isFinite(focusLocation?.lat) || !Number.isFinite(focusLocation?.lng)) return;
    mapRef.current.panTo({ lat: Number(focusLocation.lat), lng: Number(focusLocation.lng) });
    mapRef.current.setZoom(16);
};

export const triggerMapResize = (mapRef) => {
    if (!window.google?.maps?.event || !mapRef.current) return;
    window.google.maps.event.trigger(mapRef.current, "resize");
};

// ─── Fullscreen Helpers ───────────────────────────────────────────────────────

export const getViewportFrame = () => ({
    top: MAP_FULLSCREEN_GAP,
    left: MAP_FULLSCREEN_GAP,
    width: Math.max(window.innerWidth - MAP_FULLSCREEN_GAP * 2, 320),
    height: Math.max(window.innerHeight - MAP_FULLSCREEN_GAP * 2, 220),
});

export const getElementFrame = (element) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
};

export const lockBodyScroll = () => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
};

export const registerEscapeHandler = (mapSectionRef, mapAnimationTimerRef, setters) => {
    const { setIsMapAnimating, setIsFullscreen, setFullscreenFrame, setMapPlaceholderHeight } = setters;
    const onEscPress = (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        setIsMapAnimating(true);
        const targetFrame = getElementFrame(mapSectionRef.current);
        if (targetFrame) setFullscreenFrame(targetFrame);
        mapAnimationTimerRef.current = setTimeout(() => {
            setIsMapAnimating(false);
            setIsFullscreen(false);
            setFullscreenFrame(null);
            setMapPlaceholderHeight(0);
        }, MAP_FULLSCREEN_ANIMATION_MS);
    };
    window.addEventListener("keydown", onEscPress);
    return () => window.removeEventListener("keydown", onEscPress);
};

export const registerResizeHandler = (setFullscreenFrame) => {
    const onWindowResize = () => setFullscreenFrame(getViewportFrame());
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
};

export const openFullscreen = (mapSectionRef, mapAnimationTimerRef, setters) => {
    const { setMapPlaceholderHeight, setFullscreenFrame, setIsFullscreen, setIsMapAnimating } = setters;
    const originFrame = getElementFrame(mapSectionRef.current);
    if (!originFrame) return;
    setMapPlaceholderHeight(originFrame.height);
    setFullscreenFrame(originFrame);
    setIsFullscreen(true);
    setIsMapAnimating(true);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => setFullscreenFrame(getViewportFrame()));
    });
    mapAnimationTimerRef.current = setTimeout(() => setIsMapAnimating(false), MAP_FULLSCREEN_ANIMATION_MS);
};

export const closeFullscreen = (mapSectionRef, mapAnimationTimerRef, setters) => {
    const { setIsMapAnimating, setIsFullscreen, setFullscreenFrame, setMapPlaceholderHeight } = setters;
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
