import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import * as mapAction from "../../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import { subscribeLocationHistoryAction } from "../../../Action/D2DMonitoring/Monitoring/LocationHistoryAction";
import styles from "./VehicleTrackingMap.module.css";

const DEFAULT_CENTER = { lat: 27.625, lng: 75.13 };
const PATH_STYLE     = { strokeColor: "#16a34a", strokeOpacity: 0.9, strokeWeight: 4 };
const LABEL_STYLE    = { color: "#fff", fontWeight: "bold", fontSize: "11px" };

const VehicleTrackingMap = ({ selectedWard, city }) => {
    const mapRef    = useRef(null);
    const fittedRef = useRef(false);

    const [isGoogleReady, setIsGoogleReady] = useState(mapAction.isGoogleMapsReady());
    const [pathPoints, setPathPoints]       = useState([]);
    const [boundaryJson, setBoundaryJson]   = useState(null);

    useEffect(() => {
        if (isGoogleReady) return;
        return mapAction.waitForGoogleMapsReady(setIsGoogleReady);
    }, [isGoogleReady]);

    useEffect(() => {
        if (!city || !selectedWard?.id) return;
        setBoundaryJson(null);
        mapAction.fetchWardMapData(city, selectedWard.id, setBoundaryJson, () => {});
    }, [city, selectedWard?.id]);

    useEffect(() => {
        if (!selectedWard?.id) return;
        console.log("[VehicleTrackingMap] subscribing wardId:", selectedWard.id);
        fittedRef.current = false;
        setPathPoints([]);
        return subscribeLocationHistoryAction(selectedWard.id, (points) => {
            console.log("[VehicleTrackingMap] pathPoints received:", points.length);
            setPathPoints(points);
        });
    }, [selectedWard?.id]);

    useEffect(() => {
        if (fittedRef.current || !mapRef.current || pathPoints.length < 2 || !window.google?.maps) return;
        const bounds = new window.google.maps.LatLngBounds();
        pathPoints.forEach((p) => bounds.extend(p));
        mapRef.current.fitBounds(bounds, 40);
        fittedRef.current = true;
    }, [pathPoints]);

    const wardBoundary = useMemo(
        () => mapAction.getBoundaryPathFromWardBoundaryJson(boundaryJson),
        [boundaryJson]
    );

    if (!isGoogleReady) return null;

    const firstPoint = pathPoints[0] ?? null;
    const lastPoint  = pathPoints.length > 1 ? pathPoints[pathPoints.length - 1] : null;

    return (
        <div className={styles.root}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={15}
                onLoad={(map) => { mapRef.current = map; }}
                options={{ disableDefaultUI: true }}
            >
                {wardBoundary.length > 0 && (
                    <Polyline path={wardBoundary} options={mapAction.WARD_BOUNDARY_STYLE} />
                )}
                {pathPoints.length > 1 && (
                    <Polyline path={pathPoints} options={PATH_STYLE} />
                )}
                {firstPoint && (
                    <Marker position={firstPoint} title="Start" label={{ text: "S", ...LABEL_STYLE }} />
                )}
                {lastPoint && (
                    <Marker position={lastPoint} title="Current" label={{ text: "E", ...LABEL_STYLE }} />
                )}
            </GoogleMap>
        </div>
    );
};

export default VehicleTrackingMap;
