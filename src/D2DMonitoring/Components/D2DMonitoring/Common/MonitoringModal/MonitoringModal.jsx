import React from "react";
import { X } from "lucide-react";
import styles from "./MonitoringModal.module.css";

/**
 * MonitoringModal – global modal shell for all monitoring modals.
 * Props:
 *   title      – modal title
 *   subtitle   – subtitle below title (optional)
 *   icon       – icon node beside title (optional)
 *   children   – scrollable body content
 *   footer     – fixed footer node (optional)
 *   onClose    – close handler
 *   width      – "sm" | "md" | "lg" | "xl"  (default: "md")
 *   className  – extra class on root shell
 */
const MonitoringModal = ({
  title,
  subtitle,
  icon,
  children,
  footer,
  onClose,
  width = "md",
  className = "",
}) => {
  return (
    <div
      className={`${styles.modalShell} ${styles[`width${width.charAt(0).toUpperCase() + width.slice(1)}`]} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Fixed Header */}
      <div className={styles.modalHeader}>
        <div className={styles.modalHeadLeft}>
          {icon && <span className={styles.modalIcon}>{icon}</span>}
          <div className={styles.modalTitleBlock}>
            <h3 className={styles.modalTitle}>{title}</h3>
            {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
          </div>
        </div>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className={styles.modalBody}>{children}</div>

      {/* Optional Fixed Footer */}
      {footer && <div className={styles.modalFooter}>{footer}</div>}
    </div>
  );
};

export default MonitoringModal;
