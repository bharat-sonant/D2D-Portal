import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import { X, Check, Briefcase } from "lucide-react";

const AddDesignation = ({ showCanvas, setShowCanvas, initialData }) => {
    const [form, setForm] = useState({ name: "" });

    useEffect(() => {
        if (showCanvas) {
            if (initialData) setForm({ name: initialData.name || "" });
            else setForm({ name: "" });
        }
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { value } = e.target;
        setForm({ name: value });
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modal} style={{ maxWidth: 420 }}>
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <Briefcase size={22} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>{initialData ? "Edit Designation" : "Add Designation"}</h2>
                            <p className={modalStyles.modalSubtitle}>{initialData ? "Design preview for edit modal." : "Design preview for add modal."}</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className={modalStyles.modalBody} style={{ padding: 20 }}>
                    <div className={modalStyles.inputGroup}>
                        <label className={modalStyles.label}>Designation Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <input className={modalStyles.input} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Manager" />
                        </div>
                    </div>

                    {/* single input only as requested */}
                </div>

                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={() => setShowCanvas(false)} disabled={!form.name.trim()}>
                        <Check size={16} /> {initialData ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDesignation;
