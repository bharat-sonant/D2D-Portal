import React, { useEffect, useState } from 'react'
import { connectFirebase } from '../../../firebase/firebaseService';
import { getCityFirebaseConfig } from '../../../configurations/cityDBConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/DutyStart.module.css'
import { ArrowLeft } from 'lucide-react';
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal';

const DutyStart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedHelper, setSelectedHelper] = useState('');
  const details = {
    vehicle : 'EV-2025',
    driver : 'Nishant-Driver',
    helper : 'Vikram-Helper'
  }

  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "DevTest";
  const ward = queryParams.get("task") || "Govind";


     useEffect(() => {
        if (city) {
          localStorage.setItem("city", city);
    
          let config = getCityFirebaseConfig(city);
          connectFirebase(config, city);
        } else {
          localStorage.setItem("city", "DevTest");
        }
      }, [city]);

       useEffect(() => {
        if (details) {
          setSelectedVehicle(details.vehicle || '');
          setSelectedDriver(details.driver || '');
          setSelectedHelper(details.helper || '');
        }
      }, []);

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
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleConfirm = () => {
    setShowModal(false)
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft/>
        </button>
        <h1 className={styles.headerTitle}>Duty Start {ward}</h1>
      </div>

        <div className={styles.contentContainer}>

    {/* VEHICLE */}
      <label className={styles.label}>Vehicle</label>
    <div className={styles.row}>
      <select className={styles.dropdown}
      value={selectedVehicle}
      onChange={(e)=>setSelectedVehicle(e.target.value)}>
        <option value="">Select Vehicle</option>
        <option>EV-2025</option>
        <option>EV-2024</option>
        <option>EV-2023</option>
      </select>
      <button className={styles.changeButton}>Change</button>
    </div>

    {/* DRIVER */}
      <label className={styles.label}>Driver</label>
    <div className={styles.row}>
      <select className={styles.dropdown}
      value={selectedDriver}
      onChange={(e)=>setSelectedDriver(e.target.value)}>
        <option value="">Select Driver</option>
        <option>Nishant - Driver</option>
        <option>Rohit - Driver</option>
        <option>Suresh - Driver</option>
      </select>
      <button className={styles.changeButton}>Change</button>
    </div>

    {/* HELPER */}
      <label className={styles.label}>Helper</label>
    <div className={styles.row}>
      <select className={styles.dropdown}
      value={selectedHelper}
      onChange={(e)=>setSelectedHelper(e.target.value)}>
        <option value="">Select Helper</option>
        <option>Vikram - Helper</option>
        <option>Ashok - Helper</option>
        <option>Ramesh - Helper</option>
      </select>
      <button className={styles.changeButton}>Change</button>
    </div>

    <button className={styles.submitButton} onClick={handleSubmit}>
      Submit
    </button>
</div>


    <ConfirmationModal
    visible={showModal}
    title='Complete Task ?'
    message='Are you sure you want to continue with this record ?'
    confirmText='Confirm'
    cancelText='Cancel'
    onConfirm={handleConfirm}
    onCancel={handleCloseModal}
    />

     
    </div>
  )
}

export default DutyStart
