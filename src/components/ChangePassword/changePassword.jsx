import React, { useState } from "react";
import styles from "../../assets/css/modal.module.css";
import { images } from "../../assets/css/imagePath";
import { FaSpinner } from "react-icons/fa";
import { changePasswordAction } from "../../Actions/ChangePassword/ChangePasswordAction";

const ChangePassword = ({ onClose, showChangePassword, setShowChangePassword }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 Individual errors (instead of one common error)
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    // clear previous errors
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!oldPassword) {
      setOldPasswordError("Old password is required");
      hasError = true;
    }

    if (!newPassword) {
      setNewPasswordError("New password is required");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      hasError = true;
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("New password and confirm password do not match");
      hasError = true;
    }

    if (hasError) return;

    const userId = localStorage.getItem("userId");

    await changePasswordAction(
      userId,
      oldPassword,
      newPassword,
      setLoading,
      (errorMsg) => {
        // 🔹 Map backend error to correct field
        if (errorMsg?.toLowerCase().includes("current") || errorMsg?.toLowerCase().includes("old")) {
          setOldPasswordError(errorMsg);
        } else if (errorMsg?.toLowerCase().includes("same")) {
          setNewPasswordError(errorMsg);
        } else {
          setNewPasswordError(errorMsg);
        }
      },
      () => {
        // ✅ success (same behaviour)
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(false);
      }
    );
  };

  if (!showChangePassword) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Change Password</p>
          <button
            className={styles.closeBtn}
            onClick={() => setShowChangePassword(false)}
          >
            <img
              src={images.iconClose}
              className={styles.iconClose}
              alt="close"
            />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Old Password */}
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft} style={{ width: "146px" }}>
                Old Password
              </div>
              <div className={styles.textboxRight}>
                <input
                  type="password"
                  className={`form-control ${styles.formTextbox} ${
                    oldPasswordError ? styles.errorInput : ""
                  }`}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (oldPasswordError) setOldPasswordError("");
                  }}
                />
              </div>
            </div>
            {oldPasswordError && (
              <div className={styles.errorMessage}>{oldPasswordError}</div>
            )}
          </div>

          {/* New Password */}
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft} style={{ width: "146px" }}>
                New Password
              </div>
              <div className={styles.textboxRight}>
                <input
                  type="password"
                  className={`form-control ${styles.formTextbox} ${
                    newPasswordError ? styles.errorInput : ""
                  }`}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) setNewPasswordError("");
                  }}
                />
              </div>
            </div>
            {newPasswordError && (
              <div className={styles.errorMessage}>{newPasswordError}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft} style={{ width: "146px" }}>
                Confirm Password
              </div>
              <div className={styles.textboxRight}>
                <input
                  type="password"
                  className={`form-control ${styles.formTextbox} ${
                    confirmPasswordError ? styles.errorInput : ""
                  }`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                />
              </div>
            </div>
            {confirmPasswordError && (
              <div className={styles.errorMessage}>{confirmPasswordError}</div>
            )}
          </div>

          <button
            type="button"
            className={`mt-3 ${styles.btnSave}`}
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.Loginloadercontainer}>
                <FaSpinner className={styles.spinnerLogin} />
                <span className={styles.loaderText}>Please wait...</span>
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
