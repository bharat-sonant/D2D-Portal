import React, { useEffect, useState } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation } from "react-router-dom";
import { fetchAllVehicles } from "../../actions/StartAssignmentActions/StartAssignment";

const StartAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search);
   const ward = queryParams.get("ward") || "N/A";
  const user = queryParams.get("user") || "N/A";
  const city = queryParams.get("city") || "N/A";
  localStorage.setItem('city',city)

  useEffect(()=>{
    const vehicles = fetchAllVehicles(setVehicles, setLoading);
  },[])

  const handleVehicleChange = (e)=> {
    setSelectedVehicle(e.target.value);
  }

  const activeVehicles = vehicles.filter(
    (v) => String(v.status) === "1" 
  );

 return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Start Assignment</h2>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>City:</span>
            <span className={styles.value}>{city}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Ward:</span>
            <span className={styles.value}>{ward}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>User:</span>
            <span className={styles.value}>{user}</span>
          </div>
        </div>

        <div className={styles.dropdownContainer}>
          <label className={styles.dropdownLabel} htmlFor="vehicle-select">
            Select Vehicle
          </label>
          {loading ? (
            <div className={styles.loadingText}>Loading vehicles...</div>
          ) : (
            <select
              id="vehicle-select"
              className={styles.dropdown}
              value={selectedVehicle}
              onChange={handleVehicleChange}
            >
              <option value="">-- Choose a vehicle --</option>
              {activeVehicles?.map((vehicle, index) => (
                <option key={index} value={vehicle?.vehcileNo}>
                  {vehicle.vehcileNo || 'N/A'} 
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};
export default StartAssignment;
