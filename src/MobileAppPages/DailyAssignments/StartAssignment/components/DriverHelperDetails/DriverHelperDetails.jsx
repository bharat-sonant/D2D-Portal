import React from 'react'
import styles from '../../styles/StartAssignment.module.css'

const DriverHelperDetails = ({driverId,setDriverId,driverDeviceId, setDriverDeviceId,helperId,setHelperID, helperDeviceId, setHelperDeviceId}) => {
  return (
    <div className={styles.idFieldsCard}>
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Driver ID</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          />
        </div>
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Device ID</label>
          <div className={styles.deviceInputWrapper}>
            <span className={styles.devicePrefix}>DEV</span>
            <input
              type="text"
              className={styles.deviceInput}
              placeholder="Device ID"
              value={driverDeviceId}
              onChange={(e) => setDriverDeviceId(e.target.value)}
            />
          </div>
        </div>

      {/* Helper and Device ID Fields */}
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Helper ID</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={helperId}
            onChange={(e) => setHelperID(e.target.value)}
          />
        </div>
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Device ID</label>
          <div className={styles.deviceInputWrapper}>
            <span className={styles.devicePrefix}>DEV</span>
            <input
              type="text"
              className={styles.deviceInput}
              placeholder="Device ID"
              value={helperDeviceId}
              onChange={(e) => setHelperDeviceId(e.target.value)}
            />
          </div>
        </div>
      </div>

  )
}

export default DriverHelperDetails
