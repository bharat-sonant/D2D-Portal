import React from 'react'
import WevoisLoader from '../Common/Loader/WevoisLoader';
import styles from '../../Style/Task-Data/TaskDataList.module.css'
import {images} from '../../assets/css/imagePath'

const WardMonitoringPanel = ({selectedWard, dutyInTime, dutyLoading}) => {
    if (!selectedWard) {
    return (
      <div className={`${styles.noUserData} ${styles.monitoringPanel}`}>
        Please select a ward
      </div>
    );
  }

  if (dutyLoading) {
    return <WevoisLoader title="Fetching duty time..." />;
  }

   if (!dutyInTime) {
    return (
      <div className={`${styles.noUserData}  ${styles.monitoringPanel}`}>
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
    <div className={`${styles.detailContainer} ${styles.monitoringPanel}`}>
      <h4 className={styles.detailTitle}>
        Ward: {selectedWard.name}
      </h4>

      <div className={styles.detailCard}>
        <span className={styles.label}>Duty In Time - </span>
        <span className={styles.value}>{dutyInTime}</span>
      </div>
    </div>
  )
}

export default WardMonitoringPanel
