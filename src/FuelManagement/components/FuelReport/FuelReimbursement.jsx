import React, { useState } from "react";
import styles from "./FuelReimbursement.module.css";
import { X } from "lucide-react";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const FuelReimbursement = ({ open, onClose, data }) => {
  const [reimburseNum, setReimburseNum] = useState(null);
  const [reimburseError, setReimburseError] = useState("");
  if (!open) return null;

  const handleSave = () => {
    if(!reimburseNum) {
      setReimburseError("Please enter Reimbursement Number");
      return;
    }

    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Fuel Reimbursement</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Images */}
        <div className={styles.imageRow}>
          <div className={styles.imageBox}>
            <div className={styles.imageTitle}>Slip Image</div>
            <img
              src={data?.slipImage}
              alt="Slip"
              className={styles.image}
            />
          </div>

          <div className={styles.imageBox}>
            <div className={styles.imageTitle}>Meter Reading Image</div>
            <img
              src={data?.meterImage}
              alt="Meter"
              className={styles.image}
            />
          </div>
        </div>

        {/* Info Row */}
        <div className={styles.infoRow}>
          <div>
            <span className={styles.label}>Fuel Type</span>
            <span className={styles.value}>{data?.fuelType}</span>
          </div>
          <div>
            <span className={styles.label}>Quantity</span>
            <span className={styles.value}>{data?.qty}</span>
          </div>
          <div>
            <span className={styles.label}>Amount</span>
            <span className={styles.value}>₹{data?.amount}</span>
          </div>
        </div>

        {/* Reimbursement Number */}
        <div className={styles.inputGroup}>
          <label>
            Reimbursement Number <span className={styles.required}>*</span>
          </label>

          <div className={styles.reimInput}>
            <span className={styles.prefix}>ER-</span>
            <input type="text" placeholder="Enter reimbursement number" />
          </div>
           {reimburseError && (
          <ErrorMessage message={reimburseError}/>
        )}
        </div>
       

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelReimbursement;
