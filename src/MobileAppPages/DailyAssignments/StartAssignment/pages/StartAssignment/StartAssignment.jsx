import React, { act, useEffect, useState } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation } from "react-router-dom";
import { fetchAllVehicles, startAssignmentAction } from "../../actions/StartAssignmentActions/StartAssignment";
import { getCityFirebaseConfig } from "../../../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../../../firebase/firebaseService";
import { startAssignment } from "../../services/StartAssignmentService/StartAssignment";
import * as common from '../../../../../common/common'
import { ArrowLeft } from "lucide-react";
import VehiclesDropdown from "../../components/VehiclesDropdown/VehiclesDropdown";
import DriverHelperImageLayout from "../../components/DriverHelperImageLayout/DriverhelperImageLayout";
import DriverHelperDetails from "../../components/DriverHelperDetails/DriverHelperDetails";

const StartAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [driverId, setDriverId] = useState('')
  const [driverDeviceId, setDriverDeviceId] = useState('')
  const [helperId, setHelperID] = useState('');
  const [helperDeviceId, setHelperDeviceId] = useState('')
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
    try{
      if(window.Android && window.Android.closeWebView){
        window.Android.closeWebView();
        common.setAlertMessage('success')
      }else if (window.history.length > 1) {
      window.history.back();
    } else {
      common.setAlertMessage('issue in back button')
      console.warn("No native bridge or history available.");
    }
    }catch(e){
      common.setAlertMessage('error in back button')
      console.error("Error handling back:", e);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft />
        </button>
        <h1 className={styles.headerTitle}>Ward {ward}</h1>
      </div>
      <div className={styles.contentContainer}>
       <VehiclesDropdown
       ward={ward}
       user={user}
       city={city}
        loading={loading}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        activeVehicles={activeVehicles}
       />

       <DriverHelperDetails
        driverId={driverId}
        setDriverId={setDriverId}
        driverDeviceId={driverDeviceId}
        setDriverDeviceId={setDriverDeviceId}
        helperId={helperId}
        setHelperID={setHelperID}
        helperDeviceId={helperDeviceId}
        setHelperDeviceId={setHelperDeviceId}
       />

      </div>

      <DriverHelperImageLayout />
    </div>

  );
};
export default StartAssignment;


