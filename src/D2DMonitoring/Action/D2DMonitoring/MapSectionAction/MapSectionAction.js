import { calculateWardLineLengthInMeter } from "../../../../common/common";

const toLatLngFromGeo = ([lng, lat]) => ({ lat: Number(lat), lng: Number(lng) });
const toLatLngFromCustom = ([lat, lng]) => ({ lat: Number(lat), lng: Number(lng) });
const toKey = (point, precision = 6) => `${Number(point.lat).toFixed(precision)},${Number(point.lng).toFixed(precision)}`;

const closePath = (path = []) => {
    if (!path.length) return path;
    const first = path[0];
    const last = path[path.length - 1];
    if (toKey(first) !== toKey(last)) {
        return [...path, first];
    }
    return path;
};

const dedupeConsecutive = (path = []) => {
    const out = [];
    path.forEach((point) => {
        if (!out.length || toKey(out[out.length - 1]) !== toKey(point)) {
            out.push(point);
        }
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

export const getLinePathsFromGeoJson = (geoJson) => {
    if (!geoJson?.features?.length) return [];

    return geoJson.features.flatMap((feature) => {
        const geometry = feature?.geometry;
        if (!geometry) return [];

        if (geometry.type === "LineString") {
            return [geometry.coordinates.map(toLatLngFromGeo)];
        }

        if (geometry.type === "MultiLineString") {
            return geometry.coordinates.map((line = []) => line.map(toLatLngFromGeo));
        }

        return [];
    });
};

export const getBoundaryPathFromWardBoundaryJson = (boundaryJson) => {
    if (!boundaryJson) return [];
    return getBoundaryFromCustomBoundaryJson(boundaryJson);
};

export const isGoogleMapsReady = () => Boolean(window.google?.maps);

export const waitForGoogleMapsReady = (onReady, interval = 100) => {
    if (isGoogleMapsReady()) {
        onReady(true);
        return null;
    }

    const intervalId = setInterval(() => {
        if (isGoogleMapsReady()) {
            onReady(true);
            clearInterval(intervalId);
        }
    }, interval);

    return () => clearInterval(intervalId);
};

export const getSelectedWardMapData = ({ wardId, wardBoundariesById, wardLinesById }) => {
    const selectedWardBoundary = wardBoundariesById[wardId];
    const selectedWardLine = wardLinesById[wardId];
    const selectedWardLengthInMeter = calculateWardLineLengthInMeter(selectedWardLine);

    return {
        wardBoundary: getBoundaryPathFromWardBoundaryJson(selectedWardBoundary),
        selectedWardLinePaths: getLinePathsFromGeoJson(selectedWardLine),
        selectedWardLengthInMeter,
    };
};

export const scheduleMapZoom = (mapRef, linePaths, boundaryPath, delay = 50) => {
    const timer = setTimeout(() => {
        mapZoom(mapRef, linePaths, boundaryPath);
    }, delay);

    return () => clearTimeout(timer);
};

export const mapZoom = (mapRef, linePaths, boundaryPath) => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = mapRef.current;
    const paths = boundaryPath?.length ? [boundaryPath] : linePaths;

    if (!paths?.length) return;

    const bounds = new window.google.maps.LatLngBounds();

    paths.forEach((path) => {
        path.forEach((point) => {
            if (
                Number.isFinite(point?.lat) &&
                Number.isFinite(point?.lng)
            ) {
                bounds.extend(point);
            }
        });
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
    }
};
