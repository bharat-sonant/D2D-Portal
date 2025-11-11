import React, { useEffect, useState } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation } from "react-router-dom";
import { fetchAllVehicles, startAssignmentAction } from "../../actions/StartAssignmentActions/StartAssignment";
import { getCityFirebaseConfig } from "../../../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../../../firebase/firebaseService";
import { startAssignment } from "../../services/StartAssignmentService/StartAssignment";
import * as common from '../../../../../common/common'
import { ArrowLeft } from "lucide-react";

const StartAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
   const [activeVehicles, setActiveVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search);
   const ward = queryParams.get("ward") || "N/A";
  const user = queryParams.get("user") || "N/A";
  const city = queryParams.get("city") || "DevTest"; 

  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);

      let config = getCityFirebaseConfig(city);
      connectFirebase(config, city)
    } else {
      localStorage.setItem("city", "DevTest");
      console.warn("⚠️ No city found, defaulting to DevTest");
    }
  }, [city]);

  useEffect(() => {
    fetchAllVehicles(setVehicles, setLoading, setActiveVehicles);
  }, []);


  const handleVehicleChange = (e)=> {
    setSelectedVehicle(e.target.value);
  }

  // const activeVehicles = vehicles.filter(
  //   (v) => String(v.status) === "1" 
  // );

  const handleSubmit = async () => {
    if (!selectedVehicle) {
      common.setAlertMessage("error", "Please select a Vehicle !");
      return;
    }
      const result = await startAssignmentAction(selectedVehicle, ward);
    
    if (result.status === "success") {
      setSelectedVehicle("");
      setActiveVehicles((prev) =>
      prev.filter((v) => v.vehcileNo !== selectedVehicle)
    );
    }
  };

   const handleBack = () => {
    window.history.back();
  };

 return (
    // <div className={styles.container}>
    //   <div className={styles.card}>
    //     <h2 className={styles.title}>Start Assignment</h2>

    //     <div className={styles.details}>
    //       <div className={styles.detailRow}>
    //         <span className={styles.label}>City:</span>
    //         <span className={styles.value}>{city}</span>
    //       </div>
    //       <div className={styles.detailRow}>
    //         <span className={styles.label}>Ward:</span>
    //         <span className={styles.value}>{ward}</span>
    //       </div>
    //       <div className={styles.detailRow}>
    //         <span className={styles.label}>User:</span>
    //         <span className={styles.value}>{user}</span>
    //       </div>
    //     </div>

    //     <div className={styles.dropdownContainer}>
    //       <label className={styles.dropdownLabel} htmlFor="vehicle-select">
    //         Select Vehicle
    //       </label>
    //       {loading ? (
    //         <div className={styles.loadingText}>Loading vehicles...</div>
    //       ) : (
    //         <select
    //         key={selectedVehicle}
    //           id="vehicle-select"
    //           className={styles.dropdown}
    //           value={selectedVehicle}
    //           onChange={handleVehicleChange}
    //         >
    //           <option value="">-- Choose a vehicle --</option>
    //           {activeVehicles?.map((vehicle, index) => (
    //             <option key={index} value={vehicle?.vehcileNo}>
    //               {vehicle.vehcileNo || 'N/A'} 
    //             </option>
    //           ))}
    //         </select>
    //       )}
    //     </div>
    //     <button
    //       className={styles.startButton}
    //       onClick={handleSubmit}
    //       disabled={!selectedVehicle}
    //     >
    //       Submit
    //     </button>
    //   </div>
    // </div>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft />
          </button>
          <h1 className={styles.headerTitle}>Ward {ward}</h1>
        </div>
      </div>
  );
};
export default StartAssignment;


