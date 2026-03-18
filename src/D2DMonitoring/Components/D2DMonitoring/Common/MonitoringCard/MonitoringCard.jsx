import React from "react";
import styles from "./MonitoringCard.module.css";

/**
 * MonitoringCard – global card wrapper for all dashboard cards.
 * Props:
 *   title        – card header title (string)
 *   icon         – right-side icon node
 *   headerRight  – extra node in header (e.g. Add button)
 *   customHeader – replaces standard header entirely (for special top rows)
 *   noPadding    – removes body padding (for custom layouts)
 *   footer       – fixed footer node
 *   className    – extra class on root
 *   bodyClassName– extra class on body
 *   children     – body content
 */
const MonitoringCard = ({
  title,
  icon,
  headerRight,
  customHeader,
  noPadding = false,
  footer,
  className = "",
  bodyClassName = "",
  children,
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {customHeader ? (
        <div className={styles.customHeaderWrap}>{customHeader}</div>
      ) : title ? (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <div className={styles.cardHeaderRight}>
            {headerRight}
            {icon && <span className={styles.cardIcon}>{icon}</span>}
          </div>
        </div>
      ) : null}

      <div
        className={`${styles.cardBody} ${noPadding ? styles.noPadding : ""} ${bodyClassName}`}
      >
        {children}
      </div>

      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </div>
  );
};

export default MonitoringCard;
