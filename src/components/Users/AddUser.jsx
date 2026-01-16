import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as common from "../../common/common";
import * as userAction from "../../Actions/UserAction/UserAction";
import modalStyles from "../../assets/css/popup.module.css";
import {
  UserRoundPlus,
  X,
  UserRound,
  Mail,
  UserRoundCheck,
  UserStar,
  Shield,
  Check,
} from "lucide-react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import GlobalSpinnerLoader from "../Common/Loader/GlobalSpinnerLoader";

const AddUser = (props) => {

  const initialForm = {
    name: "",
    email: "",
    status: "active",
    created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    password: "",
    user_type: "",
    emp_code: "",
  };
  const [form, setForm] = useState(initialForm);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [empCodeError, setEmpCodeError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.onEdit && props.editData) {
      const decryptedEmail = common.decryptValue(props.editData.email);
      setForm({ ...props?.editData, email: decryptedEmail });
    }
  }, [props?.onEdit, props?.editData]);

  if (!props.showCanvas) return null;

  const handleChange = (e) =>
    userAction.formValueChangeAction(
      e,
      setForm,
      setEmailError,
      setNameError,
      setUserTypeError,
      setEmpCodeError
    );

  const handleSave = async () => {
    userAction.validateUserDetail(
      form,
      props.onEdit,
      props.editData,
      setNameError,
      setEmailError,
      setUserTypeError,
      setEmpCodeError,
      setLoading,
      props.loadUsers,
      resetStateValues
    );
  };
  function resetStateValues() {
    setForm(initialForm);
    // setUserNameError("");
    setNameError("");
    setEmailError("");
    setUserTypeError("");
    setEmpCodeError("");
    props.setShowCanvas(false);
    props.setOnEdit(false);
    setLoading(false);
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSave();
    }
  };
  const userTypes = [
    { value: "internal", label: "Internal", color: "var(--themeColor)" },
    { value: "external", label: "External", color: "var(--textDanger)" },
  ];
  return (
    <div className={modalStyles.overlay} aria-modal="true" role="dialog">
      <div className={`${modalStyles.modal} `}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <UserRoundPlus className="map-icon" />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {props.onEdit ? "Edit" : "Add New"} User
              </h2>
              <p className={modalStyles.modalSubtitle}>
                {props.onEdit
                  ? "Modify the existing user account information and permissions."
                  : "Create a new user account with access permissions"}
              </p>
            </div>
          </div>
          <button
            className={modalStyles.closeBtn}
            onClick={() => {
              resetStateValues();
            }}
          >
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        <div className={`${modalStyles.modalBody}`}>
          {/* User Type */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>User Type</label>
            <div className={modalStyles.userTypeGrid}>
              {userTypes.map((type, index) => (
                <div
                  key={type.value}
                  className={`${modalStyles.userTypeCard} ${
                    form?.user_type === type.value
                      ? modalStyles.userTypeCardActive
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() =>
                    handleChange({
                      target: { name: "user_type", value: type.value },
                    })
                  }
                >
                  <div
                    className={modalStyles.userTypeIcon}
                    style={{
                      background: `${type.color}20`,
                      border:
                        form?.user_type === type.value
                          ? `2px solid ${type.color}`
                          : "2px solid transparent",
                    }}
                  >
                    <Shield size={20} style={{ color: type.color }} />
                  </div>

                  <span className={modalStyles.userTypeLabel}>
                    {type.label}
                  </span>

                  {form?.user_type === type.value && (
                    <div
                      className={modalStyles.checkMark}
                      style={{ background: type.color }}
                    >
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {userTypeError && <ErrorMessage message={userTypeError} />}
          </div>
          {/* Name */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>
              {/* <Lock size={16} /> */}
              Name
            </label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <UserRound size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            {nameError && <ErrorMessage message={nameError} />}
          </div>
          {/* Email */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>
              {/* <Lock size={16} /> */}
              Email
            </label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <Mail size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            {emailError && <ErrorMessage message={emailError} />}
          </div>

          {/* Employee Code */}
          {form?.user_type === "internal" && (
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>
                {/* <Lock size={16} /> */}
                Employee Code
              </label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <UserRoundCheck size={18} />
                </div>
                <input
                  className={modalStyles.input}
                  type="text"
                  name="emp_code"
                  placeholder="Enter emp Code"
                  value={form?.emp_code || ""}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {empCodeError && <ErrorMessage message={empCodeError} />}
            </div>
          )}
          {/* <div className={styles.textboxGroup}>
                <select
                  className={`form-control ${styles.formTextbox}`}
                  name="user_type"
                  value={form?.user_type}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                >
                  <option value="" hidden>
                    Please select user type
                  </option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
          </div> */}
        </div>

        {/* Footer */}
        <div className={modalStyles.modalFooter}>
          <button
            type="button"
            className={modalStyles.submitBtn}
            onClick={handleSave}
          >
            {loading ? (
              <GlobalSpinnerLoader />
            ) : props.onEdit ? (
              <div className="d-flex align-items-center gap-1">
                <Check size={18} />
                <span style={{ marginTop: "2px" }}>Update</span>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-1">
                <UserRoundPlus size={18} />
                <span style={{ marginTop: "2px" }}>Add User</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
