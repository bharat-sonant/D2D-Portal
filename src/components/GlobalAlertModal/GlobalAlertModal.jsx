import { AlertTriangle, Check, X } from "lucide-react";
import styles from "./GlobalAlertModal.module.css";
import { useEffect } from "react";

const GlobalAlertModal = ({
  show,
  title = "Confirmation",
  message,
  userName,
  warningText,
  successText,
  buttonText,
  buttonGradient,
  iconType = "warning", // warning | success
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) return null;
  
  const isSuccess = iconType === "success";

  const Icon = iconType === "warning" ? AlertTriangle : Check;

  return (
    <div className={styles.overlay}>
      {/* Background Orbs */}
      <div
        className={`${styles.modalBackground} ${isSuccess ? styles.successBackground : styles.warningBackground
          }`}
      >
        <div
          className={`${styles.modalOrb} ${isSuccess ? styles.successOrb1 : styles.modalOrb1
            }`}
        />
        <div
          className={`${styles.modalOrb} ${isSuccess ? styles.successOrb2 : styles.modalOrb2
            }`}
        />
        <div
          className={`${styles.modalOrb} ${isSuccess ? styles.successOrb3 : styles.modalOrb3
            }`}
        />
      </div>

      {/* Particles */}
      <div className={styles.modalParticles}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`${styles.modalParticle} ${isSuccess ? styles.successParticle : styles.warningParticle
              }`}
          />
        ))}
      </div>

      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <X size={18} />
        </button>
        <div className={styles.iconWrapper}>
          <div
            className={`${styles.iconRing} ${isSuccess ? styles.successRing : styles.warningRing
              }`}
          ></div>

          <div
            className={`${styles.iconRing2} ${isSuccess ? styles.successRing2 : styles.warningRing2
              }`}
          ></div>

          <div
            className={`${styles.iconCircle} ${isSuccess ? styles.iconSuccess : styles.iconWarning
              }`}
          >
            <Icon size={30} />
          </div>
        </div>

        <h2
          className={`${styles.title} ${isSuccess ? styles.successTitle : styles.warningTitle
            }`}
        >
          {title}
        </h2>

        <p className={styles.message}>
          {message}{" "}
          <strong
            className={isSuccess ? styles.successName : styles.warningName}
          >
            {userName}
          </strong>
          ?
        </p>

        {/* 👇 Conditional Text */}
        {iconType === "warning" && warningText && (
          <p className={styles.warningText}>{warningText}</p>
        )}

        {iconType === "success" && successText && (
          <p className={styles.successText}>{successText}</p>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>

          {/* <button
            className={styles.actionBtn}
            style={{ background: buttonGradient }}
            onClick={onConfirm}
          >
            {buttonText}
          </button> */}
          <button
            className={`${styles.actionBtn} ${isSuccess ? styles.activateBtn : styles.deactivateBtn
              }`}
            onClick={onConfirm}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalAlertModal;
