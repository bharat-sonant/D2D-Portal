import React, { useState } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
    X,
    GitBranch,
    Check,
    Settings,
    AlignLeft
} from "lucide-react";

const AddDepartment = ({ showCanvas, setShowCanvas }) => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        description: ""
    });

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving Department:", form);
        setShowCanvas(false);
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modal} style={{ maxWidth: "500px" }}>
                {/* Header */}
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <GitBranch size={24} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>Add Department</h2>
                            <p className={modalStyles.modalSubtitle}>Define a new department for the organization.</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={modalStyles.modalBody} style={{ padding: "24px" }}>
                    <div className={modalStyles.inputGroup}>
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
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Description</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><AlignLeft size={18} /></div>
                            <textarea
                                className={modalStyles.input}
                                name="description"
                                placeholder="Briefly describe the department's role"
                                rows="3"
                                style={{ height: "auto", padding: "12px 12px 12px 48px" }}
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave}>
                        <Check size={18} /> Add Department
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
