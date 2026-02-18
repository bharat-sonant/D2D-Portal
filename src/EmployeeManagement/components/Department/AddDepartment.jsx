import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import {
    X,
    GitBranch,
    Check,
    Building2,
    Settings,
} from "lucide-react";

const AddDepartment = ({ showCanvas, setShowCanvas, initialData }) => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        branch_id: "",
        icon: "GitBranch"
    });

    useEffect(() => {
        if (showCanvas) {
            if (initialData) {
                setForm({
                    id: initialData.id,
                    name: initialData.name || "",
                    code: initialData.code || "",
                    branch_id: initialData.branch_id || "",
                    icon: initialData.icon || "GitBranch",
                });
            } else {
                setForm({
                    name: "",
                    code: "",
                    branch_id: "",
                    icon: "GitBranch",
                });
            }
        }
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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
                            <p className={modalStyles.modalSubtitle}>{initialData ? "Design preview for edit modal." : "Design preview for add modal."}</p>
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
                                onChange={handleChange}
                                style={{ paddingLeft: "48px" }}
                            >
                                <option value="">Select Branch</option>
                                <option value="1">Main Branch (MB-01)</option>
                                <option value="2">City Branch (CB-02)</option>
                            </select>
                        </div>
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><GitBranch size={18} /></div>
                            <input
                                className={modalStyles.input}
                                name="name"
                                placeholder="e.g. Engineering, Sales"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Only letters, numbers, spaces, and & allowed.</span>
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Code</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><Settings size={18} /></div>
                            <input
                                className={modalStyles.input}
                                name="code"
                                placeholder="e.g. ENG-01"
                                value={form.code}
                                onChange={(e) => handleChange({ target: { name: 'code', value: e.target.value.toUpperCase() } })}
                                disabled={!!initialData}
                                style={initialData ? { background: "#f1f5f9", cursor: "not-allowed" } : {}}
                            />
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Format: Uppercase letters, numbers, and hyphens (e.g. FIN-01).</span>
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={() => setShowCanvas(false)}>
                        <Check size={18} />
                        {" "}{initialData ? "Update Department" : "Add Department"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
