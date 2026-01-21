import React, { useState } from "react";
import styles from "../../pages/Reports/Reports.module.css";
import { GitBranch, Plus, Edit2, Trash2, Settings } from "lucide-react";
import AddDepartment from "../components/AddDepartment";

const staticDepartments = [
    { id: 1, name: "Engineering", code: "ENG-HUB" },
    { id: 2, name: "Marketing & Sales", code: "MKT-SALES" },
    { id: 3, name: "Human Resources", code: "HR-PEOPLE" },
    { id: 4, name: "Finance & Accounts", code: "FIN-ACC" },
    { id: 5, name: "Operations", icon: GitBranch, code: "OPS-TEAM" },
];

const Departments = () => {
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
                <div style={{ marginBottom: "25px" }}>
                    <h2 style={{ fontFamily: "var(--fontGraphikBold)", margin: 0 }}>Department Management</h2>
                    <p style={{ color: "var(--textMuted)", fontSize: "14px", marginTop: "5px" }}>Define and organize company departments and structures</p>
                </div>

                <div style={{
                    background: "var(--white)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    maxWidth: "800px"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--borderColor)" }}>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Department Name</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Dept Code</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staticDepartments.map((dept) => (
                                <tr key={dept.id} style={{ borderBottom: "1px solid var(--borderColor)" }}>
                                    <td style={{ padding: "15px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{ color: "#17a748" }}><GitBranch size={18} /></div>
                                            <span style={{ fontFamily: "var(--fontGraphikMedium)", fontSize: "14px" }}>{dept.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>
                                        <code style={{ background: "#f0fdf4", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", border: "1px solid #dcfce7" }}>{dept.code}</code>
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
                title="Add New Department"
            >
                <Plus size={28} />
            </button>

            <AddDepartment
                showCanvas={showAddModal}
                setShowCanvas={setShowAddModal}
            />
        </div>
    );
};

export default Departments;
