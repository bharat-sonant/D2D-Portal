import WevoisLoader from "../Common/Loader/WevoisLoader";
import styles from "../../assets/css/City/CityList.module.css";
import { images } from "../../assets/css/imagePath";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";

const WardMonitoringPanel = ({
  selectedWard,
  mapRef,
  dutySummary,
  dutyLoading,
  wardBoundaryGeoJsonData,
  boundryLoading,
  wardLineGeoJsonData,
  mapLoaded,
  setMapLoaded,
  hasPositioned,
  setHasPositioned
}) => {
  const fallbackCenter = { lat: 26.9124, lng: 75.7873 };
const fallbackZoom = 13;


useEffect(() => {
  if (!mapRef.current || !mapLoaded || hasPositioned || boundryLoading) return;

  // ✅ boundary exists
  if (wardBoundaryGeoJsonData?.length > 0) {
    const bounds = new window.google.maps.LatLngBounds();
    wardBoundaryGeoJsonData.forEach(p => bounds.extend(p));

    mapRef.current.fitBounds(bounds);
    setHasPositioned(true);
    return;
  }

  // ✅ TRUE fallback (confirmed no boundary)

  mapRef.current.setCenter(fallbackCenter);
  mapRef.current.setZoom(13);
  setHasPositioned(true);
}, [  selectedWard?.id,
  mapLoaded,
  boundryLoading,
  wardBoundaryGeoJsonData,
  hasPositioned,
]);



  if (!selectedWard) {
    return <div className={`${styles.noUserData}`}>Please select a ward</div>;
  }

  if (dutyLoading || boundryLoading) {
    return <WevoisLoader title="Fetching duty time..." />;
  }

  if (!dutySummary) {
    return (
      <div className={`${styles.noUserData}`}>
        <img
          src={images.noDAtaAvailable}
          className={styles.noUserImg}
          alt="No duty time"
        />
        No duty time data available for this ward.
      </div>
    );
  }

  return (
    <div className={styles.panelWrapper}>
      <div className={`${styles.detailContainer} ${styles.monitoringPanel}`}>
        <h4 className={styles.detailTitle}>
          Ward: {dutySummary?.ward_display_name}
        </h4>

        <div className={styles.maincard}>
          <div className={styles.detailCard}>
            <span className={styles.label}>Duty In Time </span>
            <span className={styles.value}>
              {dutySummary?.duty_on_time || "N/A"}
            </span>
          </div>

          <div className={styles.detailCard}>
            <span className={styles.label}>Duty Off Time </span>
            <span className={styles.value}>
              {dutySummary?.duty_off_time || "N/A"}
            </span>
          </div>
        </div>

        <div className={`${styles.detailCard} ${styles.fullWidth}`}>
          <span className={styles.label}>Ward Reach on Time </span>
          <span className={styles.value}>
            {dutySummary?.ward_reach_time || "N/A"}
          </span>
        </div>

        <div className={styles.maincard}>
          <div className={styles.detailCard}>
            <span className={styles.label}>Driver Name </span>
            <span className={styles.value}>
              {dutySummary?.driver_name || "N/A"}
            </span>
          </div>

          <div className={styles.detailCard}>
            <span className={styles.label}>Helper Name </span>
            <span className={styles.value}>
              {dutySummary?.helper_name || "N/A"}
            </span>
          </div>
        </div>
      </div>
      {/* ===== MAP SECTION ===== */}
      <div className={styles.mapContainer}>
        <GoogleMap
          key={selectedWard?.id}
          center={fallbackCenter}
          zoom={fallbackZoom}
          onLoad={(map) => {
            mapRef.current = map;
            setHasPositioned(false);
            setMapLoaded(true);
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }}

        >
          {wardBoundaryGeoJsonData?.length > 0 && (
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

          {wardLineGeoJsonData?.map((path, index) => (
            <Polyline
              key={index}
              path={path}
              options={{
                strokeColor: "#0000FF",
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default WardMonitoringPanel;