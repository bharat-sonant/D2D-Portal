import React from 'react'
import styles from '../../Style/WorkMonitoringList/WorkMonitoring.module.css';
import WorkMonitoringList from '../../Components/WorkMonitornig/WorkMonitoringList';

const WorkMonitoring = () => {
  return (
   <div className={styles.pageWrapper }>
      <div className={styles.mobileView}>
        <WorkMonitoringList/>

         </div>
          </div>
  )
}

export default WorkMonitoring;
