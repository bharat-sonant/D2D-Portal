import React, { useEffect, useMemo, useRef } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { Truck, UsersIcon } from "lucide-react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
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

const MapSection = ({ selectedWard }) => {
    const mapRef = useRef(null);

    const mapContainerStyle = { width: "100%", height: "100%" };
    const defaultCenter = { lat: 27.625, lng: 75.13 };

    const selectedWardBoundary = wardBoundariesById[selectedWard?.id];
    const selectedWardLine = wardLinesById[selectedWard?.id];

    const wardBoundary = useMemo(() => {
        return action.getBoundaryPathFromWardBoundaryJson(selectedWardBoundary);
    }, [selectedWardBoundary]);

    // 🟢 Lines (agar custom JSON hai to custom function use karo)
    const selectedWardLinePaths = useMemo(() => {
        return action.getLinePathsFromGeoJson(selectedWardLine);
    }, [selectedWardLine]);

    useEffect(() => {
        const timer = setTimeout(() => {
            action.mapZoom(mapRef, selectedWardLinePaths, wardBoundary);
        }, 50);

        return () => clearTimeout(timer);
    }, [wardBoundary, selectedWardLinePaths]);

    return (
        <div className={styles.mapColumn}>
            <div className={`${styles.glassCard} ${styles.mapCard}`}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    defaultCenter={defaultCenter}
                    defaultZoom={14}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
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
                            options={{
                                strokeColor: "#00ff62",
                                strokeOpacity: 1,
                                strokeWeight: 1.5,
                                zIndex: 3,
                            }}
                        />
                    ))}

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
