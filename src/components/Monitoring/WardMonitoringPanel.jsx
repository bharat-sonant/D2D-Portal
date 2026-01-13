import WevoisLoader from '../Common/Loader/WevoisLoader';
import styles from '../../assets/css/City/CityList.module.css'
import {images} from '../../assets/css/imagePath'
import { useEffect, useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';

const WardMonitoringPanel = ({selectedWard, dutySummary, dutyLoading}) => {
  const mapRef = useRef();
  const center = {
        lat: 26.9124,
        lng: 75.7873,
    };

    if (!selectedWard) {
    return (
      <div className={`${styles.noUserData}`}>
        Please select a ward
      </div>
    );
  }

  if (dutyLoading) {
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
        <span className={styles.value}>{dutySummary?.duty_on_time || "N/A"}</span>
      </div>

      <div className={styles.detailCard}>
        <span className={styles.label}>Duty Off Time </span>
        <span className={styles.value}>{dutySummary?.duty_off_time || "N/A"}</span>
      </div>
      </div>

      <div className={`${styles.detailCard} ${styles.fullWidth}`}>
        <span className={styles.label}>Ward Reach on Time </span>
        <span className={styles.value}>{dutySummary?.ward_reach_time || "N/A"}</span>
      </div>

     <div className={styles.maincard}>
       <div className={styles.detailCard}>
        <span className={styles.label}>Driver Name </span>
        <span className={styles.value}>{dutySummary?.driver_name || "N/A"}</span>
      </div>

      <div className={styles.detailCard}>
        <span className={styles.label}>Helper Name </span>
        <span className={styles.value}>{dutySummary?.helper_name || "N/A"}</span>
      </div>
     </div>
    </div>

     {/* ===== MAP SECTION ===== */}
      <div className={styles.mapContainer}>
       <GoogleMap
                                    onLoad={(map) => (mapRef.current = map)}
                                    center={center}
                                    zoom={18}
                                    mapContainerStyle={{ width: "100%", height: "100%" }}
                                >
                                </GoogleMap>
      </div>
   </div>

  )
}

export default WardMonitoringPanel
