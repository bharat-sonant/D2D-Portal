import { useState } from 'react';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../../../assets/css/modal.module.css';
import * as action from '../../Action/AddVehicle/AddVehicleAction';
import { FaSpinner } from 'react-icons/fa';

const AddVehicles = (props) => {
    const [error, setError] = useState({
        vehicleName: "",
        chassisNumber: ""
    });
    const [loader, setLoader] = useState(false);

    const handleInputChange = (type, value) => {
        action.handleChange(
            type,
            value,
            props.setVehicleName,
            setError,
            props.setChassisNumber
        );
    }

    const handleSaveVehicles = () => {
        action.handleSave(
            props.vehicleName,
            setError,
            setLoader,
            props.setVehicleName,
            props.setShowModal,
            props.setVehicleList,
            props.vehicleId,
            props.setVehicleDetails,
            props.setVehicleId,
            props.historyData,
            props.chassisNumber,
            props.setChassisNumber
        );
    };

    const handleCloseModal = () => {
        props.setShowModal(false);
        action.handleClearAll(
            props.setVehicleName,
            setError,
            props.setVehicleId
        );
    };

    if (!props.showModal) {
        return null;
    }

    return (
        <div className={`${styles.overlay}`}>
            <div className={`${styles.modal}`}>
                <div className={`${styles.actionBtn}`}>
                    <p className={styles.headerText}>{props.vehicleId ? "Update Vehicle" : "Add Vehicle"}</p>
                    <button className={`${styles.closeBtn}`} onClick={handleCloseModal} >
                        <img
                            src={images.iconClose}
                            className={`${styles.iconClose}`}
                            title="Close"
                            alt="icon"
                        />
                    </button>
                </div>

                <div className={`${styles.modalBody}`}>
                    <div className={`row`}>
                        <div className={`col-md-12`}>
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`} style={{ width: '129px' }}>Vehicle Name</div>
                                    <div className={`${styles.textboxRight}`}>
                                        <input
                                            type="text"
                                            id="Name"
                                            className={`form-control ${styles.formTextbox} ${error.vehicleName ? 'is-invalid' : ""}`}
                                            placeholder=" "
                                            value={props.vehicleName}
                                            onChange={(e) =>
                                                handleInputChange("name", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {error.vehicleName && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {error.vehicleName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`col-md-12`}>
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`} style={{ width: '129px' }}>Chassis Number</div>
                                    <div className={`${styles.textboxRight}`}>
                                        <input
                                            type="text"
                                            id="chassisNumber"
                                            className={`form-control ${styles.formTextbox} ${error.chassisNumber ? 'is-invalid' : ""}`}
                                            placeholder=" "
                                            value={props.chassisNumber}
                                            onChange={(e) =>
                                                handleInputChange("chassisNumber", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {error.chassisNumber && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {error.chassisNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`col-md-12 p-0`}>
                        <button
                            type="submit"
                            className={`mt-3 ${styles.btnSave}`}
                            onClick={handleSaveVehicles}
                            disabled={loader}
                        >
                            {loader ? (
                                <div className={styles.Loginloadercontainer}>
                                    <FaSpinner className={styles.spinnerLogin} />
                                    <span className={styles.loaderText}>Please wait...</span>
                                </div>
                            ) : (
                                props.vehicleId ? "Update" : "Save"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddVehicles