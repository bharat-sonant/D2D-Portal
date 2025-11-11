import { ChevronDown, Truck } from 'lucide-react'
import styles from '../../styles/StartAssignment.module.css'
import React from 'react'

const VehiclesDropdown = ({loading, selectedVehicle,setSelectedVehicle, activeVehicles}) => {
  const handleVehicleChange = (e)=> {
    setSelectedVehicle(e.target.value);
  }
  return (
    <div className={styles.vehicleCard}>
        {loading ? (
          <div className={styles.loadingText}>Loading vehicles...</div>
        ) : (
          <div className={styles.dropdownWrapper}>
            <div className={styles.dropdownDisplay}>
              <div className={styles.leftGroup}>
                <Truck color="#22c55e" size={24} className={styles.truckIcon} />
                <span className={styles.vehicleLabel}>
                  {selectedVehicle || "Select vehicle"}
                </span>
              </div>
              <ChevronDown className={styles.dropdownIcon} size={16} />
            </div>

            <select
              className={styles.vehicleDropdown}
              value={selectedVehicle}
              onChange={handleVehicleChange}
            >
              <option value="">-- Choose a vehicle --</option>
              {activeVehicles?.map((vehicle, index) => (
                <option key={index} value={vehicle?.vehcileNo}>
                  {vehicle.vehcileNo || "N/A"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

  )
}

export default VehiclesDropdown
