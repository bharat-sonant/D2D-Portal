import { Offcanvas } from "react-bootstrap";
import { images } from "../../assets/css/imagePath";
import { FileUploadBox } from "./FileUploadBox";
import style from "../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import dayjs from "dayjs";

// import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  getPrevousMapList,
  getSelectWardBoundaryAndLine,
  saveGeoJsonData,
  uploadWardBoundaryJson,
  uploadWardMapJson,
} from "../../Actions/City/wardMapAction";

const WardMapCanvas = (props) => {

  const mapContainerStyle = {
  width: "100%",
  height: "320px",
};

const center = {
  lat: 27.36,
  lng: 75.56,
};


  const handleCloseSettings = () => props.setOpenCanvas(false);
  const [wardMapGeoJsonData, setWardMapGeoJsonData] = useState(null);
  const [wardBoundaryGeoJsonData, setWardBoundaryGeoJsonData] = useState(null);
    const [isWardBoundaryMapPopupOpen, setIsWardBoundaryMapPopupOpen] = useState(false);
    const [isWardLinePopupOpen,setIsWardLinePopOpen]=useState(false)
  const [previoisMapList,setPreviousMapList]=useState([])
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
      props.wardId,
      props.selectedCity,
      setWardBoundaryGeoJsonData,
      setIsWardBoundaryMapPopupOpen
    );
  };

  function handleWardGeoJsonUpload(event) {
    const file = event.target.files[0];
    uploadWardMapJson(
      file,
      props.wardId,
      props.selectedCity,
      setWardMapGeoJsonData,
      setIsWardLinePopOpen
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
          <h4 className={style.header_title}>City Settings</h4>
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
        <span>Ward Boundary Preview</span>
        <span
          style={{ cursor: "pointer", fontSize: "18px" }}
          onClick={() => setIsWardBoundaryMapPopupOpen(false)}
        >
          ✕
        </span>
      </div>

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "360px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
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
      </GoogleMap>

      {/* Upload Button */}
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
        >
          Upload GeoJSON
          <input
            type="file"
            accept=".json,.geojson"
            style={{ display: "none" }}
          />
        </label>
      </div>
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
        <span>Ward Boundary Preview</span>
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

  </GoogleMap>

      {/* Upload Button */}
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
        >
          Upload GeoJSON
          <input
            type="file"
            accept=".json,.geojson"
            style={{ display: "none" }}
          />
        </label>
      </div>
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
              <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
  {previoisMapList.map(item => (
    <li key={item.id} style={{ marginBottom: "6px" }} onClick={()=>getSelectWardBoundaryAndLine(props.wardId,props.selectedCity,item.map_updated_at,setWardBoundaryGeoJsonData,setWardMapGeoJsonData,setIsWardLinePopOpen)}>
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
