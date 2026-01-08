import React from 'react'
import WevoisLoader from '../Common/Loader/WevoisLoader';
import styles from '../../assets/css/City/CityList.module.css'
import {images} from '../../assets/css/imagePath'

const WardMonitoringPanel = ({selectedWard, dutySummary, dutyLoading}) => {

  const wardReachTimes = dutySummary?.wardReachedOn ? dutySummary.wardReachedOn.split(',').map(t => t.trim()) : [];

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
    <div className={`${styles.detailContainer} ${styles.monitoringPanel}`}>
      <h4 className={styles.detailTitle}>
        Ward: {selectedWard.name}
      </h4>

      <div className={styles.maincard}>
        <div className={styles.detailCard}>
        <span className={styles.label}>Duty In Time </span>
        <span className={styles.value}>{dutySummary?.dutyInTime || "N/A"}</span>
      </div>

      <div className={styles.detailCard}>
        <span className={styles.label}>Duty Off Time </span>
        <span className={styles.value}>{dutySummary?.dutyOutTime || "N/A"}</span>
      </div>
      </div>

      <div className={`${styles.detailCard} ${styles.fullWidth}`}>
        <span className={styles.label}>Ward Reach on Time </span>
        {wardReachTimes?.length > 0 ? (
          <div className={styles.timeChips}>
            {wardReachTimes?.map((time, index)=> (
              <span key={index} className={styles.timeChip}>
                {time}
              </span>
            ))}
          </div>
        ): (
          <span className={styles.value}>N/A</span>
        )}
      </div>

     <div className={styles.maincard}>
       <div className={styles.detailCard}>
        <span className={styles.label}>Driver Name </span>
        <span className={styles.value}>{dutySummary?.driverName || "N/A"}</span>
      </div>

      <div className={styles.detailCard}>
        <span className={styles.label}>Helper Name </span>
        <span className={styles.value}>{dutySummary?.helperName || "N/A"}</span>
      </div>
     </div>

      
    </div>
  )
}

export default WardMonitoringPanel
