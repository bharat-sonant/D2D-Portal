import React, { useState } from "react";
import styles from "../Reports/Reports.module.css";
import { Search, Plus, User, MoreVertical, Edit2, Trash2 } from "lucide-react";
import AddEmployee from "./AddEmployee";

const staticEmployees = [
    { id: 1, name: "Amit Sharma", code: "EMP001", email: "amit.sharma@example.com", phone: "+91 98765 43210", branch: "Jaipur Main" },
    { id: 2, name: "Priya Singh", code: "EMP002", email: "priya.singh@example.com", phone: "+91 87654 32109", branch: "Delhi West" },
    { id: 3, name: "Rahul Verma", code: "EMP003", email: "rahul.verma@example.com", phone: "+91 76543 21098", branch: "Mumbai South" },
    { id: 4, name: "Sneha Kapoor", code: "EMP004", email: "sneha.kapoor@example.com", phone: "+91 65432 10987", branch: "Jaipur Main" },
    { id: 5, name: "Vikram Malhotra", code: "EMP005", email: "vikram.malm@example.com", phone: "+91 54321 09876", branch: "Delhi West" },
];

const Employees = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className={styles.reportsContainer}>
            <div className={styles.background}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`} />
                <div className={`${styles.gradientOrb} ${styles.orb2}`} />
                <div className={`${styles.gradientOrb} ${styles.orb3}`} />
                <div className={styles.gridOverlay} />
            </div>

            <div style={{ position: "relative", zIndex: 1, padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <div>
                        <h2 style={{ fontFamily: "var(--fontGraphikBold)", margin: 0 }}>Employees Management</h2>
                        <p style={{ color: "var(--textMuted)", fontSize: "14px", marginTop: "5px" }}>Manage and monitor all company staff members</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ position: "relative" }}>
                            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--textMuted)" }} />
                            <input
                                placeholder="Search employees..."
                                style={{
                                    padding: "10px 15px 10px 40px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--borderColor)",
                                    fontSize: "14px",
                                    width: "250px"
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{
                    background: "var(--white)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--borderColor)" }}>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Employee</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Code</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Contact</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Branch</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staticEmployees.map((emp) => (
                                <tr key={emp.id} style={{ borderBottom: "1px solid var(--borderColor)", transition: "background 0.2s" }} className={styles.tableRow}>
                                    <td style={{ padding: "15px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--gradientTheme)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: "var(--fontGraphikMedium)", fontSize: "14px" }}>{emp.name}</div>
                                                <div style={{ fontSize: "12px", color: "var(--textMuted)" }}>{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>{emp.code}</td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>{emp.phone}</td>
                                    <td style={{ padding: "15px 20px" }}>
                                        <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#edf2ff", color: "#445add", fontSize: "12px", fontWeight: "500" }}>{emp.branch}</span>
                                    </td>
                                    <td style={{ padding: "15px 20px", textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                            <button style={{ border: "none", background: "none", color: "var(--textMuted)", cursor: "pointer" }}><Edit2 size={16} /></button>
                                            <button style={{ border: "none", background: "none", color: "#ff4d4f", cursor: "pointer" }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setShowAddModal(true)}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--gradientTheme)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    zIndex: 1000
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) translateY(0)"}
                title="Add New Employee"
            >
                <Plus size={28} />
            </button>

            <AddEmployee
                showCanvas={showAddModal}
                setShowCanvas={setShowAddModal}
            />
        </div>
    );
};

export default Employees;
