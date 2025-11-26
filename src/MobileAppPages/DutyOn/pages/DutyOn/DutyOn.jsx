import React, { useEffect, useRef, useState } from 'react'
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';
import { startAssignmentAction } from '../../actions/DutyOnAction';
import styles from '../../styles/DutyOn.module.css'
import { ArrowLeft, Camera } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleDropdown from '../../components/vehicleDropdown/VehicleDropdown';
import DriverDropdown from '../../components/driverDropdown/DriverDropdown';
import HelperDropdown from '../../components/helperDropdown/HelperDropdown';
import DriverHelperImageLayout from '../../components/DriverHelperImageLayout/DriverHelperImageLayout';
import * as common from '../../../../common/common'

const DutyOn = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedHelper, setSelectedHelper] = useState('');
  const [isSaving, setIsSaving] = useState(false)
  const [driverImage, setDriverImage] = useState(null)
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    driverId: "",
    driverDeviceId: "",
    helperId: "",
    helperDeviceId: "",
    vehicle: "",
    driver: "",
    helper: ""
  });

  const queryParams = new URLSearchParams(location.search);
  const ward = queryParams.get("task") || "Govind";
  const user = queryParams.get("user") || "N/A";
  const city = queryParams.get("city") || "DevTest";

   useEffect(() => {
      if (city) {
        localStorage.setItem("city", city);
  
        let config = getCityFirebaseConfig(city);
        connectFirebase(config, city);
      } else {
        localStorage.setItem("city", "DevTest");
      }
    }, [city]);


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

  const handleSubmit = async() => {
    if (!selectedVehicle) {
      setErrors((prev) => ({ ...prev, vehicle: "Please select vehicle" }));
      return;
    }
    if (!selectedDriver) {
      setErrors((prev) => ({ ...prev, driver: "Please select Driver" }));
      return;
    }
    if (!selectedHelper) {
      setErrors((prev) => ({ ...prev, helper: "Please select Helper" }));
      return;
    }

    const result = await startAssignmentAction(setIsSaving, ward,selectedVehicle, selectedDriver, selectedHelper);
    if(result.status === "success"){
       handleClear();
      //  setActiveVehicles((prev) =>
      //   prev.filter((v) => v.vehicleNo !== selectedVehicle)
      // );
      // setActiveDrivers((prev) =>
      //   prev.filter((d) => d.Id !== selectedDriver.Id)
      // );
      // setActiveHelpers((prev) =>
      //   prev.filter((h) => h.Id !== selectedHelper.Id)
      // );
    }
  }

  const handleClear = () => {
    setSelectedDriver('')
    setSelectedHelper('')
    setSelectedVehicle('')
  }

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

      const handleCaptureMeterImage = () => {
    // Mobile camera open karne ke liye
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


 
  return (
     <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft/>
        </button>
        <h1 className={styles.headerTitle}>Duty On {ward}</h1>
      </div>
      <div className={styles.contentContainer}>
        <VehicleDropdown
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        vehicleError={errors.vehicle}
        setErrors={setErrors}
        />

        <DriverDropdown
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        driverError={errors.driver}
        setErrors={setErrors}
        />

        <HelperDropdown
          selectedHelper={selectedHelper}
          setSelectedHelper={setSelectedHelper}
          helperError={errors.helper}
          setErrors={setErrors}
        />

         <div className={styles.imageRow}>
          <div className={styles.imageLeft}>
            <DriverHelperImageLayout
              ward={ward}
              driverImage={driverImage}
              setDriverImage={setDriverImage}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
          <div className={styles.imageRight}>
            <div className={styles.imgSection}>
              <div className={styles.imgTitle}>Meter</div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                // onChange={handleImageCapture}
              />

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
                    // onClick={handleCaptureMeterImage}
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <div
                  className={styles.captureMeterButton}
                  // onClick={handleCaptureMeterImage}
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
  )
}

export default DutyOn
