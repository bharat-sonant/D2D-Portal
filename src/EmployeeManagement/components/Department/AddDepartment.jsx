import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import { X, GitBranch, Check, Building2, Settings } from "lucide-react";
import { addDepartment, updateDepartment } from "../../Action/Department/DepartmentAction";
import * as common from "../../../common/common";

const AddDepartment = ({ showCanvas, setShowCanvas, initialData, onSuccess }) => {
  const [form, setForm] = useState({ name: "", code: "", branch_id: ""});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showCanvas) {
      if (initialData) {
        setForm({
          id: initialData.id,
          name: initialData.name || "",
          code: initialData.code || "",
          branch_id: initialData.branch_id || "",
          
        });
      } else {
        setForm({ name: "", code: "", branch_id: "" });
      }
      setErrors({});
    }
  }, [showCanvas, initialData]);

  if (!showCanvas) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.branch_id) newErrors.branch_id = "Branch is required";
    if (!form.name) newErrors.name = "Department name is required";
    else if (!/^[A-Za-z0-9 &]+$/.test(form.name)) newErrors.name = "Invalid characters in name";
    if (!form.code) newErrors.code = "Department code is required";
    else if (!/^[A-Z0-9-]+$/.test(form.code)) newErrors.code = "Code must be uppercase letters, numbers and hyphens";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const first = newErrors[Object.keys(newErrors)[0]];
      common.setAlertMessage("error", first);
      return;
    }

    const payload = {
      name: form.name,
      code: form.code,
      branch_id: form.branch_id,
      icon: form.icon,
    };

    if (initialData && initialData.id) {
      const result = await updateDepartment(initialData.id, payload);
      if (result) {
        setForm({ name: "", code: "", branch_id: "" });
        setErrors({});
        setShowCanvas(false);
        if (typeof onSuccess === "function") onSuccess(result);
        common.setAlertMessage("success", "Department updated successfully");
      } else {
        common.setAlertMessage("error", "Unable to update department. Try again.");
      }
    } else {
      const result = await addDepartment(payload);
      if (result) {
        setForm({ name: "", code: "", branch_id: "" });
        setErrors({});
        setShowCanvas(false);
        if (typeof onSuccess === "function") onSuccess(result);
        common.setAlertMessage("success", "Department added successfully");
      } else {
        common.setAlertMessage("error", "Unable to save department. Try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal} style={{ maxWidth: "450px" }}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <GitBranch size={24} />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>{initialData ? "Edit Department" : "Add Department"}</h2>
              <p className={modalStyles.modalSubtitle}>{initialData ? "Edit department details." : "Add a new department."}</p>
            </div>
          </div>
          <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={modalStyles.modalBody} style={{ padding: "24px" }}>

          {/* Branch Selection */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Branch</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}><Building2 size={18} /></div>
              <select className={modalStyles.input} name="branch_id" value={form.branch_id} onChange={handleChange} style={{ paddingLeft: "48px" }}>
                <option value="">Select Branch</option>
                <option value="1">Main Branch (MB-01)</option>
                <option value="2">City Branch (CB-02)</option>
              </select>
            </div>
            {errors.branch_id && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{errors.branch_id}</div>}
          </div>

          <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
            <label className={modalStyles.label}>Department Name</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}><GitBranch size={18} /></div>
              <input className={modalStyles.input} name="name" placeholder="e.g. Engineering, Sales" value={form.name} onChange={handleChange} />
            </div>
            <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Only letters, numbers, spaces, and & allowed.</span>
            {errors.name && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{errors.name}</div>}
          </div>

          <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
            <label className={modalStyles.label}>Department Code</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}><Settings size={18} /></div>
              <input className={modalStyles.input} name="code" placeholder="e.g. ENG-01" value={form.code} onChange={(e) => handleChange({ target: { name: 'code', value: e.target.value.toUpperCase() } })} disabled={!!initialData} style={initialData ? { background: "#f1f5f9", cursor: "not-allowed" } : {}} />
            </div>
            <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Format: Uppercase letters, numbers, and hyphens (e.g. FIN-01).</span>
            {errors.code && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{errors.code}</div>}
          </div>
        </div>

        {/* Footer */}
        <div className={modalStyles.modalFooter}>
          <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
          <button className={modalStyles.submitBtn} onClick={handleSubmit}>
            <Check size={18} /> {" "}{initialData ? "Update Department" : "Add Department"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
