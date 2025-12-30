import React from "react";
import styles from "./ErrorMessage.module.css";
import { AlertTriangle } from "lucide-react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className={styles.errorWrapper}>
      <div className={styles.errorIcon}>
        <AlertTriangle size={18} />
      </div>
      <p className={styles.errorText}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
