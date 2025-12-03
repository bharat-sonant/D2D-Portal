import React, { useEffect, useState } from 'react'
import { connectFirebase } from '../../../firebase/firebaseService';
import { getCityFirebaseConfig } from '../../../configurations/cityDBConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/DutyStart.module.css'
import { ArrowLeft } from 'lucide-react';
import BottomSheet from '../components/bottomSheet/BottomSheet';
import { fetchTaskVehicle } from '../../services/DutyStartService/DutyStart';
import BottomSheet2 from '../components/bottomSheet/BottomSheet2';

  const DutyStart = () => { 
      const [sheetOpen, setSheetOpen] = useState(false);
      const [sheet2Open, setSheet2Open] = useState(false);
      const [assignedData, setAssignedData] = useState({});
      const [selectedVehicle, setSelectedVehicle] = useState("");
      const [selectedDriver, setSelectedDriver] = useState(null);
      const [selectedHelper, setSelectedHelper] = useState(null)
      const [loading, setLoading] = useState(false);
      const [mode, setMode] = useState("vehicle");
      const location = useLocation();
      const navigate = useNavigate();

      const queryParams = new URLSearchParams(location.search);
      const city = queryParams.get("city") || "DevTest";
      const ward = queryParams.get("task") || "Govind";

      const openSheet = () => setSheetOpen(true);
      const closeSheet = () => setSheetOpen(false);

      const openSheet2 = () => setSheet2Open(true)
      const closeSheet2 = () => setSheet2Open(false)

      useEffect(() => {
        if (city) {
          localStorage.setItem("city", city);
        
          let config = getCityFirebaseConfig(city);
          connectFirebase(config, city);
        } else {
            localStorage.setItem("city", "DevTest");
        }
      }, [city]);

      useEffect(()=>{
        openSheet2()
        fetchData();
      },[])

      const fetchData = async()=> {
        setLoading(true)
        const result = await fetchTaskVehicle(ward)
        setAssignedData(result.data)
        setLoading(false)
      }

        const handleBack = () => {
          if (/Android/i.test(navigator.userAgent) && window.Android?.closeWebView) {
            window.Android.closeWebView();
          } else navigate(-1);
        };
          
    return (
        <div className={styles.pageContainer}>
          <div className={styles.header}>
            <button className={styles.backButton} onClick={handleBack}>
              <ArrowLeft />
            </button>
            <h1 className={styles.headerTitle}>Duty Start {ward}</h1>
          </div>

        
        {/* Top White Box */}
       <div className={styles.boxes}>
         <div className={styles.topBox}>
          <p className={styles.topBoxText}>
            {selectedVehicle ?  `Vehicle : ${selectedVehicle}` : "No Vehicle Selected"}
          </p>
        </div>

        {selectedVehicle ? 
        <div className={styles.topBox}>
          <p className={styles.topBoxText}>
            {selectedDriver ? `Driver : ${selectedDriver.name}` : "No Driver Selected"}
          </p>
        </div> 
        : <></>}

        {selectedVehicle && selectedDriver ? 
        <div className={styles.topBox}>
          <p className={styles.topBoxText}>
            {selectedHelper ? `Helper : ${selectedHelper.name}` : "No Helper Selected"}
          </p>
        </div> 
        : <></>}
       </div>

        {/* Content area for future form items */}
        <div className={styles.contentContainer}>
          {/* Your rows or form fields will come here */}
        </div>

        <BottomSheet2
          isOpen={sheet2Open}
          onClose={closeSheet2}
          ward={ward}
          assignedData={assignedData}
          selectedVehicle={selectedVehicle}
          selectedDriver={selectedDriver}
          selectedHelper={selectedHelper}
          setSelectedVehicle={setSelectedVehicle}
          setSelectedDriver={setSelectedDriver}
          setselectedHelper={setSelectedHelper}
          openSheet={openSheet}
          closeSheet={closeSheet}
          loading={loading}
          mode={mode}
          setMode={setMode}
        />

          <BottomSheet
          isOpen={sheetOpen}
          onClose={closeSheet}
          mode={mode}
          setMode={setMode}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          selectedHelper={selectedHelper}
          setSelectedHelper={setSelectedHelper}
        />

      </div>
    );
  };

  export default DutyStart;
