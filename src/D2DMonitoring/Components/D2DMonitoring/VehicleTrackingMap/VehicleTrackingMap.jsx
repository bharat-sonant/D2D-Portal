import { useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import styles from "./VehicleTrackingMap.module.css";

const VehicleTrackingMap = () => {
    const mapRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyB9KvPlqKdCqq-KJIq0yHfSS8x1Ys18JSM",
    });

    if (!isLoaded) return null;

    return (
        <div className={styles.root}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={{ lat: 27.625, lng: 75.13 }}
                zoom={14}
                onLoad={(map) => { mapRef.current = map; }}
                options={{ disableDefaultUI: true }}
            />
        </div>
    );
};

export default VehicleTrackingMap;
