import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import { X, GitBranch, Check, Building2, Settings } from "lucide-react";
import {
    getInitialDepartmentForm,
    getDepartmentFormFromData,
    handleDepartmentFormChange,
    submitDepartmentForm,
} from "../../Action/Department/DepartmentAction";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const AddDepartment = ({ showCanvas, setShowCanvas, initialData, onSuccess }) => {
    const [form, setForm] = useState(getInitialDepartmentForm());
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (showCanvas) {
            setForm(getDepartmentFormFromData(initialData));
            setErrors({});
        }
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

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
                            <select
                                className={modalStyles.input}
                                name="branch_id"
                                value={form.branch_id}
                                onChange={(e) => handleDepartmentFormChange(e, setForm, setErrors)}
                                style={{ paddingLeft: "48px" }}
                            >
                                <option value="">Select Branch</option>
                                <option value="1">Main Branch (MB-01)</option>
                                <option value="2">City Branch (CB-02)</option>
                            </select>
                        </div>
                        {errors.branch_id && <ErrorMessage message={errors.branch_id} />}
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><GitBranch size={18} /></div>
                            <input className={modalStyles.input} name="name" placeholder="e.g. Engineering, Sales" value={form.name} onChange={(e) => handleDepartmentFormChange(e, setForm, setErrors)} />
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Only letters, numbers, spaces, and & allowed.</span>
                        {errors.name && <ErrorMessage message={errors.name} />}
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Code</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><Settings size={18} /></div>
                            <input className={modalStyles.input} name="code" placeholder="e.g. ENG-01" value={form.code} onChange={(e) => handleDepartmentFormChange({ target: { name: 'code', value: e.target.value.toUpperCase() } }, setForm, setErrors)} disabled={!!initialData} style={initialData ? { background: "#f1f5f9", cursor: "not-allowed" } : {}} />
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Format: Uppercase letters, numbers, and hyphens (e.g. FIN-01).</span>
                        {errors.code && <ErrorMessage message={errors.code} />}
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button
                        className={modalStyles.submitBtn}
                        onClick={() =>
                            submitDepartmentForm({
                                form,
                                initialData,
                                setErrors,
                                setForm,
                                setShowCanvas,
                                onSuccess,
                            })
                        }
                    >
                        <Check size={18} /> {" "}{initialData ? "Update Department" : "Add Department"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
