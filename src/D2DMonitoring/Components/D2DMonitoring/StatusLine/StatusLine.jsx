import React from "react";
import { ChevronRight } from "lucide-react";
import styles from "./StatusLine.module.css";

const StatusLine = ({ label, value, icon, color, onClick }) => (
  <button
    type="button"
    className={`${styles.statusLine} ${onClick ? styles.statusLineClickable : ""}`}
    onClick={onClick}
  >
    <div className={styles.statusLineLeft}>
      <div className={styles.statusLineIconWrap}>{icon}</div>
      <span className={styles.statusLabel}>{label}</span>
    </div>
    <div className={styles.statusLineRight}>
      <span className={styles.statusValue} style={{ color }}>
        {value}
      </span>
      {onClick && (
        <span className={styles.statusClickIndicator}>
          <ChevronRight size={14} />
        </span>
      )}
    </div>
  </button>
);

export default StatusLine;
