import React, { useEffect, useState } from 'react'
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';
import { fetchAllActiveDrivers, fetchAllVehicles } from '../../actions/DutyOnAction';
import styles from '../../../DailyAssignments/StartAssignment/styles/StartAssignment.module.css'
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleDropdown from '../../components/vehicleDropdown/VehicleDropdown';
import { getActiveDrivers } from '../../../services/DutyOnService/DutyOn';
import DriverDropdown from '../../components/driverDropdown/DriverDropdown';

const DutyOn = () => {
  const [loading, setLoading] = useState(false)
  const [activeVehicles, setActiveVehicles] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [activerDrivers, setActiveDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('')
  const navigate = useNavigate();
  const city = "DevTest"
  const ward = "Govind"

   useEffect(() => {
      if (city) {
        localStorage.setItem("city", city);
  
        let config = getCityFirebaseConfig(city);
        connectFirebase(config, city);
      } else {
        localStorage.setItem("city", "DevTest");
      }
    }, [city]);

  useEffect(()=> {
    fetchAllVehicles( setLoading, setActiveVehicles);
    fetchAllActiveDrivers(setLoading, setActiveDrivers)
  },[])

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
        loading={loading}
        activeVehicles={activeVehicles}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        />

        <DriverDropdown
        loading={loading}
        drivers={activerDrivers}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        />
    </div>
    </div>
  )
}

export default DutyOn
