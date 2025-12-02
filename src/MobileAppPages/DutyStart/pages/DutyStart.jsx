import React, { useEffect, useState } from 'react'
import { connectFirebase } from '../../../firebase/firebaseService';
import { getCityFirebaseConfig } from '../../../configurations/cityDBConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/DutyStart.module.css'
import { ArrowLeft } from 'lucide-react';
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal';
import BottomSheet from '../components/bottomSheet/BottomSheet';

const DutyStart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [sheetType, setSheetType] = useState(null);

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedHelper, setSelectedHelper] = useState('');

  const details = {
    vehicle: "EV-2025",
    driver: "Nishant-Driver",
    helper: "Vikram-Helper"
  };

  const vehicles = ["EV-2025", "EV-2024", "EV-2023"];
  const drivers = ["Nishant-Driver", "Rohit-Driver", "Suresh-Driver"];
  const helpers = ["Vikram-Helper", "Ashok-Helper", "Ramesh-Helper"];

  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "DevTest";
  const ward = queryParams.get("task") || "Govind";

  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);
      connectFirebase(getCityFirebaseConfig(city), city);
    }
  }, [city]);

  useEffect(() => {
    setSelectedVehicle(details.vehicle || "");
    setSelectedDriver(details.driver || "");
    setSelectedHelper(details.helper || "");
  }, []);

  const handleBack = () => {
    if (/Android/i.test(navigator.userAgent) && window.Android?.closeWebView) {
      window.Android.closeWebView();
    } else navigate(-1);
  };

  const openSheet = (type) => setSheetType(type);
  const closeSheet = () => setSheetType(null);

  const handleSelectFromSheet = (type, value) => {
    if (type === "vehicle") setSelectedVehicle(value);
    if (type === "driver") setSelectedDriver(value);
    if (type === "helper") setSelectedHelper(value);
    closeSheet();
  };

  const sheetProps = (() => {
    switch (sheetType) {
      case "vehicle":
        return { title: "Select Vehicle", items: vehicles, selectedItem: selectedVehicle };
      case "driver":
        return { title: "Select Driver", items: drivers, selectedItem: selectedDriver };
      case "helper":
        return { title: "Select Helper", items: helpers, selectedItem: selectedHelper };
      default:
        return { title: "", items: [], selectedItem: "" };
    }
  })();

  const handleSubmit = () => setShowModal(true);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft />
        </button>
        <h1 className={styles.headerTitle}>Duty Start {ward}</h1>
      </div>

      <div className={styles.contentContainer}>
        
        <label className={styles.label}>Vehicle</label>
        <div className={styles.row}>
          
          <div
            className={styles.selectWrapper}
            onClick={() => openSheet("vehicle")}
          >
            <select
              className={styles.dropdown}
              value={selectedVehicle}
              readOnly
            >
              <option>{selectedVehicle || "Select Vehicle"}</option>
            </select>
          </div>

          {!!details.vehicle && (
            <button
              className={styles.changeButton}
              onClick={() => openSheet("vehicle")}
            >
              Change
            </button>
          )}

        </div>

        <label className={styles.label}>Driver</label>
        <div className={styles.row}>

          <div
            className={styles.selectWrapper}
            onClick={() => openSheet("driver")}
          >
            <select
              className={styles.dropdown}
              value={selectedDriver}
              readOnly
            >
              <option>{selectedDriver || "Select Driver"}</option>
            </select>
          </div>

          {!!details.driver && (
            <button
              className={styles.changeButton}
              onClick={() => openSheet("driver")}
            >
              Change
            </button>
          )}

        </div>

        <label className={styles.label}>Helper</label>
        <div className={styles.row}>

          <div
            className={styles.selectWrapper}
            onClick={() => openSheet("helper")}
          >
            <select
              className={styles.dropdown}
              value={selectedHelper}
              readOnly
            >
              <option>{selectedHelper || "Select Helper"}</option>
            </select>
          </div>

          {!!details.helper && (
            <button
              className={styles.changeButton}
              onClick={() => openSheet("helper")}
            >
              Change
            </button>
          )}

        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <ConfirmationModal
        visible={showModal}
        title="Continue ?"
        message="Are you sure you want to continue with this record ?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      />

      <BottomSheet
        isOpen={!!sheetType}
        onClose={closeSheet}
        title={sheetProps.title}
        items={sheetProps.items}
        selectedItem={sheetProps.selectedItem}
        onSelect={(value) => handleSelectFromSheet(sheetType, value)}
      />
    </div>
  );
};

export default DutyStart;
