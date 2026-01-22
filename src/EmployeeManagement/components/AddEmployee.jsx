import React, { useState, useEffect } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  Check,
  Hash,
  Loader2,
} from "lucide-react";
import {
  getBranchesAction,
  validateEmployeeDetail,
  employeeFormValueChangeAction,
} from "../../services/EmployeeService/EmployeeAction";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import * as common from "../../common/common";
import Toast from "../../components/Common/GlobalToast/GlobalToast";

const AddEmployee = ({
  showCanvas,
  setShowCanvas,
  employeeToEdit,
  onRefresh,
}) => {
  const [form, setForm] = useState({
    employee_name: "",
    phone_number: "",
    email: "",
    employee_code: "",
    branch_id: "",
    status: true,
  });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [empCodeError, setEmpCodeError] = useState("");
  const [branchError, setBranchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (showCanvas) {
      getBranchesAction(setBranches);
      if (employeeToEdit) {
        setForm({
          id: employeeToEdit.id,
          employee_name: employeeToEdit.employee_name || "",
          phone_number: employeeToEdit.phone_number || "",
          email: employeeToEdit.email || "",
          employee_code: employeeToEdit.employee_code || "",
          branch_id: employeeToEdit.branch_id || "",
          status: employeeToEdit.status ?? true,
          created_at: employeeToEdit.created_at,
        });
      } else {
        setForm({
          employee_name: "",
          phone_number: "",
          email: "",
          employee_code: "",
          branch_id: "",
          status: true,
        });
      }
    }
  }, [showCanvas, employeeToEdit]);

  if (!showCanvas) return null;

  const resetErrors = () => {
    setNameError("");
    setPhoneError("");
    setEmpCodeError("");
    setBranchError("");
    setEmailError("");
  };

  const handleChange = (e) => {
    employeeFormValueChangeAction(e, setForm, {
      employee_name: setNameError,
      phone_number: setPhoneError,
      employee_code: setEmpCodeError,
      branch_id: setBranchError,
      email: setEmailError,
    });
  };

  const handleSave = () => {
    validateEmployeeDetail({
      form,
      setNameError,
      setPhoneError,
      setEmpCodeError,
      setBranchError,
      setEmailError,
      setLoading,
      onSuccess: (message) => {
        setShowCanvas(false);
        if (onRefresh) onRefresh();
      },
      onError: (error) => {
        setToast({ message: error || "An error occurred", type: "error" });
      },
    });
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal} style={{ maxWidth: "700px" }}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <User size={24} />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {employeeToEdit ? "Edit Employee" : "Add New Employee"}
              </h2>
              <p className={modalStyles.modalSubtitle}>
                Fill in the professional details for the staff member.
              </p>
            </div>
          </div>
          <button
            className={modalStyles.closeBtn}
            onClick={() => {
              resetErrors();
              setShowCanvas(false);
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={modalStyles.modalBody} style={{ padding: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* User Name */}
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Employee Name</label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <User size={18} />
                </div>
                <input
                  className={modalStyles.input}
                  name="employee_name"
                  placeholder="Enter full name"
                  value={form.employee_name}
                  onChange={handleChange}
                />
              </div>
              {nameError && <ErrorMessage message={nameError} />}
            </div>

            {/* Employee Code */}
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Employee Code</label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <Hash size={18} />
                </div>
                <input
                  className={modalStyles.input}
                  name="employee_code"
                  placeholder="e.g. 1001"
                  type="number"
                  value={form.employee_code}
                  onChange={handleChange}
                  disabled={!!employeeToEdit} // Usually unique IDs shouldn't change
                />
              </div>
              {empCodeError && <ErrorMessage message={empCodeError} />}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {/* Phone Number */}
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Phone No</label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <Phone size={18} />
                </div>
                <input
                  className={modalStyles.input}
                  name="phone_number"
                  placeholder="Enter phone number"
                  type="number"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </div>
              {phoneError && <ErrorMessage message={phoneError} />}
            </div>

            {/* Email Address */}
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Email Address</label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <Mail size={18} />
                </div>
                <input
                  className={modalStyles.input}
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {emailError && <ErrorMessage message={emailError} />}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {/* Branch Dropdown */}
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Branch Name</label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <Building2 size={18} />
                </div>
                <select
                  className={modalStyles.input}
                  name="branch_id"
                  value={form.branch_id}
                  onChange={handleChange}
                  style={{ paddingLeft: "45px", appearance: "none" }}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch, idx) => (
                    <option key={idx} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                  {/* Fallback if no branches in DB yet */}
                  {branches.length === 0 && (
                    <>
                      <option value="Jaipur Main Office">
                        Jaipur Main Office
                      </option>
                      <option value="Delhi West Branch">
                        Delhi West Branch
                      </option>
                      <option value="Mumbai South Hub">Mumbai South Hub</option>
                    </>
                  )}
                </select>
                <div
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "var(--textMuted)",
                  }}
                >
                  <Hash size={12} style={{ opacity: 0 }} /> {/* Spacer */}
                </div>
              </div>
              {branchError && <ErrorMessage message={branchError} />}
            </div>

            {/* Status Toggle */}
            <div className={modalStyles.inputGroup}>
              <label
                className={modalStyles.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.checked }))
                  }
                  style={{ width: "18px", height: "18px" }}
                />
                Active Status
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={modalStyles.modalFooter}>
          <button
            className={modalStyles.cancelBtn}
            onClick={() => {
              resetErrors();
              setShowCanvas(false);
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={modalStyles.submitBtn}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Check size={18} />
            )}
            {employeeToEdit ? "Update Employee" : "Save Employee"}
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AddEmployee;
