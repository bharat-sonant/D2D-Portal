import { useState } from "react";
import styles from "../../../src/assets/css/modal.module.css";
import { FaSpinner } from "react-icons/fa";
import { images } from "../../assets/css/imagePath";
import { handleSaveCities, validateCityFields } from "../../actions/City/CityAction";

const AddCity = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const loggedInUserId = 'Admin';

    if (!props.showCanvas) {
        return null;
    };

    const SaveCityData = () => {
        handleSaveCities(
            props.cityName,
            props.setCityNameError,
            props.isEdit,
            loggedInUserId,
            setIsLoading,
            props.handleClose,
            clearFields,
            props.setTriggerList,
            props.cityId
        );
    };

    const clearFields = () => {
        props.setCityName('');
        props.setCityNameError('');
        props.setIsEdit(false);
        props.setTriggerList(false);
        props.setCityId('');
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isLoading) {
            e.preventDefault();
            SaveCityData();
        }
    };

    return (
        <>
            <div className={`${styles.overlay}`}>
                <div className={`${styles.modal}`} onKeyDown={handleKeyDown} tabIndex={0}>
                    <div className={`${styles.actionBtn}`}>
                        <p className={styles.headerText}>{props.isEdit ? "Edit City" : "Add City"}</p>
                        <button className={`${styles.closeBtn}`} onClick={props.handleClose}>
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
                                        <div className={`${styles.textboxLeft}`}>City Name</div>
                                        <div className={`${styles.textboxRight}`}>
                                            <input
                                                type="text"
                                                id="CityName"
                                                className={`form-control ${styles.formTextbox} ${props.cityNameError ? "is-invalid" : ""
                                                    }`}
                                                placeholder=" "
                                                value={props.cityName}
                                                onChange={(e) => validateCityFields(e.target.value, props.setCityName, props.setCityNameError)}
                                            />
                                        </div>
                                    </div>
                                    {props.cityNameError && (
                                        <div className={`${styles.invalidfeedback}`}>
                                            {props.cityNameError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-12 p-0`}>
                            <button
                                type="submit"
                                className={`mt-3 ${styles.btnSave}`}
                                onClick={SaveCityData}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className={styles.Loginloadercontainer}>
                                        <FaSpinner className={styles.spinnerLogin} />
                                        <span className={styles.loaderText}>Please wait...</span>
                                    </div>
                                ) : (
                                    props.isEdit ? "Update" : "Save"
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddCity