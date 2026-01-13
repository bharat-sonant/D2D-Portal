import { useState, useEffect } from "react";
import { Truck, X, Hash, Check, Plus } from "lucide-react";
import modalStyles from "../../../../assets/css/popup.module.css";
import styles from "./AddVehicles.module.css";
import * as commonAction from "../../../../Actions/VehiclesAction/VehiclesAction";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

const AddVehicles = ({
  showModal,
  setShowModal,
  vehicleName,
  setVehicleName,
  chassisNo,
  setChassisNo,
  vehicleId,
  setVehicleId,
  setVehicleDetails,
  fetchVehicles,
  setVehicleList,
  vehicleList,
  historyData,
  selectedCity,
}) => {
  const [vehicleError, setVehicleError] = useState("");
  const [chassisError, setChassisError] = useState("");
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);

  /* =========================
     Fade-in / Fade-out
  ========================= */
  useEffect(() => {
    if (showModal) {
      setVisible(true);
    }
  }, [showModal]);

  /* =========================
     Handle Input Change
  ========================= */
  const handleVehicleNameChange = (value) => {
    const upperValue = value.toUpperCase();
    setVehicleName(upperValue);
    setVehicleError(upperValue.trim() ? "" : "Please provide vehicle name.");
  };

  const handleChassisChange = (value) => {
    const upperValue = value.toUpperCase();
    setChassisNo(upperValue);
    setChassisError(upperValue.trim() ? "" : "Please provide chassis number.");
  };

  /* =========================
     Save or Update Vehicle
  ========================= */
  const handleSaveVehicles = async () => {
    // Reset previous errors before action
    setVehicleError("");
    setChassisError("");

    const errorHandler = (msg) => {
      if (msg.toLowerCase().includes("name")) setVehicleError(msg);
      else if (msg.toLowerCase().includes("chassis")) setChassisError(msg);
      else {
        setVehicleError(msg);
        setChassisError(msg);
      }
    };

    if (vehicleId) {
      // UPDATE
      await commonAction.handleUpdate(
        vehicleName,
        chassisNo,
        errorHandler,
        setLoader,
        setVehicleName,
        setChassisNo,
        setShowModal,
        setVehicleList,
        vehicleId,
        setVehicleDetails,
        setVehicleId,
        historyData,
        vehicleList,
        selectedCity?.city_id
      );
    } else {
      // SAVE
      await commonAction.handleSave(
        vehicleName,
        chassisNo,
        errorHandler,
        setLoader,
        setVehicleName,
        setChassisNo,
        setShowModal,
        setVehicleList,
        setVehicleId, // Pass setVehicleId
        historyData,
        vehicleList,
        selectedCity?.city_id
      );
    }
  };

  /* =========================
     Close Modal & Reset State
  ========================= */
  const handleCloseModal = () => {
    setVisible(false);

    setTimeout(() => {
      setShowModal(false);
      setVehicleName("");
      setChassisNo("");
      setVehicleId(null);
      setVehicleError("");
      setChassisError("");

      // 🛡 safe optional reset
      //   if (setVehicleDetails) {
      //     setVehicleDetails(null);
      //   }
    }, 300);
  };

  if (!showModal && !visible) return null;

  return (
    <div className={modalStyles.overlay} aria-modal="true" role="dialog">
      <div className={`${modalStyles.modal} ${styles.modal}`}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <Truck className="map-icon" />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {vehicleId ? "Update Vehicle" : "Add New Vehicle"}
              </h2>
              <p className={modalStyles.modalSubtitle}>
                {vehicleId
                  ? "Modify your Vehicle information"
                  : "Enter your vehicle details"}
              </p>
            </div>
          </div>
          <button className={modalStyles.closeBtn} onClick={handleCloseModal}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={modalStyles.modalBody}>
          {/* Vehicle Name */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Vehicle Name</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <Truck size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                placeholder="Enter vehicle name"
                value={vehicleName}
                onChange={(e) => handleVehicleNameChange(e.target.value)}
              />
            </div>
            {vehicleError && <ErrorMessage message={vehicleError} />}
          </div>
          {/* Chassis No */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Chassis No</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <Hash size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                placeholder="Enter chasis no"
                value={chassisNo}
                onChange={(e) => handleChassisChange(e.target.value)}
              />
            </div>
            {chassisError && <ErrorMessage message={chassisError} />}
          </div>
        </div>
        {/* Footer */}
        <div className={modalStyles.modalFooter}>
          <button
            type="button"
            className={`${modalStyles.submitBtn}`}
            onClick={handleSaveVehicles}
            disabled={loader}
          >
            {loader ? (
              <div
                className="spinner-border"
                style={{ height: "18px", width: "18px", borderWidth: "2px" }}
              ></div>
            ) : vehicleId ? (
              <div className={styles.btnContent}>
                <Check size={18} />
                <span>Update</span>
              </div>
            ) : (
              <div className={styles.btnContent}>
                <Plus size={18} />
                <span style={{ marginTop: "2px" }}>Add Vehicle</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicles;
