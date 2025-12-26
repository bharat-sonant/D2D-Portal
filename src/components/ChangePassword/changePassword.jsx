import React, { useState } from "react";
import styles from "../../assets/css/modal.module.css";
import { images } from "../../assets/css/imagePath";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { changePasswordAction } from "../../Actions/ChangePassword/ChangePasswordAction";
import { setAlertMessage } from "../../common/common";
import changePassStyle from "../../components/ChangePassword/ChangePassword.module.css";
import { getPasswordChecks, getPasswordStrength } from "../../common/common";

const ChangePassword = ({ onClose, showChangePassword, setShowChangePassword }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔹 Strong password regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

  // #* ADDED: live password checks (UI only, validation unchanged)
  const passwordChecks = getPasswordChecks(newPassword); // #*
  const passwordStrength = getPasswordStrength(passwordChecks); // #*

  const resetFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setSuccessMessage("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetFields();
    setShowChangePassword(false);
  };

  const handleChangePassword = async () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setSuccessMessage("");

    let hasError = false;

    if (!oldPassword) {
      setOldPasswordError("Old password is required");
      hasError = true;
    }

    if (!newPassword) {
      setNewPasswordError("New password is required");
      hasError = true;
    } else if (!strongPasswordRegex.test(newPassword)) {
      setNewPasswordError(
        "Password must be 8–20 characters and include uppercase, lowercase, number and special character (@ $ ! % * ? & #)"
      );
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
        const msg = errorMsg?.toLowerCase() || "";
        if (msg.includes("same as current")) {
          setNewPasswordError(errorMsg);
        } else if (msg.includes("current") || msg.includes("old")) {
          setOldPasswordError(errorMsg);
        } else {
          setNewPasswordError(errorMsg);
        }
      },
      () => {
        setAlertMessage("success", "Password updated successfully");
        setTimeout(handleClose, 1500);
      }
    );
  };

  if (!showChangePassword) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Change Password</p>
          <button className={styles.closeBtn} onClick={handleClose}>
            <img src={images.iconClose} className={styles.iconClose} alt="close" />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Old Password */}
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft} style={{ width: "146px" }}>
                Old Password
              </div>
              <div className={styles.textboxRight} style={{ position: "relative" }}>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className={`form-control ${styles.formTextbox} ${oldPasswordError ? styles.errorInput : ""
                    }`}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (oldPasswordError) setOldPasswordError("");
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
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
              <div className={styles.textboxRight} style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`form-control ${styles.formTextbox} ${newPasswordError ? styles.errorInput : ""
                    }`}
                  placeholder="Enter new password"
                  value={newPassword}
                  onFocus={() => setShowPasswordHint(true)}
                  onBlur={() => setShowPasswordHint(false)}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) setNewPasswordError("");
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {/* 🔔 Password suggestion alert */}
            {showPasswordHint && (
              <div className={changePassStyle.passwordHintBox}>
                <ul>
                  <li className={passwordChecks.length ? changePassStyle.valid : changePassStyle.invalid}>
                    {passwordChecks.length ? "✔️" : "❌"} 8–20 characters
                  </li>
                  <li className={passwordChecks.uppercase ? changePassStyle.valid : changePassStyle.invalid}>
                    {passwordChecks.uppercase ? "✔️" : "❌"} Uppercase letter
                  </li>
                  <li className={passwordChecks.lowercase ? changePassStyle.valid : changePassStyle.invalid}>
                    {passwordChecks.lowercase ? "✔️" : "❌"} Lowercase letter
                  </li>
                  <li className={passwordChecks.number ? changePassStyle.valid : changePassStyle.invalid}>
                    {passwordChecks.number ? "✔️" : "❌"} Number
                  </li>
                  <li className={passwordChecks.special ? changePassStyle.valid : changePassStyle.invalid}>
                    {passwordChecks.special ? "✔️" : "❌"} Special character
                  </li>
                </ul>

                <div className={changePassStyle.strengthBar}>
                  <div
                    className={changePassStyle.strengthFill}
                    style={{ width: `${passwordStrength.percent}%` }}
                  />
                </div>
                <small>{passwordStrength.label}</small>
              </div>
            )}
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
              <div className={styles.textboxRight} style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${styles.formTextbox} ${confirmPasswordError ? styles.errorInput : ""
                    }`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError)
                      setConfirmPasswordError("");
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {confirmPasswordError && (
              <div className={styles.errorMessage}>
                {confirmPasswordError}
              </div>
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
