import React, { useEffect, useState } from 'react'
import { connectFirebase } from '../../../firebase/firebaseService';
import { getCityFirebaseConfig } from '../../../configurations/cityDBConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/DutyStart.module.css'
import { ArrowLeft } from 'lucide-react';
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal';
import BottomSheet from '../components/bottomSheet/BottomSheet' // <- ensure correct import path

const DutyStart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  // which sheet is open: 'vehicle' | 'driver' | 'helper' | null
  const [sheetType, setSheetType] = useState(null);

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedHelper, setSelectedHelper] = useState('');

  // sample "details" that come from API/props — can be replaced by actual API
  const details = {
    vehicle: 'EV-2025',
    driver: 'Nishant-Driver',
    helper: 'Vikram-Helper'
  }

  const [vehicles, setVehicles] = useState(['EV-2025', 'EV-2024', 'EV-2023']);
  const [drivers, setDrivers] = useState(['Nishant-Driver', 'Rohit-Driver', 'Suresh-Driver']);
  const [helpers, setHelpers] = useState(['Vikram-Helper', 'Ashok-Helper', 'Ramesh-Helper']);

  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingHelpers, setLoadingHelpers] = useState(false);

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
    setSelectedVehicle(details.vehicle || '');
    setSelectedDriver(details.driver || '');
    setSelectedHelper(details.helper || '');
  }, []); 

  const handleBack = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid && window.Android && typeof window.Android.closeWebView === "function") {
      window.Android.closeWebView();
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    setShowModal(true)
  }

  const handleCloseModal = () => setShowModal(false)
  const handleConfirm = () => setShowModal(false)

  const openSheet = (type) => {
    if (type === 'vehicle') {

    } else if (type === 'driver') {

    } else if (type === 'helper') {

    }

    setSheetType(type);
  };

  const closeSheet = () => setSheetType(null);

  const handleSelectFromSheet = (type, value) => {
    if (type === 'vehicle') setSelectedVehicle(value || '');
    if (type === 'driver') setSelectedDriver(value || '');
    if (type === 'helper') setSelectedHelper(value || '');
    closeSheet();
  };

  const sheetProps = (() => {
    switch (sheetType) {
      case 'vehicle':
        return {
          title: 'Select Vehicle',
          items: vehicles,
          selectedItem: selectedVehicle,
          loading: loadingVehicles,
        };
      case 'driver':
        return {
          title: 'Select Driver',
          items: drivers,
          selectedItem: selectedDriver,
          loading: loadingDrivers,
        };
      case 'helper':
        return {
          title: 'Select Helper',
          items: helpers,
          selectedItem: selectedHelper,
          loading: loadingHelpers,
        };
      default:
        return { title: '', items: [], selectedItem: null, loading: false };
    }
  })();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft />
        </button>
        <h1 className={styles.headerTitle}>Duty Start {ward}</h1>
      </div>

      <div className={styles.contentContainer}>

        {/* VEHICLE */}
        <label className={styles.label}>Vehicle</label>
        <div className={styles.row}>
          <select className={styles.dropdown}
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            disabled>
            <option value="">Select Vehicle</option>
            {vehicles.map((v, i) => <option key={i} value={v}>{v}</option>)}
          </select>
          <button className={styles.changeButton} onClick={() => openSheet('vehicle')}>Change</button>
        </div>

        {/* DRIVER */}
        <label className={styles.label}>Driver</label>
        <div className={styles.row}>
          <select className={styles.dropdown}
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            disabled>
            <option value="">Select Driver</option>
            {drivers.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
          <button className={styles.changeButton} onClick={() => openSheet('driver')}>Change</button>
        </div>

        {/* HELPER */}
        <label className={styles.label}>Helper</label>
        <div className={styles.row}>
          <select className={styles.dropdown}
            value={selectedHelper}
            onChange={(e) => setSelectedHelper(e.target.value)}
            disabled>
            <option value="">Select Helper</option>
            {helpers.map((h, i) => <option key={i} value={h}>{h}</option>)}
          </select>
          <button className={styles.changeButton} onClick={() => openSheet('helper')}>Change</button>
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

      {/* BottomSheet: open only when sheetType !== null */}
      <BottomSheet
        isOpen={!!sheetType}
        onClose={closeSheet}
        title={sheetProps.title}
        items={sheetProps.items}
        selectedItem={sheetProps.selectedItem}
        loading={sheetProps.loading}
        onSelect={(value) => handleSelectFromSheet(sheetType, value)}
      />
    </div>
  )
}

export default DutyStart
