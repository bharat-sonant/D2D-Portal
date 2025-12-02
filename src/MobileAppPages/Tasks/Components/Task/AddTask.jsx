import styles from '../../../../assets/css/modal.module.css';
import { images } from '../../../../assets/css/imagePath';
import { FaSpinner } from "react-icons/fa";
import { useState } from 'react';
import * as action from '../../Action/AddTask/AddTaskAction';

const AddTask = (props) => {
    const [displayName, setDisplayName] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    const handleCloseModal = () => {
        props.setShowCanvas(false);
        action.handleClearFields(
            setError,
            setDisplayName,
            setLoader
        );
    };

    const handleInputChange = (type, value) => {
        action.handleChange(
            type,
            value,
            setDisplayName,
            setError
        );
    };

    const handleSave = () => {
        action.handleSaveTasks(
            displayName,
            setError,
            setLoader,
            setDisplayName
        );
    };

    if (!props.showCanvas) {
        return null;
    }
    return (
        <div className={`${styles.overlay}`}>
            <div className={`${styles.modal}`}>
                <div className={`${styles.actionBtn}`}>
                    <p className={styles.headerText}>Add Task</p>
                    <button className={`${styles.closeBtn}`} onClick={handleCloseModal}>
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
                                    <div className={`${styles.textboxLeft}`}>Display Name</div>
                                    <div className={`${styles.textboxRight}`}>
                                        <input
                                            type="text"
                                            id="Name"
                                            className={`form-control ${styles.formTextbox} ${error ? 'is-invalid' : ""}`}
                                            placeholder=" "
                                            value={displayName}
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
                            onClick={handleSave}
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

export default AddTask