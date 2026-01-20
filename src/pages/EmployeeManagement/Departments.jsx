import React from "react";
import styles from "../Reports/Reports.module.css";
import { GitBranch } from "lucide-react";

const Departments = () => {
    return (
        <div className={styles.reportsContainer}>
            <div className={styles.background}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`} />
                <div className={`${styles.gradientOrb} ${styles.orb2}`} />
                <div className={`${styles.gradientOrb} ${styles.orb3}`} />
                <div className={styles.gridOverlay} />
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: "30px" }}>
                <h2 style={{ fontFamily: "var(--fontGraphikBold)", marginBottom: "25px" }}>Department Management</h2>
                <div style={{
                    background: "var(--white)",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    textAlign: "center"
                }}>
                    <GitBranch size={48} style={{ marginBottom: "15px", opacity: 0.3 }} />
                    <h3>No Departments Found</h3>
                </div>
            </div>
        </div>
    );
};

export default Departments;
