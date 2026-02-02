import styles from "./globalOffcanvas.module.css";
import { X } from "lucide-react";

const GlobalOffcanvas = ({ open, onClose, title, children, width = "500px" }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.show : ""}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`${styles.offcanvas} ${open ? styles.open : ""}`}
        style={{ width }}
      >
        {/* Header */}
        <div className={styles.OffcanvasHeader}>
          <div className={styles.OffcanvasTitle}>{title}</div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.OffcanvasBody}>{children}</div>
      </div>
    </>
  );
};

export default GlobalOffcanvas;
