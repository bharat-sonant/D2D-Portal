import React, { useState, useEffect } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
    X,
    Building2,
    MapPin,
    Check,
    Settings,
    User,
    Loader2
} from "lucide-react";
import { saveBranchAction, validateBranchDetail } from "../../services/BranchService/BranchAction";
import Toast from "../../components/Common/GlobalToast/GlobalToast";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const AddBranch = ({ showCanvas, setShowCanvas, onRefresh, initialData }) => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        address: "",
        manager_name: "",
        city_id: "",
        status: true
    });

    // error states
    const [nameError, setNameError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [managerError, setManagerError] = useState("");
    const [cityError, setCityError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Populate form if initialData exists (Edit Mode)
    useEffect(() => {
        if (showCanvas && initialData) {
            setForm({
                id: initialData.id,
                name: initialData.name || "",
                code: initialData.code || "",
                address: initialData.address || "",
                manager_name: initialData.manager_name || "",
                city_id: initialData.city_id || "",
                status: initialData.status !== undefined ? initialData.status : true,
                created_at: initialData.created_at || new Date().toISOString()
            });
        } else if (showCanvas && !initialData) {
            // Reset form for Add Mode
            setForm({
                name: "",
                code: "",
                address: "",
                manager_name: "",
                city_id: "",
                status: true
            });
        }
        // Reset errors whenever canvas opens/closes
        if (!showCanvas) {
            setNameError("");
            setCodeError("");
            setAddressError("");
            setManagerError("");
            setCityError("");
            setToast(null);
        }
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Strict numeric check for city_id
        if (name === 'city_id' && value && !/^\d+$/.test(value)) {
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));

        // Clear specific error
        if (name === 'name') setNameError("");
        if (name === 'code') setCodeError("");
        if (name === 'address') setAddressError("");
        if (name === 'manager_name') setManagerError("");
        if (name === 'city_id') setCityError("");
    };

    const handleSave = () => {
        validateBranchDetail({
            form,
            setNameError,
            setCodeError,
            setAddressError,
            setManagerError,
            setCityError,
            setLoading,
            onSuccess: (msg) => {
                setLoading(false);
                setToast({ message: initialData ? "Branch updated successfully" : (msg || "Branch saved successfully"), type: "success" });
                // Delay close to show toast or just close immediately and show toast in parent
                setTimeout(() => {
                    setShowCanvas(false);
                    if (onRefresh) onRefresh();
                }, 1000);
            },
            onError: (err) => {
                setLoading(false);
                setToast({ message: err || "Failed to save branch", type: "error" });
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
                                disabled={!!initialData} // Optionally disable code editing if it's considered immutable or unique key
                                style={initialData ? { background: "#f1f5f9", cursor: "not-allowed" } : {}}
                            />
                        </div>
                        {codeError && <ErrorMessage message={codeError} />}
                        {initialData && <span style={{ fontSize: "10px", color: "var(--textMuted)" }}>Code cannot be changed</span>}
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Manager Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><User size={18} /></div>
                            <input
                                className={modalStyles.input}
                                name="manager_name"
                                placeholder="Enter manager name"
                                value={form.manager_name}
                                onChange={handleChange}
                            />
                        </div>
                        {managerError && <ErrorMessage message={managerError} />}
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>City ID</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><MapPin size={18} /></div>
                            <input
                                className={modalStyles.input}
                                name="city_id"
                                placeholder="Enter city ID"
                                value={form.city_id}
                                onChange={handleChange}
                            />
                        </div>
                        {cityError && <ErrorMessage message={cityError} />}
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
                        {addressError && <ErrorMessage message={addressError} />}
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                name="status"
                                checked={form.status}
                                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.checked }))}
                                style={{ width: "18px", height: "18px" }}
                            />
                            Active Status
                        </label>
                    </div>

                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)} disabled={loading}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? <Check size={18} /> : <Check size={18} />)}
                        {" "}{initialData ? "Update Branch" : "Add Branch"}
                    </button>
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AddBranch;
