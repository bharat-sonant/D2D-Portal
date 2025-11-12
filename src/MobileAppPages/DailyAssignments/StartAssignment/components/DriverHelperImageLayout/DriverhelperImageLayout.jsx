import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import styles from "../../styles/DriverHelperImageLayout/DriverHelperImageLayout.module.css";

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

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div
          className={styles.imageBox}
          onClick={openCamera}
          onTouchEnd={(e) => {
            e.preventDefault();
            openCamera();
          }}
        >
          {driverImage ? (
            <img src={driverImage} alt="Driver" className={styles.image} />
          ) : (
            <div className={styles.imageBoxText}>
              <Camera className={styles.cameraIcon} />
              <h3 className={styles.heading}>
                Please capture <br /> driver and helper photo
              </h3>
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
