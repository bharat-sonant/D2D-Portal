import React from "react";
import styles from "../../pages/Reports/Reports.module.css";

const EmployeeDashboard = () => {
    const stats = [
        { label: "Total Employees", value: "124", color: "#354db9" },
        { label: "Total Branches", value: "12", color: "#b84dc5" },
        { label: "Total Departments", value: "8", color: "#3481c6" },
    ];

    return (
        <div className={styles.reportsContainer}>
            <div className={styles.background}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`} />
                <div className={`${styles.gradientOrb} ${styles.orb2}`} />
                <div className={`${styles.gradientOrb} ${styles.orb3}`} />
                <div className={styles.gridOverlay} />
            </div>

            <div style={{ position: "relative", zIndex: 1, padding: "30px" }}>
                <h2 style={{ fontFamily: "var(--fontGraphikBold)", marginBottom: "25px" }}>Employee Dashboard</h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            background: "var(--white)",
                            padding: "25px",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                            borderLeft: `5px solid ${stat.color}`
                        }}>
                            <p style={{ color: "var(--textMuted)", fontSize: "14px", marginBottom: "10px" }}>{stat.label}</p>
                            <h3 style={{ fontSize: "28px", color: "var(--black)" }}>{stat.value}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
