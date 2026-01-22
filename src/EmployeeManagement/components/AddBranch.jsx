import React, { useState, useEffect } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
    X,
    Building2,
    MapPin,
    Check,
    Settings,
    Loader2
} from "lucide-react";
import { saveBranchAction, validateBranchDetail } from "../../services/BranchService/BranchAction";
import * as common from "../../common/common";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const AddBranch = ({ showCanvas, setShowCanvas, onRefresh, initialData }) => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        address: ""
    });

    // error states
    const [nameError, setNameError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [loading, setLoading] = useState(false);

    // Populate form if initialData exists (Edit Mode)
    useEffect(() => {
        if (showCanvas && initialData) {
            setForm({
                id: initialData.id,
                name: initialData.name || "",
                code: initialData.code || "",
                address: initialData.address || "",
                created_at: initialData.created_at || new Date().toISOString()
            });
        } else if (showCanvas && !initialData) {
            // Reset form for Add Mode
            setForm({
                name: "",
                code: "",
                address: ""
            });
        }
        // Reset errors whenever canvas opens/closes
        if (!showCanvas) {
            setNameError("");
            setCodeError("");
            setAddressError("");
        }
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'name') setNameError("");
        if (name === 'code') setCodeError("");
        if (name === 'address') setAddressError("");
    };

    const handleSave = () => {
        validateBranchDetail({
            form,
            setNameError,
            setCodeError,
            setAddressError,
            setLoading,
            onSuccess: (msg) => {
                setLoading(false);
                setShowCanvas(false);
                if (onRefresh) onRefresh(msg);
            },
            onError: (err) => {
                setLoading(false);
                common.setAlertMessage("error", err || "Failed to save branch");
            }
        });
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modal} style={{ maxWidth: "500px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <Building2 size={24} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>{initialData ? "Edit Branch" : "Add New Branch"}</h2>
                            <p className={modalStyles.modalSubtitle}>{initialData ? "Update branch details." : "Enter details to create a new office branch."}</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={modalStyles.modalBody} style={{ padding: "24px", overflowY: "auto" }}>
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
                                autoComplete="off"
                            />
                        </div>
                        {nameError && <ErrorMessage message={nameError} />}
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
                                disabled={!!initialData}
                                style={initialData ? { background: "#f1f5f9", cursor: "not-allowed" } : {}}
                                autoComplete="off"
                            />
                        </div>
                        {codeError && <ErrorMessage message={codeError} />}
                        {initialData && <span style={{ fontSize: "10px", color: "var(--textMuted)" }}>Code cannot be changed</span>}
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
                                autoComplete="off"
                            />
                        </div>
                        {addressError && <ErrorMessage message={addressError} />}
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)} disabled={loading}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                        {" "}{initialData ? "Update Branch" : "Add Branch"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBranch;
