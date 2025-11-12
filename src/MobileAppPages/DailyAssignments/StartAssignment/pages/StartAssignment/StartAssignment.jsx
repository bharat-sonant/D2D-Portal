import React, { act, useEffect, useState, useRef } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllVehicles, startAssignmentAction } from "../../actions/StartAssignmentActions/StartAssignment";
import { getCityFirebaseConfig } from "../../../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../../../firebase/firebaseService";
import { startAssignment } from "../../services/StartAssignmentService/StartAssignment";
import * as common from '../../../../../common/common'
import { ArrowLeft, Camera } from "lucide-react";
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
  const [capturedImage, setCapturedImage] = useState(null);
  
  const fileInputRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const ward = queryParams.get("ward") || "N/A";
  const user = queryParams.get("user") || "N/A";
  const city = queryParams.get("city") || "DevTest";

  useEffect(() => {
    const handleAndroidBack = () => {
      handleBack();
    };

    window.addEventListener("androidBackPressed", handleAndroidBack);
    return () => window.removeEventListener("androidBackPressed", handleAndroidBack);
  }, []);

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
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid && window.Android && typeof window.Android.closeWebView === "function") {
      window.Android.closeWebView();
    } else {
      navigate(-1);
    }
  };

  const handleCaptureMeterImage = () => {
    // Mobile camera open karne ke liye
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        common.setAlertMessage("success", "Meter image captured successfully!");
      };
      reader.readAsDataURL(file);
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


      <DriverHelperImageLayout />
      
      {/* Hidden file input for camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleImageCapture}
      />
      
      {/* Capture Meter Image Button */}
      <button 
        className={styles.captureMeterButton} 
        onClick={handleCaptureMeterImage}
      >
        <Camera size={20} />
        Capture Meter Image
      </button>

      {/* Preview captured image (optional) */}
      {capturedImage && (
        <div className={styles.imagePreview}>
          <img src={capturedImage} alt="Meter" className={styles.previewImage} />
        </div>
      )}

      <button 
        className={styles.submitButton}
        onClick={handleSubmit}
      >
        Submit
      </button>
      </div>

    </div>
  );
};

export default StartAssignment;