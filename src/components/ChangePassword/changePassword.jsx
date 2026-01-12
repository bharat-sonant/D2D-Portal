import React, { useState } from "react";
import styles from "../../assets/css/popup.module.css";
import { Lock, Eye, EyeOff, Shield, X, Check } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { changePasswordAction } from "../../Actions/ChangePassword/ChangePasswordAction";
import { setAlertMessage } from "../../common/common";
import { getPasswordChecks, getPasswordStrength } from "../../common/common";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const ChangePassword = ({
  onClose,
  showChangePassword,
  setShowChangePassword,
}) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleChangePassword();
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
        setAlertMessage("success", "Password changed successfully");
        setTimeout(handleClose, 1500);
      }
    );
  };

  if (!showChangePassword) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <Shield className="shield-icon" />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Change Password</h2>
              <p className={styles.modalSubtitle}>
                Update your password to keep your account secure
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Old Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {/* <Lock size={16} /> */}
              Old Password
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <Lock size={18} />
              </div>
              <input
                className={styles.input}
                type={showOldPassword ? "text" : "password"}
                name="old_pass_field_obscured"
                autoComplete="off"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (oldPasswordError) setOldPasswordError("");
                }}
              />
              <button
                className={styles.eyeBtn}
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {oldPasswordError && (
              <div className={styles.errorMessage}>
                <ErrorMessage message={oldPasswordError} />
              </div>
            )}
          </div>

          {/* New Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {/* <Lock size={16} /> */}
              New Password
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <Lock size={18} />
              </div>
              <input
                className={styles.input}
                type={showNewPassword ? "text" : "password"}
                name="new_pass_field_obscured"
                autoComplete="off"
                placeholder="Enter new password"
                value={newPassword}
                onBlur={() => setShowPasswordHint(false)}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewPassword(val);
                  if (newPasswordError) setNewPasswordError("");
                  if (val.length > 0) {
                    setShowPasswordHint(true);
                  } else {
                    setShowPasswordHint(false);
                  }
                }}
              />
              <button
                className={styles.eyeBtn}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* 🔔 Password suggestion alert */}
            {showPasswordHint && (
              <div className={styles.requirementsBox}>
                <div className={styles.requirementsBoxTitle}>
                  Password Requirements:
                </div>
                <ul>
                  <li
                    className={
                      passwordChecks.length ? styles.valid : styles.invalid
                    }
                  >
                    {passwordChecks.length ? (
                      <Check size={14} />
                    ) : (
                      <X size={14} />
                    )}{" "}
                    8–20 characters
                  </li>
                  <li
                    className={
                      passwordChecks.uppercase ? styles.valid : styles.invalid
                    }
                  >
                    {passwordChecks.uppercase ? (
                      <Check size={14} />
                    ) : (
                      <X size={14} />
                    )}{" "}
                    Uppercase letter
                  </li>
                  <li
                    className={
                      passwordChecks.lowercase ? styles.valid : styles.invalid
                    }
                  >
                    {passwordChecks.lowercase ? (
                      <Check size={14} />
                    ) : (
                      <X size={14} />
                    )}{" "}
                    Lowercase letter
                  </li>
                  <li
                    className={
                      passwordChecks.number ? styles.valid : styles.invalid
                    }
                  >
                    {passwordChecks.number ? (
                      <Check size={14} />
                    ) : (
                      <X size={14} />
                    )}{" "}
                    Number
                  </li>
                  <li
                    className={
                      passwordChecks.special ? styles.valid : styles.invalid
                    }
                  >
                    {passwordChecks.special ? (
                      <Check size={14} />
                    ) : (
                      <X size={14} />
                    )}{" "}
                    Special character
                  </li>
                </ul>

                <div className={styles.strengthBar}>
                  <div
                    className={styles.strengthFill}
                    style={{ width: `${passwordStrength.percent}%` }}
                  />
                </div>
                <small>{passwordStrength.label}</small>
              </div>
            )}
            {newPasswordError && (
              <div className={styles.errorMessage}>
                <ErrorMessage message={newPasswordError} />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {/* <Check size={16} /> */}
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <Lock size={18} />
              </div>
              <input
                className={styles.input}
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_pass_field_obscured"
                autoComplete="off"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError("");
                }}
              />
            </div>
            {confirmPasswordError && (
              <div className={styles.errorMessage}>
                <ErrorMessage message={confirmPasswordError} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className={styles.loaderWrap}>
                <div
                  className="spinner-border"
                  style={{ height: "18px", width: "18px", borderWidth: "2px" }}
                ></div>
              </span>
            ) : (
              <span
                className={`d-flex align-items-center gap-2 ${styles.btnContent}`}
              >
                <Shield size={18} />
                <span>Change Password</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
