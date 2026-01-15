import { Offcanvas } from "react-bootstrap";
import { images } from "../../assets/css/imagePath";
import { FileUploadBox } from "./FileUploadBox";
import style from "../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import dayjs from "dayjs";

// import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import {
  getPrevousMapList,
  getSelectWardBoundaryAndLine,
  saveGeoJsonData,
  saveWardBoundaryGeojsonInDb,
  saveWardMapData,
  uploadWardBoundaryJson,
  uploadWardMapJson,
} from "../../Actions/City/wardMapAction";

const WardMapCanvas = (props) => {
 const mapRef = useRef(null);
   const handleCloseSettings = () => props.setOpenCanvas(false);
  const [wardMapGeoJsonData, setWardMapGeoJsonData] = useState(null);
  const [wardBoundaryGeoJsonData, setWardBoundaryGeoJsonData] = useState(null);
    const [isWardBoundaryMapPopupOpen, setIsWardBoundaryMapPopupOpen] = useState(false);
    const [isWardLinePopupOpen,setIsWardLinePopOpen]=useState(false)
  const [previoisMapList,setPreviousMapList]=useState([])
  const[HoldArray,setHoldArray]=useState([])

  const mapContainerStyle = {
  width: "100%",
  height: "320px",
};

const center = {
  lat: 26.901875,
  lng: 75.738869,
};

const fitToBoundsForBoundaryAndLines = () => {
  if (!mapRef.current) return;

  const bounds = new window.google.maps.LatLngBounds();

  // Boundary
  if (wardBoundaryGeoJsonData?.length) {
    wardBoundaryGeoJsonData.forEach((p) => {
      bounds.extend(new window.google.maps.LatLng(p.lat, p.lng));
    });
  }

  // Lines (multiple polylines)
  if (wardMapGeoJsonData?.length) {
    wardMapGeoJsonData.forEach((path) => {
      path.forEach((p) => {
        bounds.extend(new window.google.maps.LatLng(p.lat, p.lng));
      });
    });
  }

  if (!bounds.isEmpty()) {
    mapRef.current.fitBounds(bounds);
  }
};
useEffect(() => {
  fitToBoundsForBoundaryAndLines();
}, [wardBoundaryGeoJsonData, wardMapGeoJsonData]);



  const sectionStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "18px",
  };

  const titleStyle = {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#111827",
  };

  useEffect(()=>{
   getPrevousMapList(props.wardId,setPreviousMapList)
  },[])

  const handleGeoJsonUpload = async (event) => {
    const file = event.target.files[0];
    uploadWardBoundaryJson(
      file,
      setWardBoundaryGeoJsonData,
      setIsWardBoundaryMapPopupOpen,
      setHoldArray
    );
  };

  function handleWardGeoJsonUpload(event) {
    const file = event.target.files[0];
    uploadWardMapJson(
      file,
      setWardMapGeoJsonData,
      setIsWardLinePopOpen,
      setHoldArray,
      
    );
  }

  return (
    <Offcanvas
      placement="end"
      show={props.openCanvas}
      onHide={handleCloseSettings}
      style={{ width: "45%", background: "#f9fafb" }}
    >
      <div className={style.canvas_container}>
        <div className={style.OffcanvasHeader}>
          <h4 className={style.header_title}>Ward Settings</h4>
        </div>
        <div className={style.scroll_section}>
          <div className={style.canvas_header_end}>
            <img
              src={images.iconClose}
              className={style.close_popup}
              onClick={handleCloseSettings}
              alt="Close"
            />
          </div>
          <div>
            <div style={sectionStyle}>
              <div style={titleStyle}>Upload Ward Map</div>
              <FileUploadBox
                label="Upload Ward Map"
                handleGeoJsonUpload={handleWardGeoJsonUpload}
              />
            </div>
            <div style={sectionStyle}>
              <div style={titleStyle}>Upload Ward Boundary</div>
              <FileUploadBox
                label="Upload Ward Boundary"
                handleGeoJsonUpload={handleGeoJsonUpload}
              />
            </div>
       
{isWardBoundaryMapPopupOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        width: "700px",
        borderRadius: "10px",
        padding: "14px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        <span>Ward Map Preview</span>
        <span
          style={{ cursor: "pointer", fontSize: "18px" }}
          onClick={() => setIsWardBoundaryMapPopupOpen(false)}
        >
          ✕
        </span>
      </div>

      {/* MAP */}
  <GoogleMap
       onLoad={(map) => {
    mapRef.current = map;
    fitToBoundsForBoundaryAndLines();
  }}
      mapContainerStyle={{
        width: "100%",
        height: "360px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
      center={center} // dummy, fitBounds override karega
      zoom={13} // ignore hoga after fitBounds
    >
      {wardBoundaryGeoJsonData && (
        <Polygon
          paths={wardBoundaryGeoJsonData}
          options={{
            strokeColor: "#000",
            strokeWeight: 3,
            strokeOpacity: 1,
            fillOpacity: 0,
          }}
        />
      )}
    </GoogleMap>

      {/* Upload Button */}

      {HoldArray?.length !== 0 && (
       <div
  style={{
    marginTop: "12px",
    textAlign: "right",
  }}
>
  <label
    style={{
      display: "inline-block",
      padding: "8px 14px",
      backgroundColor: "#2563eb",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    }}
    onClick={() =>
      saveWardBoundaryGeojsonInDb(
        props.wardId,
        props.selectedCity,
        HoldArray,
        setHoldArray,
        setIsWardBoundaryMapPopupOpen
      )
    }
  >
    Upload GeoJSON
  </label>
</div>

)}

    </div>
  </div>
)}

{isWardLinePopupOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        width: "700px",
        borderRadius: "10px",
        padding: "14px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        <span>Ward Map Preview</span>
        <span
          style={{ cursor: "pointer", fontSize: "18px" }}
          onClick={() => setIsWardLinePopOpen(false)}
        >
          ✕
        </span>
      </div>

      {/* MAP */}
    <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={center}
    zoom={13}
       onLoad={(map) => {
    mapRef.current = map;
    fitToBoundsForBoundaryAndLines();
  }}
  >
   
   {wardBoundaryGeoJsonData && (
  <Polygon
    paths={wardBoundaryGeoJsonData}
    options={{
      strokeColor: "#000",
      strokeWeight: 3,
      strokeOpacity: 1,
      fillOpacity: 0,
    }}
  />
)}

 {wardMapGeoJsonData &&
  wardMapGeoJsonData.map((path, index) => (
    <Polyline
      key={index}
      path={path}
      options={{
        strokeColor: "#2563eb",
        strokeOpacity: 1,
        strokeWeight: 2,
      }}
    />
  ))}

  </GoogleMap>

    {HoldArray?.length !== 0 && (
      <div
        style={{
          marginTop: "12px",
          textAlign: "right",
        }}
     
      >
        <label
          style={{
            display: "inline-block",
            padding: "8px 14px",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
           onClick={()=>saveWardMapData(props.wardId,props.selectedCity,HoldArray,setHoldArray,setIsWardLinePopOpen,setPreviousMapList)}
        >
          Upload GeoJSON
         
        </label>
      </div>
    )}
    </div>
  </div>
)}

          {/* <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={center}
    zoom={13}
  >
   
   {wardBoundaryGeoJsonData && (
  <Polygon
    paths={wardBoundaryGeoJsonData}
    options={{
      strokeColor: "#000",
      strokeWeight: 3,
      strokeOpacity: 1,
      fillOpacity: 0,
    }}
  />
)}

 {wardMapGeoJsonData &&
  wardMapGeoJsonData.map((path, index) => (
    <Polyline
      key={index}
      path={path}
      options={{
        strokeColor: "#000",
        strokeOpacity: 1,
        strokeWeight: 2,
      }}
    />
  ))}

  </GoogleMap> */}
            <div style={sectionStyle}>
              <div style={titleStyle}>Uploaded Maps</div>
              <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" ,cursor:'pointer' }}>
     {previoisMapList
  ?.filter(item => item.map_updated_at) // undefined / null / empty remove
  .map(item => (
    <li
      key={item.id}
      style={{ marginBottom: "6px", cursor: "pointer" }}
      onClick={() =>
        getSelectWardBoundaryAndLine(
          props.wardId,
          props.selectedCity,
          item.map_updated_at,
          setWardBoundaryGeoJsonData,
          setWardMapGeoJsonData,
          setIsWardLinePopOpen
        )
      }
    >
      {dayjs(item.map_updated_at).format("DD-MM-YYYY")}
    </li>
  ))}

</ul>
            </div>
          </div>
        </div>
      </div>
    </Offcanvas>
  );
};

export default WardMapCanvas;
