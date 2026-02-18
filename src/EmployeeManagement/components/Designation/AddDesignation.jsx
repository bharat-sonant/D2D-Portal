import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import { X, Check, Loader2, Briefcase } from "lucide-react";

const AddDesignation = ({ showCanvas, setShowCanvas, onSave, initialData }) => {
    const [form, setForm] = useState({ name: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showCanvas) {
            if (initialData) setForm({ name: initialData.name || "" });
            else setForm({ name: "" });
        }
        if (!showCanvas) setLoading(false);
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { value } = e.target;
        setForm({ name: value });
    };

    const handleSave = () => {
        if (!form.name || form.name.trim() === "") return;
        setLoading(true);
        setTimeout(() => {
            const payload = { ...initialData, name: form.name.trim() };
            setLoading(false);
            if (onSave) onSave(payload);
        }, 200);
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
                            <p className={modalStyles.modalSubtitle}>{initialData ? "Update designation details." : "Create a new designation for this department."}</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)} disabled={loading}>
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
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)} disabled={loading}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave} disabled={loading || !form.name.trim()}>
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} {initialData ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDesignation;
