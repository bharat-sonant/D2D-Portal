import { useEffect, useState } from "react";
import styles from "./GlobalToast.module.css";
import { Check, X, Info } from "lucide-react";

export default function Toast({ title, message, type, duration, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 4000);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toastContainer}`}>
      <div
        className={`${styles.toast} ${styles[type]} ${exiting ? styles.exit : ""}`}
      >
        <div className={styles.toastLeft}>
          <div className={styles.iconWrapper}>{getIcon(type)}</div>
          <div className={styles.toastContent}>
            <div className={styles.title}>{title}</div>
            <p className={styles.message}>{message}</p>
          </div>
        </div>
        <button
          className={styles.closeBtn}
          onClick={() => {
            setExiting(true);
            setTimeout(onClose, 4000);
          }}
        >
          ✕
        </button>

        <div className={styles.progressBar} />
      </div>
    </div>
  );
}

function getIcon(type) {
  const iconProps = { size: 20, strokeWidth: 2 };

  if (type === "success") return <Check {...iconProps} />;
  if (type === "error") return <X {...iconProps} />;
  if (type === "info") return <Info {...iconProps} />;

  return <Check {...iconProps} />;
}
