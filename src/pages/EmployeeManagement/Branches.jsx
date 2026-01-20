import React, { useState } from "react";
import styles from "../Reports/Reports.module.css";
import { Building2, Plus } from "lucide-react";
import AddBranch from "./AddBranch";

const Branches = () => {
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
                <h2 style={{ fontFamily: "var(--fontGraphikBold)", marginBottom: "25px" }}>Branch Management</h2>
                <div style={{
                    background: "var(--white)",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    textAlign: "center",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--textMuted)"
                }}>
                    <Building2 size={48} style={{ marginBottom: "15px", opacity: 0.3 }} />
                    <h3>No Branches Found</h3>
                    <p>Click the "+" button to add a new office branch.</p>
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
                title="Add New Branch"
            >
                <Plus size={28} />
            </button>

            <AddBranch
                showCanvas={showAddModal}
                setShowCanvas={setShowAddModal}
            />
        </div>
    );
};

export default Branches;
