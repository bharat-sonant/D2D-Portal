import React, { useState } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { Plus, Minus } from "lucide-react";

const DriverHelperDetails = ({
  driverId,
  setDriverId,
  driverDeviceId,
  setDriverDeviceId,
  helperId,
  setHelperID,
  helperDeviceId,
  setHelperDeviceId,
  errors={},
  setErrors
}) => {
  const [extraHelpers, setExtraHelpers] = useState([]);

  const handleAddHelper = () => {
    setExtraHelpers((prev) => [...prev, { helperId: "" }]);
  };

  const handleRemoveHelper = (index) => {
    setExtraHelpers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleHelperChange = (index, field, value) => {
    const updated = [...extraHelpers];
    updated[index][field] = value;
    setExtraHelpers(updated);
  };

    const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

   const handleNumericChange = (setter, fieldName) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // digits only
    setter(numericValue);
    clearError(fieldName);
  };

  return (
    <div>
      <div className={styles.idFieldsCard}>
        {/* Driver ID */}
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Driver ID</label>
          <input
            type="text"
            inputMode="numeric"
  pattern="[0-9]*"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={driverId}
            onChange={handleNumericChange(setDriverId, "driverId")}
          />
          {errors.driverId && (
            <span className={styles.errorText}>{errors.driverId}</span>
          )}
        </div>

        {/* Driver Device ID */}
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Device ID</label>
          <div className={styles.deviceInputWrapper}>
            <span className={styles.devicePrefix}>DEV</span>
            <input
             type="text"
            inputMode="numeric"
  pattern="[0-9]*"
              className={styles.deviceInput}
              placeholder="Device ID"
              value={driverDeviceId}
              onChange={handleNumericChange(setDriverDeviceId, "driverDeviceId")}
            />
          </div>
          {errors.driverDeviceId && (
            <span className={styles.errorText}>{errors.driverDeviceId}</span>
          )}
        </div>

        {/* Helper 1 */}
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Helper ID</label>
          <input
            type="text"
            inputMode="numeric"
  pattern="[0-9]*"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={helperId}
            onChange={handleNumericChange(setHelperID, "helperId")}
          />
          {errors.helperId && (
            <span className={styles.errorText}>{errors.helperId}</span>
          )}
        </div>

        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Device ID</label>
          <div className={styles.deviceInputWrapper}>
            <span className={styles.devicePrefix}>DEV</span>
            <input
              type="text"
            inputMode="numeric"
  pattern="[0-9]*"
              className={styles.deviceInput}
              placeholder="Device ID"
              value={helperDeviceId}
               onChange={handleNumericChange(setHelperDeviceId, "helperDeviceId")}
            />
          </div>
          {errors.helperDeviceId && (
            <span className={styles.errorText}>{errors.helperDeviceId}</span>
          )}
        </div>

        {/* Extra Helpers */}
        {extraHelpers.map((h, index) => (
          <React.Fragment key={index}>
            <div className={`${styles.fieldColumn} ${styles.extraHelperRow}`}>
              <label className={styles.fieldLabel}>Helper ID</label>
              <input
                type="text"
            inputMode="numeric"
  pattern="[0-9]*"
                className={styles.textInput}
                placeholder="Enter Employee ID"
                value={h.helperId}
                 onChange={(e) =>
                  handleHelperChange(
                    index,
                    "helperId",
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
              />
            </div>
            <div className={`${styles.fieldColumn} ${styles.extraHelperRow}`}>
              <label className={styles.fieldLabel}>Device ID</label>
              <div className={styles.notApplicableBox}>Not Applicable</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtonsWrapper}>
        {extraHelpers.length > 0 && (
          <button
            className={`${styles.addButton} ${styles.removeButton}`}
            onClick={() => handleRemoveHelper(extraHelpers.length - 1)}
          >
            <span className={styles.iconCircle}>
              <Minus size={14} color="#dc2626" />
            </span>
            Remove Helper
          </button>
        )}

        <div className={styles.actionButtonsRight}>
          <button className={styles.addButton} onClick={handleAddHelper}>
            <span className={styles.iconCircle}>
              <Plus size={14} color="#00b300" />
            </span>
            Add Helper
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverHelperDetails;
