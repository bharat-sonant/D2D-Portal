import { FileUploadBox } from "./FileUploadBox";
import styles from "./WardMapCanvas.module.css";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import dayjs from "dayjs";

import { useEffect, useRef, useState } from "react";
import {
  getPrevousMapList,
  getSelectWardBoundaryAndLine,
  uploadWardBoundaryJson,
  uploadWardMapJson,
} from "../../Actions/City/wardMapAction";

const WardMapCanvas = (props) => {
  const mapRef = useRef(null);
  const [wardMapGeoJsonData, setWardMapGeoJsonData] = useState(null);
  const [wardBoundaryGeoJsonData, setWardBoundaryGeoJsonData] = useState(null);

  const [previoisMapList, setPreviousMapList] = useState([]);
  const [HoldArray, setHoldArray] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const syncWardBoundaryGeoJsonData = (data) => {
    setWardBoundaryGeoJsonData(data);
    props.setWardBoundaryGeoJsonData?.(data);
  };

  const syncWardMapGeoJsonData = (data) => {
    setWardMapGeoJsonData(data);
    props.setWardMapGeoJsonData?.(data);
  };

  const syncHoldArray = (data) => {
    setHoldArray(data);
    props.setHoldArray?.(data);
  };

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

  useEffect(() => {
    getSelectWardBoundaryAndLine(
      props.wardId,
      props.selectedCity,
      null,
      syncWardBoundaryGeoJsonData,
      syncWardMapGeoJsonData,
      previoisMapList,
      setSelectedDate,
    );
  }, [previoisMapList]);

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

  useEffect(() => {
    getPrevousMapList(props.wardId, setPreviousMapList);
  }, []);

  const handleGeoJsonUpload = async (event) => {
    const file = event.target.files[0];
    uploadWardBoundaryJson(
      file,
      syncWardBoundaryGeoJsonData,
      props.setIsWardBoundaryMapPopupOpen,
      syncHoldArray,
    );
  };

  function handleWardGeoJsonUpload(event) {
    const file = event.target.files[0];
    uploadWardMapJson(
      file,
      syncWardMapGeoJsonData,
      props.setIsWardLinePopOpen,
      syncHoldArray,
    );
  }

  return (
    //     <div className={style.canvas_header_end}>
    //   <img
    //     src={images.iconClose}
    //     className={style.close_popup}
    //     onClick={handleCloseSettings}
    //     alt="Close"
    //   />
    // </div>
    <>
      <div className={styles.wardCard}>
        <div className={styles.labelText}>Upload Ward Map</div>
        <FileUploadBox
          // label="Upload Ward Map"
          // handleGeoJsonUpload={handleWardGeoJsonUpload}
          id="wardMapUpload"
          label="Upload Ward Map"
          onChange={handleWardGeoJsonUpload}
        />
      </div>
      <div className={styles.wardCard}>
        <div className={styles.labelText}>Upload Ward Boundary</div>
        <FileUploadBox
          // label="Upload Ward Boundary"
          // handleGeoJsonUpload={handleGeoJsonUpload}
          id="wardBoundaryUpload"
          label="Upload Ward Boundary"
          onChange={handleGeoJsonUpload}
        />
      </div>


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

      <div className={styles.wardCard}>
        <div style={titleStyle}>Uploaded Maps</div>
        <ul
          style={{
            paddingLeft: "16px",
            margin: 0,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          {previoisMapList
            ?.filter((item) => item.map_updated_at)
            .map((item) => {
              const isSelected = item.map_updated_at === selectedDate;

              return (
                <li
                  key={item.id}
                  onClick={() => {
                    setSelectedDate(item.map_updated_at);
                    getSelectWardBoundaryAndLine(
                      props.wardId,
                      props.selectedCity,
                      item.map_updated_at,
                      syncWardBoundaryGeoJsonData,
                      syncWardMapGeoJsonData,
                      [],
                      setSelectedDate,
                    );
                  }}
                  style={{
                    marginBottom: "6px",
                    cursor: "pointer",
                    color: isSelected ? "#0d6efd" : "#000", // blue if selected
                    fontWeight: isSelected ? "600" : "400",
                  }}
                >
                  {dayjs(item.map_updated_at).format("DD-MM-YYYY")}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default WardMapCanvas;
