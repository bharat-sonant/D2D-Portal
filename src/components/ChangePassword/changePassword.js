import React, { useState } from "react";
import styles from "../../assets/css/modal.module.css"
import { images } from "../../assets/css/imagePath";
import { FaSpinner } from "react-icons/fa";
import { changePasswordAction } from "../../Actions/ChangePassword/ChangePasswordAction"

const ChangePassword = ({ onClose, showChangePassword, setShowChangePassword }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    const userId = localStorage.getItem("userId");

    await changePasswordAction(
      userId,
      oldPassword,
      newPassword,
      setLoading,
      setError,
      () => {
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
                    error ? styles.errorInput : ""
                  }`}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
            </div>
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
                    error ? styles.errorInput : ""
                  }`}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
            </div>
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
                    error ? styles.errorInput : ""
                  }`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

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

