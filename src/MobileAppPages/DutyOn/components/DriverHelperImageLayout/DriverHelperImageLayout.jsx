import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import styles from '../../styles/DriverHelperImageLayout.module.css'
import * as common from '../../../../common/common'
import { saveDriverHelperImage } from '../../../services/DutyOnService/DutyOn'

const DriverHelperImageLayout = (props) => {
  const driverInputRef = useRef(null);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (type === "driverImage") {
        props.setDriverImage(event.target.result);
        clearError(type);
        // ===== Auto Upload =====
        await handleSave(event.target.result);
      }
    };

    reader.readAsDataURL(file);
  };


  const openCamera = () => {
    setTimeout(() => {
      if (driverInputRef.current) {
        driverInputRef.current.click();
      }
    }, 100);
  };

  const clearError = (fieldName) => {
    if (props.errors[fieldName]) {
      props.setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleSave = async (imgData) => {
    const finalImage = imgData || props.driverImage;
    try {

      const blob = await fetch(finalImage).then(res => res.blob());
      const selectedWard = props.ward !== 'N/A' ? props.ward : 'Bharat';
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const monthName = now.toLocaleString("default", { month: "long" });
      const date = String(now.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${date}`;
      const result = await saveDriverHelperImage(
        selectedWard,
        year,
        monthName,
        formattedDate,
        blob
      );
      if (result === 'fail') {
        common.setAlertMessage("error", "Image upload failed, please recapture.");
      }
    } catch (error) {
      console.error(error);
      common.setAlertMessage("error", "Image upload failed, please recapture.");
    }
  };



  return (
    <>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.imgTitle}>Driver & Helper</div>

          <div className={styles.imageBox}>
            {props.driverImage ? (
              <div className={styles.imageWrapper}>
                <img src={props.driverImage} alt="Driver" className={`${styles.image}`}
                />
                <button type="button" className={styles.closeBtn} onClick={openCamera} >
                  Retake
                </button>
              </div>
            ) : (
              <div
                className={styles.imageBoxText}
                onClick={openCamera}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  openCamera();
                }}
              >
                <Camera className={styles.cameraIcon} />
                <h3 className={styles.heading}>Click to capture</h3>
              </div>

            )}

          </div>
          {props.errors.driverImage && (
            <span className={styles.errorText}>{props.errors.driverImage}</span>
          )}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={driverInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "driverImage")}
          />
        </div>
      </div>
    </>
  );
};

export default DriverHelperImageLayout;
