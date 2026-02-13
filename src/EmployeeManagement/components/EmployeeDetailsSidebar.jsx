import React from "react";
import modalStyles from "../../assets/css/popup.module.css";
import { X, User, Phone, Mail, MapPin, Building2, Calendar, CreditCard, Hash, Briefcase } from "lucide-react";

const EmployeeDetailsSidebar = ({ isOpen, onClose, employee, onEdit, onDelete }) => {
    if (!isOpen || !employee) return null;

    const DetailItem = ({ icon: Icon, label, value }) => (
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{
                minWidth: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
                color: "var(--themeColor)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
                <Icon size={16} />
            </div>
            <div>
                <div style={{ fontSize: "11px", color: "var(--textMuted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--textDark)" }}>{value || "N/A"}</div>
            </div>
        </div>
    );

    const SectionTitle = ({ title }) => (
        <h3 style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "var(--textDark)",
            marginTop: "24px",
            marginBottom: "16px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
        }}>
            <span style={{ width: "3px", height: "14px", background: "var(--gradientTheme)", borderRadius: "2px", display: "inline-block" }}></span>
            {title}
        </h3>
    );

    return (
        <div className={modalStyles.overlay} onClick={onClose} style={{ zIndex: 1100 }}>
            <div
                className={modalStyles.modal}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "500px", // Keeping it reasonable, not too wide
                    height: "100vh",
                    borderRadius: "0",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    margin: 0,
                    maxHeight: "none",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
                    background: "#fff"
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Compact */}
                <div style={{
                    background: "var(--gradientTheme)",
                    padding: "20px 24px",
                    color: "white",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            background: "white"
                        }}>
                            {employee.image_url ? (
                                <img src={employee.image_url} alt={employee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    background: "#f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px",
                                    color: "var(--themeColor)",
                                    fontWeight: "bold"
                                }}>
                                    {employee.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{employee.name}</h2>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                <span style={{ opacity: 0.9, fontSize: "12px", fontWeight: "500" }}>{employee.desig_id || "Designation N/A"}</span>
                                <span style={{
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    background: "rgba(255,255,255,0.2)",
                                    border: "1px solid rgba(255,255,255,0.3)"
                                }}>
                                    {employee.status ? "ACTIVE" : "INACTIVE"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255,255,255,0.2)",
                            border: "none",
                            borderRadius: "50%",
                            width: "28px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            cursor: "pointer",
                            backdropFilter: "blur(4px)",
                            transition: "background 0.2s"
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className={modalStyles.modalBody} style={{ padding: "24px", overflowY: "auto", flex: 1, background: "#fff" }}>

                    {/* Detailed Info Sections (Excluding List Data) */}

                    <SectionTitle title="Personal Details" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <DetailItem icon={User} label="Full Name" value={employee.name} />
                        <DetailItem icon={Calendar} label="Date of Birth" value={employee.dateOfBirth} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <DetailItem icon={User} label="Father's Name" value={employee.fatherName} />
                        {/* Gender is in list, so excluding here as per request, but Name is exception */}
                    </div>

                    <SectionTitle title="Location" />
                    <DetailItem icon={MapPin} label="Full Address" value={employee.address} />
                    <DetailItem icon={MapPin} label="Office City" value={employee.officeCity} />

                    <SectionTitle title="Professional Info" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <DetailItem icon={Building2} label="Branch" value={employee.branch_id} />
                        <DetailItem icon={Briefcase} label="Department" value={employee.dept_id} />
                        <DetailItem icon={Calendar} label="Date of Joining" value={employee.dateOfJoining} />
                        <DetailItem icon={Hash} label="RF ID" value={employee.rf_id} />
                        <DetailItem icon={User} label="Username" value={employee.username} />
                    </div>

                    <SectionTitle title="Bank Account" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <DetailItem icon={CreditCard} label="Account Number" value={employee.account_no} />
                        <DetailItem icon={CreditCard} label="IFSC Code" value={employee.ifsc} />
                    </div>

                </div>

                {/* Footer Actions */}
                <div style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px"
                }}>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this employee?")) {
                                onDelete(employee);
                            }
                        }}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid #fee2e2",
                            background: "#fff",
                            color: "#dc2626",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "13px",
                            transition: "all 0.2s"
                        }}
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => onEdit(employee)}
                        style={{
                            padding: "8px 20px",
                            borderRadius: "6px",
                            border: "none",
                            background: "var(--gradientTheme)",
                            color: "white",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "13px",
                            boxShadow: "0 2px 4px rgba(102, 126, 234, 0.25)",
                            transition: "all 0.2s"
                        }}
                    >
                        Edit Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailsSidebar;
