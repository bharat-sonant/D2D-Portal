import React, { useState } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
    X,
    User,
    Phone,
    Mail,
    Briefcase,
    Building2,
    Check,
    Hash
} from "lucide-react";

const AddEmployee = ({ showCanvas, setShowCanvas }) => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        employeeCode: "",
        branch: ""
    });

    if (!showCanvas) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving Employee:", form);
        setShowCanvas(false);
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modal} style={{ maxWidth: "700px" }}>
                {/* Header */}
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <User size={24} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>Add New Employee</h2>
                            <p className={modalStyles.modalSubtitle}>Fill in the professional details for the new staff member.</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={modalStyles.modalBody} style={{ padding: "24px" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        {/* User Name */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>User Name</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><User size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="name"
                                    placeholder="Enter full name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Employee Code */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Employee Code</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Hash size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="employeeCode"
                                    placeholder="e.g. EMP123"
                                    value={form.employeeCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                        {/* Phone Number */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Phone No</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Phone size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Email Address</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Mail size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="email"
                                    placeholder="Enter email address"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginTop: "20px" }}>
                        {/* Branch Dropdown */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Branch</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Building2 size={18} /></div>
                                <select
                                    className={modalStyles.input}
                                    name="branch"
                                    value={form.branch}
                                    onChange={handleChange}
                                    style={{ paddingLeft: "45px" }}
                                >
                                    <option value="">Select Branch</option>
                                    <option value="main">Main Office (Jaipur)</option>
                                    <option value="west">West Branch (Delhi)</option>
                                    <option value="south">South Branch (Mumbai)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave}>
                        <Check size={18} /> Save Employee
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
