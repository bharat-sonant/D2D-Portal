import React from 'react';
import styles from '../../assets/css/Employee/AddConfirmationModel.module.css';
import { images } from "../../assets/css/imagePath";
const AddConfirmationModel = ({ show, setShowCanvas, setOpenConfirmationWindow }) => {

    const handleAddMore = () => {
        setShowCanvas(true)
        setOpenConfirmationWindow(pre => ({ ...pre, status: false, data: null }));
    }

    const handleClose = () => {
        setShowCanvas(false)
        setOpenConfirmationWindow(pre => ({ ...pre, status: false, data: null }));
    }
    if (!show) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.actionBtn}>
                    <p className={styles.headerText}>Add Employee</p>
                    <button
                        className={styles.closeBtn}
                        onClick={handleClose}
                    >
                        <img
                            src={images.iconClose}
                            className={styles.iconClose}
                            title="Close"
                            alt="icon"
                        />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.textbox}>
                        Employee created successfully and login details has been sent to
                        <span style={{ fontSize: '15px',fontWeight:'bold' }}> {show?.data || ''}</span>
                    </p>

                    <div className="row g-3 justify-content-center">
                        <div className="col-md-4 mt-3">
                            <button
                                type="button"
                                className={`${styles.btnSave}  `}
                                onClick={handleAddMore}
                            >
                                Add More
                            </button>

                        </div>
                        <div className="col-md-4 mt-3">
                            <button
                                type="button"
                                className={`${styles.btnDanger}  `}
                                onClick={handleClose}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddConfirmationModel;

