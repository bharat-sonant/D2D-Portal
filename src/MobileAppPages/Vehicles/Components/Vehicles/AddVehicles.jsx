import { useState } from 'react';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../../../assets/css/modal.module.css';
import * as action from '../../Action/AddVehicle/AddVehicleAction';
import { FaSpinner } from 'react-icons/fa';

const AddVehicles = (props) => {
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);

    const handleInputChange = (type, value) => {
        action.handleChange(
            type,
            value,
            props.setVehicleName,
            setError
        );
    }

    const handleSaveVehicles = () => {
        action.handleSave(
            props.vehicleName,
            setError,
            setLoader,
            props.setVehicleName,
            props.setShowModal,
            props.setVehicleList
        );
    };

    const handleCloseModal = () => {
        props.setShowModal(false);
        action.handleClearAll(
            props.setVehicleName,
            setError
        );
    };

    if (!props.showModal) {
        return null;
    }

    return (
        <div className={`${styles.overlay}`}>
            <div className={`${styles.modal}`}>
                <div className={`${styles.actionBtn}`}>
                    <p className={styles.headerText}>{"Add Vehicle"}</p>
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
                                    <div className={`${styles.textboxLeft}`}>Vehicle Name</div>
                                    <div className={`${styles.textboxRight}`}>
                                        <input
                                            type="text"
                                            id="Name"
                                            className={`form-control ${styles.formTextbox} ${error ? 'is-invalid' : ""}`}
                                            placeholder=" "
                                            value={props.vehicleName}
                                            onChange={(e) =>
                                                handleInputChange("name", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {error}
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
                                "Save"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddVehicles