import React from "react";
import styles from "../../../src/assets/css/modal.module.css";
import { images } from "../../assets/css/imagePath";
import { FaSpinner } from "react-icons/fa";

function DeleteDialog({
    show,
    handleClose,
    handleDelete,
    message,
    title,
    loader,
    heading,
    short
}) {
    return (
        <>
            {show && (
                <div className={`${styles.overlay}`} >
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
                                    src={images.errorImg}
                                    className={styles.errorImg}
                                    title="Close"
                                    alt="icon"
                                />
   <p className={styles.heading} >{title}</p>
                                <p className={styles.textbox}>
                                    {message}
                                </p>
                                <p className={styles.textbox}>
                                    {short}
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
                                    onClick={handleDelete}
                                    className={`${styles.btnDelete}  `}
                                    disabled={loader === true}
                                    style={loader ? { width: "100%" } : {}}
                                >
                                    {loader ? (
                                        <div className={styles.Loginloadercontainer} style={{ justifyContent: 'center' }}>
                                            <FaSpinner className={styles.spinnerLogin} />
                                            <span className={styles.loaderText} >
                                                Please wait...
                                            </span>
                                        </div>
                                    ) : (
                                        "Yes, Delete"
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

export default DeleteDialog;
