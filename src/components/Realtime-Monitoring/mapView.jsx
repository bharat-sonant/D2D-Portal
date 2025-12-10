import {APIProvider,Map,AdvancedMarker} from "@vis.gl/react-google-maps";

const center = {lat: 26.90309980897235,lng: 75.73592622394446};

const MapView = ({zoom = 12,height = "400px",showMarker = true,markerTitle = "Selected location"}) => {
  const apiKey = 'AIzaSyCRq4Btoz3fa9TDW9UUVpM6lhqDePs7JzM';
  const mapId = "google-map-script";

  return (
     <div style={{width: "100%",height,borderRadius: 10,overflow: "hidden",border: "1px solid #e0e0e0"}}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId={mapId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: "100%", height: "100%" }}
        >
          {showMarker && (
            <AdvancedMarker position={center} title={markerTitle} />
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapView;