import React, { useState, useEffect } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import {
    X,
    GitBranch,
    Check,
    Loader2,
    Building2,
    Users,
    Cpu,
    Laptop,
    Briefcase,
    Settings,
    Zap,
    Headphones,
    LineChart,
    Shield,
    HardDrive,
    Database,
    Cloud,
    Code2,
    Palette,
    Mic2,
    HeartPulse,
    Truck,
    Globe,
    BookOpen
} from "lucide-react";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { validateDepartmentDetail } from "../../../services/DepartmentService/DepartmentAction";
import { getBranchesAction } from "../../../services/BranchService/BranchAction";
import * as common from "../../../common/common";

const AddDepartment = ({ showCanvas, setShowCanvas, onRefresh, initialData }) => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        branch_id: "",
        icon: "GitBranch"
    });

    const departmentIcons = [
        { name: "GitBranch", icon: <GitBranch size={20} /> },
        { name: "Building2", icon: <Building2 size={20} /> },
        { name: "Users", icon: <Users size={20} /> },
        { name: "Cpu", icon: <Cpu size={20} /> },
        { name: "Laptop", icon: <Laptop size={20} /> },
        { name: "Briefcase", icon: <Briefcase size={20} /> },
        { name: "Settings", icon: <Settings size={20} /> },
        { name: "Zap", icon: <Zap size={20} /> },
        { name: "Headphones", icon: <Headphones size={20} /> },
        { name: "LineChart", icon: <LineChart size={20} /> },
        { name: "Shield", icon: <Shield size={20} /> },
        { name: "HardDrive", icon: <HardDrive size={20} /> },
        { name: "Database", icon: <Database size={20} /> },
        { name: "Cloud", icon: <Cloud size={20} /> },
        { name: "Code2", icon: <Code2 size={20} /> },
        { name: "Palette", icon: <Palette size={20} /> },
        { name: "Mic2", icon: <Mic2 size={20} /> },
        { name: "HeartPulse", icon: <HeartPulse size={20} /> },
        { name: "Truck", icon: <Truck size={20} /> },
        { name: "Globe", icon: <Globe size={20} /> },
        { name: "BookOpen", icon: <BookOpen size={20} /> }
    ];

    // States
    const [branches, setBranches] = useState([]);
    const [nameError, setNameError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [branchError, setBranchError] = useState("");
    const [loading, setLoading] = useState(false);

    // Populate form and fetch branches
    useEffect(() => {
        if (showCanvas) {
            getBranchesAction(setBranches);
            if (initialData) {
                setForm({
                    id: initialData.id,
                    name: initialData.name || "",
                    code: initialData.code || "",
                    branch_id: initialData.branch_id || "",
                    icon: initialData.icon || "GitBranch",
                    created_at: initialData.created_at || new Date().toISOString(),
                    status: initialData.status ?? true
                });
            } else {
                setForm({
                    name: "",
                    code: "",
                    branch_id: ""
                });
            }
        }
        if (!showCanvas) {
            setNameError("");
            setCodeError("");
            setBranchError("");
            setBranchError("");
        }
    }, [showCanvas, initialData]);

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear errors
        if (name === 'name') setNameError("");
        if (name === 'code') setCodeError("");
        if (name === 'branch_id') setBranchError("");
    };

    const handleSave = () => {
        validateDepartmentDetail({
            form,
            setNameError,
            setCodeError,
            setBranchError,
            setLoading,
            onSuccess: (msg) => {
                setLoading(false);
                // We let the parent handle the success toast to avoid duplication
                if (onRefresh) onRefresh(initialData ? "Department updated successfully" : "Department added successfully");
                setShowCanvas(false);
            },
            onError: (err) => {
                setLoading(false);
                common.setAlertMessage("error", err || "Failed to save department");
            }
        });
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
                            <p className={modalStyles.modalSubtitle}>{initialData ? "Update department details." : "Define a new department for the organization."}</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)} disabled={loading}>
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
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>
                                ))}
                            </select>
                        </div>
                        {branchError && <ErrorMessage message={branchError} />}
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
                        {nameError && <ErrorMessage message={nameError} />}
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
                        {codeError && <ErrorMessage message={codeError} />}
                        <span style={{ fontSize: "11px", color: "var(--textMuted)", marginTop: "4px", display: "block" }}>Format: Uppercase letters, numbers, and hyphens (e.g. FIN-01).</span>
                    </div>

                    {/* Icon Selection - Commented out as requested */}
                    {/* <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Department Icon</label>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            gap: "8px",
                            padding: "12px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            maxHeight: "150px",
                            overflowY: "auto"
                        }}>
                            {departmentIcons.map((item) => (
                                <div
                                    key={item.name}
                                    onClick={() => setForm(prev => ({ ...prev, icon: item.name }))}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        background: form.icon === item.name ? "var(--gradientTheme)" : "white",
                                        color: form.icon === item.name ? "white" : "var(--textMuted)",
                                        border: "1px solid",
                                        borderColor: form.icon === item.name ? "transparent" : "#e2e8f0",
                                        transition: "all 0.3s ease",
                                        boxShadow: form.icon === item.name ? "0 4px 12px rgba(102, 126, 234, 0.3)" : "none"
                                    }}
                                    title={item.name}
                                >
                                    {item.icon}
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)} disabled={loading}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                        {" "}{initialData ? "Update Department" : "Add Department"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
