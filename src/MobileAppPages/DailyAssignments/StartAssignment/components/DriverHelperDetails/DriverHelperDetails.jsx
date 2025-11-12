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

  const handleAddOpenDepot = () => {
    // TODO: logic for open depot
  };

  return (
    <div>
      <div className={styles.idFieldsCard}>
        {/* Driver ID */}
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Driver ID</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={driverId}
            onChange={(e) => {
              setDriverId(e.target.value);
              clearError("driverId");
            }}
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
              className={styles.deviceInput}
              placeholder="Device ID"
              value={driverDeviceId}
              onChange={(e) => {setDriverDeviceId(e.target.value)
                clearError("driverDeviceId");
              }}
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
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={helperId}
            onChange={(e) => {setHelperID(e.target.value)
              clearError("helperId"); }
            }
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
              className={styles.deviceInput}
              placeholder="Device ID"
              value={helperDeviceId}
              onChange={(e) => {setHelperDeviceId(e.target.value)
                  clearError("helperDeviceId");
              }}
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
                className={styles.textInput}
                placeholder="Enter Employee ID"
                value={h.helperId}
                onChange={(e) =>
                  handleHelperChange(index, "helperId", e.target.value)
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
