import React from "react";
import styles from "../assets/css/modal.module.css";
import { images } from "../assets/css/imagePath";
import { FaSpinner } from "react-icons/fa";

const ConfirmationDialog = ({
    show,
    handleClose,
    handleConfirm,
    message,
    title,
    loader,
    heading,
    SubMesg
}) => {
    return (
        <>
            {show && (
                <div className={`${styles.overlay}`}>
                    <div className={`${styles.modal} ${styles.bodyModal}`}>
                        {/* <div className={`${styles.actionBtn}`}>
                            <p className={`${styles.headerText}`}>{heading}</p>

                            <button onClick={handleClose} className={`${styles.closeBtn}`}>
                                <img
                                    src={images.iconClose}
                                    className={`${styles.iconClose}`}
                                    title="Close"
                                    alt="icon"
                                />
                            </button>
                        </div> */}

                        <div className={`${styles.modalBody}`}>
                            <div className={styles.modelContentCenter}>
                                <img
                                    src={images.IconConfirm}
                                    className={styles.errorImg}
                                    title="Close"
                                    alt="icon"
                                />
                                <p className={styles.heading} >{title}</p>
                                <p className={styles.textbox}>
                                    {message}
                                </p>
                                <p className={styles.textbox}>
                                    {SubMesg}
                                </p>
                            </div>
                            <div className={styles.action}>
                               

                                {!loader && (
                                    <button
                                        type="button"
                                        className={`${styles.btnSuccess}  `}
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>
                                )}

                                 <button
                                    type="submit"
                                    onClick={handleConfirm}
                                    className={`${styles.btnConfirm}`}
                                    disabled={loader === true}
                                     style={loader ? { width: "100%" } : {}}
                                >

                                    { loader ? (
                                        <div className={styles.Loginloadercontainer} style={{ justifyContent: 'center' }}>
                                            <FaSpinner className={styles.spinnerLogin} />
                                            <span className={styles.loaderText} >
                                                Please wait...
                                            </span>
                                        </div>
                                    ) : (
                                        "Confirm"
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConfirmationDialog;
