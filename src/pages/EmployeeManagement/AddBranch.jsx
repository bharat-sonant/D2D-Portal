import React, { useState } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
    X,
    Building2,
    MapPin,
    Check,
    Settings
} from "lucide-react";

const AddBranch = ({ showCanvas, setShowCanvas }) => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        address: ""
    });

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving Branch:", form);
        setShowCanvas(false);
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modal} style={{ maxWidth: "500px" }}>
                {/* Header */}
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <Building2 size={24} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>Add New Branch</h2>
                            <p className={modalStyles.modalSubtitle}>Enter details to create a new office branch.</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={modalStyles.modalBody} style={{ padding: "24px" }}>

                    <div className={modalStyles.inputGroup}>
                        <label className={modalStyles.label}>Branch Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><Building2 size={18} /></div>
                            <input
                                className={modalStyles.input}
                                name="name"
                                placeholder="Enter branch name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Branch Code</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><Settings size={18} /></div>
                            <input
                                className={modalStyles.input}
                                name="code"
                                placeholder="Enter branch code"
                                value={form.code}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Complete Address</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><MapPin size={18} /></div>
                            <textarea
                                className={modalStyles.input}
                                name="address"
                                placeholder="Enter complete office address"
                                rows="3"
                                style={{ height: "auto", padding: "12px 12px 12px 48px" }}
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave}>
                        <Check size={18} /> Add Branch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBranch;
