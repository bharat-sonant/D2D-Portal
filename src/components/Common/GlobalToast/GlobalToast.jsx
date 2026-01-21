import { useEffect, useState } from "react";
import styles from "./GlobalToast.module.css";

export default function Toast({ message, type, duration, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]} ${exiting ? styles.exit : ""}`}>
      <div className={styles.iconWrapper}>{getIcon(type)}</div>
      <p className={styles.message}>{message}</p>

      <button
        className={styles.closeBtn}
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 400);
        }}
      >
        ✕
      </button>

      <div className={styles.progressBar} />
    </div>
  );
}

function getIcon(type) {
  if (type === "success") return "✔";
  if (type === "error") return "✖";
  if (type === "info") return "ℹ";
  return "✔";
}
