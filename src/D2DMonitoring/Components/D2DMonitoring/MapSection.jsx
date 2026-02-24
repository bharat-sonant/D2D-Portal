import { useEffect, useMemo, useRef } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { Truck, UsersIcon } from "lucide-react";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import ShiftStatusSection from "./ShiftStatusSection";
import ward1Boundary from "../../../assets/Sikar/WardBoundaries/1.json";
import ward2Boundary from "../../../assets/Sikar/WardBoundaries/2.json";
import ward3Boundary from "../../../assets/Sikar/WardBoundaries/3.json";
import ward4Boundary from "../../../assets/Sikar/WardBoundaries/4.json";
import ward5Boundary from "../../../assets/Sikar/WardBoundaries/5.json";

const wardBoundariesById = {
    1: ward1Boundary,
    2: ward2Boundary,
    3: ward3Boundary,
    4: ward4Boundary,
    5: ward5Boundary,
};

const getPolygonPathsFromGeoJson = (geoJson) => {
    if (!geoJson?.features?.length) return [];

    return geoJson.features.flatMap((feature) => {
        const geometry = feature?.geometry;
        if (!geometry) return [];

        if (geometry.type === "Polygon") {
            return geometry.coordinates.map((ring = []) =>
                ring.map(([lng, lat]) => ({ lat, lng }))
            );
        }

        if (geometry.type === "MultiPolygon") {
            return geometry.coordinates.flatMap((polygon = []) =>
                polygon.map((ring = []) => ring.map(([lng, lat]) => ({ lat, lng })))
            );
        }

        return [];
    });
};

const MapSection = ({ selectedWard }) => {
    const mapRef = useRef(null);
    const mapContainerStyle = { width: "100%", height: "100%" };
    const center = { lat: 27.625, lng: 75.13 };
    const selectedWardBoundary = wardBoundariesById[selectedWard?.id];

    const selectedWardPaths = useMemo(
        () => getPolygonPathsFromGeoJson(selectedWardBoundary),
        [selectedWardBoundary]
    );

    useEffect(() => {
        if (!mapRef.current || !selectedWardPaths.length || !window.google?.maps) return;

        const bounds = new window.google.maps.LatLngBounds();
        selectedWardPaths.forEach((ring) => {
            ring.forEach((point) => bounds.extend(point));
        });

        if (!bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds);
        }
    }, [selectedWardPaths]);

    const currentShiftEvents = [
        { key: "dutyOn", label: "Duty On", time: "08:00 AM", status: "completed" },
        { key: "reachOn", label: "Reached", time: "09:00 AM", status: "completed" },
        { key: "workStatus", label: "Working", time: "Live", status: "active", isLive: true },
        { key: "dutyOff", label: "Off", time: "--:--", status: "pending" },
    ];

    return (
        <div className={styles.mapColumn}>
            <div className={`${styles.glassCard} ${styles.mapCard}`}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={14}
                    onLoad={(map) => (mapRef.current = map)}
                    options={{ disableDefaultUI: true }}
                >
                    {selectedWardPaths.map((path, index) => (
                        <Polygon
                            key={`${selectedWard?.id || "ward"}-${index}`}
                            paths={path}
                            options={{
                                strokeColor: "#000000",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                fillColor: "#ffffff",
                                zIndex: 2,
                            }}
                        />
                    ))}
                </GoogleMap>
                <div className={styles.mapFooter}>
                    <div className={styles.mapStat}><UsersIcon size={14} color="var(--themeColor)" /> <span>Heroes: <b>2</b></span></div>
                    <div className={styles.mapStat}><Truck size={14} color="var(--themeColor)" /> <span>Garage: <b>1</b></span></div>
                </div>
            </div>
            <ShiftStatusSection events={currentShiftEvents} activeConnectorIndex={1} />
        </div>
    )
}

export default MapSection
