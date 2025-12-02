import styles from '../../../../assets/css/modal.module.css';
import { images } from '../../../../assets/css/imagePath';

const AddTask = (props) => {

    const handleCloseModal = () => {
        props.setShowCanvas(false);
    }

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
                                            className={`form-control ${styles.formTextbox}`}
                                            placeholder=" "
                                        // value={name}
                                        // onChange={(e) =>
                                        //     handleInputChange("name", e.target.value)
                                        // }
                                        />
                                    </div>
                                </div>
                                {/* {nameError && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {nameError}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                    <div className={`col-md-12 p-0`}>
                        <button
                            type="submit"
                            className={`mt-3 ${styles.btnSave}`}
                        // onClick={() => savePeopleData()}
                        // disabled={isLoading}
                        >
                            {/* {isLoading ? (
                                <div className={styles.Loginloadercontainer}>
                                    <FaSpinner className={styles.spinnerLogin} />
                                    <span className={styles.loaderText}>Please wait...</span>
                                </div>
                            ) : (
                                "Save"
                            )} */}
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTask