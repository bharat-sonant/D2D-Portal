
import styles from "../../../src/assets/css/TaskDetails/DeleteSubTask.module.css";
import { images } from "../../assets/css/imagePath";
import { imagesRefPath } from '../../common/imagesRef/imagesRefPath';

function IsOwnerAlert(props) {
  
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
                                <img
                                    src={images.errorImg}
                                    className={styles.errorImg}
                                    title="Close"
                                    alt="icon"
                                />
                                <p className={styles.textbox} style={{fontSize:'14px',fontFamily:'Graphik-Regular'}}>
                                You cannot deactivate the owner.
                                </p>
                               
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default IsOwnerAlert;
