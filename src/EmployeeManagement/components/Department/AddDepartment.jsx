import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import { X, GitBranch, Loader2, Settings } from "lucide-react";
import {
    getInitialDepartmentForm,
    handleDepartmentCodeInputChange,
    handleDepartmentFormChange,
    initializeDepartmentForm,
    submitDepartmentForm,
} from "../../Action/Department/DepartmentAction";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const AddDepartment = ({ showCanvas, setShowCanvas, initialData, onSuccess }) => {
    const [form, setForm] = useState(getInitialDepartmentForm());
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        initializeDepartmentForm(showCanvas, initialData, setForm, setErrors, setLoader);
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

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><GitBranch size={18} /></div>
                            <input className={modalStyles.input} name="name" placeholder="e.g. Engineering, Sales" value={form.name} onChange={(e) => handleDepartmentFormChange(e, setForm, setErrors)} />
                        </div>
                        {errors.name && <ErrorMessage message={errors.name} />}
                    </div>

                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Code</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><Settings size={18} /></div>
                            <input className={modalStyles.input} name="code" placeholder="e.g. ENG-01" value={form.code} onChange={(e) => handleDepartmentCodeInputChange(e.target.value, setForm, setErrors)} disabled={!!initialData} style={initialData ? { background: "#f1f5f9", cursor: "not-allowed" } : {}} />
                        </div>
                        {errors.code && <ErrorMessage message={errors.code} />}
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button
                        className={modalStyles.submitBtn}
                        disabled={loader}
                        onClick={() =>
                            submitDepartmentForm(
                                form,
                                initialData,
                                setErrors,
                                setForm,
                                setShowCanvas,
                                setLoader,
                                onSuccess
                            )
                        }
                    >
                        {loader ? (
                            <>
                                <Loader2 size={18} className={modalStyles.spinningIcon} />
                                {"Please wait.."}
                            </>
                        ) : (
                            <>
                                {initialData ? "Update Department" : "Save Department"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
