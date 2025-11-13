import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import styles from "../../styles/DriverHelperImageLayout/DriverHelperImageLayout.module.css";
import { images } from "../../../../../assets/css/imagePath";

const DriverHelperImageLayout = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.imgTitle}>Driver & Helper</div>

        <div
          className={styles.imageBox}
          onClick={openCamera}
          onTouchEnd={(e) => {
            e.preventDefault();
            openCamera();
          }}
        >
          {driverImage ? (
            <div className={styles.imageWrapper}>
              <img src={driverImage} alt="Driver" className={styles.image} />
              <button
                type="button"
                className={styles.closeBtn}
                onClick={removeImage}
              >
                <img src={images.iconClose} className={styles.iconClose} title="close" alt="Icon Close" />
              </button>
            </div>
          ) : (
            <div className={styles.imageBoxText}>
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
  );
};

export default DriverHelperImageLayout;
