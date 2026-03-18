import React from "react";
import styles from "./VehicleAssignmentModal.module.css";

const VehicleAssignmentModal = ({ vehicleIssueRows, onRowChange, onSubmit }) => {
  return (
    <div className={styles.vehicleIssueWrap}>
      <div className={styles.vehicleIssueList}>
        {vehicleIssueRows.map((item) => (
          <div key={item.id} className={styles.vehicleIssueRow}>
            <div className={styles.vehicleIssueNoCol}>
              <div className={styles.vehicleIssueNo}>{item.vehicleNo}</div>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={(e) => onRowChange(item.id, "selected", e.target.checked)}
              />
            </div>
            <textarea
              className={styles.vehicleIssueReason}
              placeholder="Write reason..."
              value={item.reason}
              onChange={(e) => onRowChange(item.id, "reason", e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="button" className={styles.modalSubmitBtn} onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

export default VehicleAssignmentModal;
