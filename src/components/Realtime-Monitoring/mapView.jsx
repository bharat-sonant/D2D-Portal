import{ useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};
const center = {lat: 26.90309980897235,lng: 75.73592622394446};

const MapView = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: 'AIzaSyCRq4Btoz3fa9TDW9UUVpM6lhqDePs7JzM',
  });
  const [map, setMap] = useState(null);
  const onLoad = useCallback((mapInstance)=> {
    const bounds = new window.google.maps.LatLngBounds(center);
    mapInstance.fitBounds(bounds);
    setMap(mapInstance);
  }, []);
  const onUnmount = useCallback(()=>{
    setMap(null);
  }, []);

  if (loadError) return <p style={{ color: "red" }}>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #ddd" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Example marker at center */}
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default MapView;