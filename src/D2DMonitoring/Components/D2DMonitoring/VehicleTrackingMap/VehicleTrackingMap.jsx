import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { subscribeVehicleLocationAction } from "../../../Action/D2DMonitoring/Monitoring/VehicleLocationAction";
import * as mapAction from "../../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import styles from "./VehicleTrackingMap.module.css";

const DEFAULT_CENTER = { lat: 27.625, lng: 75.13 };

const VehicleTrackingMap = ({ selectedWard }) => {
    const mapRef = useRef(null);
    const [isGoogleReady, setIsGoogleReady] = useState(mapAction.isGoogleMapsReady());
    const [vehicleLocation, setVehicleLocation] = useState(null);

    useEffect(() => {
        if (isGoogleReady) return;
        return mapAction.waitForGoogleMapsReady(setIsGoogleReady);
    }, [isGoogleReady]);

    useEffect(() => {
        if (!selectedWard?.id) return;
        console.log("[VehicleTrackingMap] subscribing wardId:", selectedWard.id);
        return subscribeVehicleLocationAction(selectedWard.id, (loc) => {
            console.log("[VehicleTrackingMap] location received:", loc);
            setVehicleLocation(loc);
        });
    }, [selectedWard?.id]);

    useEffect(() => {
        if (!mapRef.current || !vehicleLocation) return;
        mapRef.current.panTo(vehicleLocation);
    }, [vehicleLocation]);

    if (!isGoogleReady) return null;

    const center = vehicleLocation ?? DEFAULT_CENTER;

    return (
        <div className={styles.root}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={15}
                onLoad={(map) => { mapRef.current = map; }}
                options={{ disableDefaultUI: true }}
            >
                {vehicleLocation && (
                    <Marker position={vehicleLocation} />
                )}
            </GoogleMap>
        </div>
    );
};

export default VehicleTrackingMap;
