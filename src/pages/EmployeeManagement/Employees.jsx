import React, { useState } from "react";
import styles from "../Reports/Reports.module.css";
import { UserPlus, Search } from "lucide-react";
import AddEmployee from "./AddEmployee";

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
                    <h2 style={{ fontFamily: "var(--fontGraphikBold)", margin: 0 }}>Employees Management</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            padding: "10px 20px",
                            background: "var(--gradientTheme)",
                            color: "var(--white)",
                            border: "none",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontFamily: "var(--fontGraphikMedium)",
                            boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)"
                        }}
                    >
                        <UserPlus size={18} /> Add Employee
                    </button>
                </div>

                <div style={{
                    background: "var(--white)",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--textMuted)"
                }}>
                    <Search size={48} style={{ marginBottom: "15px", opacity: 0.3 }} />
                    <p>No employees found. Start by adding a new one!</p>
                </div>
            </div>

            <AddEmployee
                showCanvas={showAddModal}
                setShowCanvas={setShowAddModal}
            />
        </div>
    );
};

export default Employees;
