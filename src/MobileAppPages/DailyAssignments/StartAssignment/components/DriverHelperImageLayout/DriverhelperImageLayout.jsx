import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import styles from "../../styles/DriverHelperImageLayout/DriverHelperImageLayout.module.css";
import { images } from "../../../../../assets/css/imagePath";
import * as common from '../../../../../common/common'
import { saveDriverHelperImage } from "../../../../services/StartAssignmentService/StartAssignment";

const DriverHelperImageLayout = (props) => {
  const [driverImage, setDriverImage] = useState(null);
  const driverInputRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === "driver") {
        setDriverImage(event.target.result);
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

  const removeImage = (e) => {
    e.stopPropagation(); // prevent re-opening camera
    setDriverImage(null);
    if (driverInputRef.current) {
      driverInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!driverImage) {
      common.setAlertMessage('error', "Please capture driver/helper image first");
      return;
    }

    try {
      const blob = await fetch(driverImage).then(res => res.blob());
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
      if (result.status === 'success') {
        common.setAlertMessage("success", result.message);
        setDriverImage(null);
        if (driverInputRef.current) {
          driverInputRef.current.value = "";
        };
      };
    } catch (error) {
      console.error(error);
      common.setAlertMessage("error", "Failed to upload image");
    }
  };


  return (
    <>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.imgTitle}>Driver & Helper</div>

          <div className={styles.imageBox}>
            {driverImage ? (
              <div className={styles.imageWrapper}>
                <img src={driverImage} alt="Driver" className={styles.image} />
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={openCamera}
                >
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

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={driverInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "driver")}
          />
        </div>
      </div>
      <button className={styles.saveBtn} onClick={handleSave} >Save</button>
    </>
  );
};

export default DriverHelperImageLayout;
