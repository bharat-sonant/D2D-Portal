import styles from "../../../src/assets/css/TaskDetails/DeleteSubTask.module.css";
import { images } from "../../assets/css/imagePath";

function PunchOutAlert(props) {

    return (
        <>
            {props.show && (
                <div className={`${styles.overlay}`}>
                    <div className={`${styles.modal}`}>
                        <div className={`${styles.actionBtn}`}>
                            <p className={`${styles.headerText}`}>Alert</p>
                            <button onClick={props.handleClose} className={`${styles.closeBtn}`}>
                                <img
                                    src={images.iconClose}
                                    className={`${styles.iconClose}`}
                                    title="Close"
                                    alt="icon"
                                />
                            </button>
                        </div>

                        <div className={`${styles.modalBody}`}>
                            <div className={styles.modelContentCenter}>


                                <p className={styles.textbox} style={{ fontSize: '14px', fontFamily: 'Graphik-Regular' }}>
                                    {props.dailyWorkedHrs === "" ? (
                                        <>
                                            ❗You have not completed 9 working hours yet.<br />
                                            You’ve completed {props.workedHrs.workedTime} so far.<br />
                                            {props.workedHrs.remainingTime} are remaining to complete 9 hours.
                                        </>
                                    ) : (
                                        <>
                                            ❗You have not completed 3 hours of work yet.<br />
                                              You’ve completed {props.dailyWorkedHrs} so far.<br />
                                        </>
                                    )}
                                </p>



                            </div>
                            <button className={`${styles.applyleavebutton}`} onClick={() => props.handlePunchInOutClick(true)} >
                                {props.buttonLoading ? (
                                    <div className={styles.spinnerContainer}>
                                        <div className={`spinner-border ${styles.borderSpinner}`} role="status" />
                                    </div>
                                ) : (
                                    <>

                                        <div className={styles.btnText}>Punch Out Anyway</div>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PunchOutAlert;
