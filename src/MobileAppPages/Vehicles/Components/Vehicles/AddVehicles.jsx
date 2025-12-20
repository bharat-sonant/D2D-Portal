import { useState, useEffect } from 'react';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../../../assets/css/modal.module.css';
import { FaSpinner } from 'react-icons/fa';
import * as service from '../../../../services/VehicleServices/VehicleServices';
import * as common from '../../../../common/common';

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
  fetchVehicles
}) => {
  const [vehicleError, setVehicleError] = useState('');
  const [chassisError, setChassisError] = useState('');
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
    setVehicleName(value);
    setVehicleError(value.trim() ? '' : 'Please provide vehicle name.');
  };

  const handleChassisChange = (value) => {
    setChassisNo(value);
    setChassisError(value.trim() ? '' : 'Please provide chassis number.');
  };

  /* =========================
     Save or Update Vehicle
  ========================= */
  const handleSaveVehicles = async () => {
    let hasError = false;

    if (!vehicleName.trim()) {
      setVehicleError('Please provide vehicle name.');
      hasError = true;
    }

    if (!chassisNo.trim()) {
      setChassisError('Please provide chassis number.');
      hasError = true;
    }

    if (hasError) return;

    setLoader(true);

    try {
      const payload = {
        vehicles_No: vehicleName,
        chassis_no: chassisNo,
        city_id: 1,
        created_by: 'Ansh'
      };

      const res = vehicleId
        ? await service.updateVehicleData(vehicleId, payload)
        : await service.saveVehicleData(payload);

      setLoader(false);

      if (res?.status === 'success') {
        if (fetchVehicles) await fetchVehicles();

        // ✅ EDIT MODE → show updated details immediately
        if (vehicleId && setVehicleDetails) {
          setVehicleDetails(res.data);
        }

        handleCloseModal();

        common.setAlertMessage(
          'success',
          vehicleId ? 'Vehicle updated successfully' : 'Vehicle added successfully'
        );
      } else {
        common.setAlertMessage('warn', res?.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setLoader(false);
      common.setAlertMessage('warn', 'Error while saving vehicle');
    }
  };

  /* =========================
     Close Modal & Reset State
  ========================= */
  const handleCloseModal = () => {
    setVisible(false);

    setTimeout(() => {
      setShowModal(false);
      setVehicleName('');
      setChassisNo('');
      setVehicleId(null);
      setVehicleError('');
      setChassisError('');

      // 🛡 safe optional reset
      //   if (setVehicleDetails) {
      //     setVehicleDetails(null);
      //   }
    }, 300);
  };

  if (!showModal && !visible) return null;

  return (
    <div className={`${styles.overlay} ${visible ? styles.fadeIn : styles.fadeOut}`}>
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>
            {vehicleId ? 'Update Vehicle' : 'Add Vehicle'}
          </p>

          <button className={styles.closeBtn} onClick={handleCloseModal}>
            <img
              src={images.iconClose}
              className={styles.iconClose}
              title="Close"
              alt="icon"
            />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className="row">
            {/* Vehicle Name */}
            <div className="col-md-12">
              <div className={styles.textboxGroup}>
                <div className={styles.textboxMain}>
                  <div className={styles.textboxLeft}>Vehicle Name</div>
                  <div className={styles.textboxRight}>
                    <input
                      type="text"
                      className={`form-control ${styles.formTextbox} ${vehicleError ? 'is-invalid' : ''
                        }`}
                      value={vehicleName}
                      onChange={(e) => handleVehicleNameChange(e.target.value)}
                    />
                  </div>
                </div>
                {vehicleError && (
                  <div className={styles.invalidfeedback}>{vehicleError}</div>
                )}
              </div>
            </div>

            {/* Chassis No */}
            <div className="col-md-12 mt-2">
              <div className={styles.textboxGroup}>
                <div className={styles.textboxMain}>
                  <div className={styles.textboxLeft}>Chassis No</div>
                  <div className={styles.textboxRight}>
                    <input
                      type="text"
                      className={`form-control ${styles.formTextbox} ${chassisError ? 'is-invalid' : ''
                        }`}
                      value={chassisNo}
                      onChange={(e) => handleChassisChange(e.target.value)}
                    />
                  </div>
                </div>
                {chassisError && (
                  <div className={styles.invalidfeedback}>{chassisError}</div>
                )}
              </div>
            </div>

            {/* Save / Update */}
            <div className="col-md-12 p-0 mt-3">
              <button
                type="button"
                className={styles.btnSave}
                onClick={handleSaveVehicles}
                disabled={loader}
              >
                {loader ? (
                  <div className={styles.Loginloadercontainer}>
                    <FaSpinner className={styles.spinnerLogin} />
                    <span className={styles.loaderText}>Please wait...</span>
                  </div>
                ) : vehicleId ? (
                  'Update'
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicles;
