import React, { act, useEffect, useState, useRef } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchAllDrivers,
  fetchAllVehicles,
  startAssignmentAction,
} from "../../actions/StartAssignmentActions/StartAssignment";
import { getCityFirebaseConfig } from "../../../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../../../firebase/firebaseService";
import * as common from "../../../../../common/common";
import { ArrowLeft, Camera } from "lucide-react";
import VehiclesDropdown from "../../components/VehiclesDropdown/VehiclesDropdown";
import DriverHelperImageLayout from "../../components/DriverHelperImageLayout/DriverhelperImageLayout";
import DriverHelperDetails from "../../components/DriverHelperDetails/DriverHelperDetails";
import DriversDropdown from "../../components/DriversDropdown/DriversDropdown";

const StartAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([])
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("")
  const [driverId, setDriverId] = useState("");
  const [driverDeviceId, setDriverDeviceId] = useState("");
  const [helperId, setHelperID] = useState("");
  const [helperDeviceId, setHelperDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [errors, setErrors] = useState({
    driverId: "",
    driverDeviceId: "",
    helperId: "",
    helperDeviceId: "",
    vehicle: "",
    driver: ""
  });
  const [isSaving, setIsSaving] = useState(false)
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
    return () =>
      window.removeEventListener("androidBackPressed", handleAndroidBack);
  }, []);

  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);

      let config = getCityFirebaseConfig(city);
      connectFirebase(config, city);
    } else {
      localStorage.setItem("city", "DevTest");
      console.warn("⚠️ No city found, defaulting to DevTest");
    }
  }, [city]);

  useEffect(() => {
    fetchAllVehicles(setVehicles, setLoading, setActiveVehicles);
    fetchAllDrivers(setDrivers)
  }, []);

  const handleSubmit = async () => {
    if (!selectedVehicle) {
      setErrors((prev) => ({ ...prev, vehicle: "Please select vehicle" }));
      return;
    }

    let newErrors = {
      driverId: "",
      driverDeviceId: "",
      helperId: "",
      helperDeviceId: "",
      vehicle: "",
      driver: ""
    };

    if (!driverId.trim()) newErrors.driverId = "Driver ID is required";
    if (!driverDeviceId.trim())
      newErrors.driverDeviceId = "Driver Device ID is required";
    if (!helperId.trim()) newErrors.helperId = "Helper ID is required";
    if (!helperDeviceId.trim())
      newErrors.helperDeviceId = "Helper Device ID is required";

    if (
      newErrors.driverId ||
      newErrors.driverDeviceId ||
      newErrors.helperId ||
      newErrors.helperDeviceId
    ) {
      setErrors(newErrors);
      // common.setAlertMessage("error", "Please fill all required fields!");
      return;
    }

    // clear errors
    setErrors({
      driverId: "",
      driverDeviceId: "",
      helperId: "",
      helperDeviceId: "",
    });

    const result = await startAssignmentAction(
      selectedVehicle,
      ward,
      driverId,
      driverDeviceId,
      helperId,
      helperDeviceId,
      city,
      user,
      setIsSaving
    );
    if (result.status === "success") {
      // common.setAlertMessage("success", "Assignment started successfully!");
      handleClear();
      setActiveVehicles((prev) =>
        prev.filter((v) => v.vehcileNo !== selectedVehicle)
      );
    }
  };

  const handleClear = () => {
    setSelectedVehicle("");
    setDriverId("");
    setDriverDeviceId("");
    setHelperID("");
    setHelperDeviceId("");
  };

  const handleBack = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (
      isAndroid &&
      window.Android &&
      typeof window.Android.closeWebView === "function"
    ) {
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
          loading={loading}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          activeVehicles={activeVehicles}
          vehicleError={errors.vehicle}
          setErrors={setErrors}
        />

        <DriversDropdown
          loading={loading}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          driverError = {errors.driver}
          setErrors={setErrors}
          drivers={drivers}
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
          errors={errors}
          setErrors={setErrors}
        />

        <div className={styles.imageRow}>
          <div className={styles.imageLeft}>
            <DriverHelperImageLayout />
          </div>
          <div className={styles.imageRight}>
            <div className={styles.imgSection}>
              <div className={styles.imgTitle}>Meter</div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleImageCapture}
              />

              {/* Display captured image or capture button */}
              {capturedImage ? (
                <div className={styles.imagePreview}>
                  <img
                    src={capturedImage}
                    alt="Meter"
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={handleCaptureMeterImage}
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <div
                  className={styles.captureMeterButton}
                  onClick={handleCaptureMeterImage}
                >
                  <Camera className={styles.cameraIcon} />
                  Click to capture
                </div>
              )}
            </div>
          </div>
        </div>

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className={styles.loaderWrapper}>
                <span className={styles.loaderCircle}></span>
                Saving...
              </div>
            ) : (
              "Submit"
            )}
          </button>

      </div>
    </div>
  );
};

export default StartAssignment;
