import React, { useState } from "react";
import modalStyles from "../../assets/css/popup.module.css";
import {
    X,
    User,
    Phone,
    MapPin,
    Mail,
    Briefcase,
    Building2,
    UserRoundPlus,
    Check
} from "lucide-react";

const AddEmployee = ({ showCanvas, setShowCanvas }) => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        email: "",
        employeeCode: "",
        department: "",
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
            <div className={modalStyles.modal} style={{ maxWidth: "600px" }}>
                {/* Header */}
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <UserRoundPlus size={24} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>Add New Employee</h2>
                            <p className={modalStyles.modalSubtitle}>Enter basic information to register a new employee.</p>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => setShowCanvas(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={modalStyles.modalBody} style={{ padding: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {/* Name */}
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

                        {/* Phone */}
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

                        {/* Email */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Email Address</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Mail size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="email"
                                    placeholder="Enter email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Employee Code */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Employee Code</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Briefcase size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="employeeCode"
                                    placeholder="Enter employee code"
                                    value={form.employeeCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className={modalStyles.inputGroup} style={{ marginTop: "16px" }}>
                        <label className={modalStyles.label}>Address</label>
                        <div className={modalStyles.inputWrapper}>
                            <div className={modalStyles.inputIcon}><MapPin size={18} /></div>
                            <textarea
                                className={modalStyles.input}
                                name="address"
                                placeholder="Enter complete address"
                                rows="3"
                                style={{ height: "auto", padding: "12px 12px 12px 48px" }}
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                        {/* Branch */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Branch</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Building2 size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="branch"
                                    placeholder="Enter branch"
                                    value={form.branch}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div className={modalStyles.inputGroup}>
                            <label className={modalStyles.label}>Department</label>
                            <div className={modalStyles.inputWrapper}>
                                <div className={modalStyles.inputIcon}><Building2 size={18} /></div>
                                <input
                                    className={modalStyles.input}
                                    name="department"
                                    placeholder="Enter department"
                                    value={form.department}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave}>
                        <Check size={18} /> Add Employee
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
