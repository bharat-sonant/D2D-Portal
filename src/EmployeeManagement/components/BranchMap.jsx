import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import styles from './BranchMap.module.css';

const mapStyles = [
    {
        "featureType": "landscape",
        "stylers": [{ "hue": "#FFBB00" }, { "saturation": 43.4 }, { "lightness": 37.6 }, { "gamma": 1 }]
    },
    {
        "featureType": "road.highway",
        "stylers": [{ "hue": "#FFC200" }, { "saturation": -61.8 }, { "lightness": 45.6 }, { "gamma": 1 }]
    },
    {
        "featureType": "road.arterial",
        "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 51.2 }, { "gamma": 1 }]
    },
    {
        "featureType": "road.local",
        "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 52 }, { "gamma": 1 }]
    },
    {
        "featureType": "water",
        "stylers": [{ "hue": "#0078FF" }, { "saturation": -13.2 }, { "lightness": 2.4 }, { "gamma": 1 }]
    },
    {
        "featureType": "poi",
        "stylers": [{ "hue": "#00FF6A" }, { "saturation": -1.1 }, { "lightness": 11.2 }, { "gamma": 1 }]
    }
];

const BranchMap = ({ branchData, selectedBranch, setSelectedBranch, mapRef, setCenter, setMapRef, center }) => {
    const mapContainerStyle = {
        width: '100%',
        height: '100%',
    };

    const handleMarkerClick = (marker) => {
        if (mapRef) {
            setCenter({ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) });
            mapRef.panTo({ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) });
            mapRef.setZoom(12);
        }
        setSelectedBranch(marker.id);
    };

    return (
        <div className={styles.mapContainer}>
            <div className={styles.mapStyle}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={5}
                    center={center}
                    onLoad={(map) => {
                        if (typeof setMapRef === 'function') setMapRef(map);
                    }}
                    options={{
                        styles: mapStyles,
                        mapTypeControl: false,
                        zoomControl: true,
                        zoomControlOptions: { position: window.google?.maps?.ControlPosition?.LEFT_CENTER },
                        streetViewControl: false,
                        fullscreenControl: false,
                        scaleControl: false,
                    }}
                >
                    {branchData.filter(b => b && b.lat && b.lng).map((marker) => (
                        <Marker
                            key={marker.id}
                            position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
                            title={marker.name}
                            animation={window.google?.maps?.Animation && selectedBranch === marker.id ? window.google.maps.Animation.BOUNCE : null}
                            onClick={() => handleMarkerClick(marker)}
                        />
                    ))}
                </GoogleMap>
            </div>
        </div>
    );
};

export default BranchMap;
