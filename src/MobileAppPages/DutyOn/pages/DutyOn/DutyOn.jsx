import React, { useEffect, useState } from 'react'
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';
import { fetchAllActiveDrivers, fetchAllActiveHelpers, fetchAllVehicles, startAssignmentAction } from '../../actions/DutyOnAction';
import styles from '../../styles/DutyOn.module.css'
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleDropdown from '../../components/vehicleDropdown/VehicleDropdown';
import DriverDropdown from '../../components/driverDropdown/DriverDropdown';
import HelperDropdown from '../../components/helperDropdown/HelperDropdown';

const DutyOn = () => {
  const [loading, setLoading] = useState(false)
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [activerDrivers, setActiveDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('')
  const [activeHelpers, setActiveHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState('');
  const [isSaving, setIsSaving] = useState(false)
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
