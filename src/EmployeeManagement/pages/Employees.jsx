import React, { useState, useEffect } from "react";
import styles from "../../pages/Reports/Reports.module.css";
import { Search, Plus, User, MoreVertical, Edit2, Trash2, Loader2 } from "lucide-react";
import AddEmployee from "../components/AddEmployee";
import { getEmployeesAction, deleteEmployeeAction } from "../../services/EmployeeService/EmployeeAction";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const fetchEmployees = () => {
        getEmployeesAction(setEmployees, setLoading);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEdit = (emp) => {
        setEmployeeToEdit(emp);
        setShowAddModal(true);
    };

    const handleDelete = (emp) => {
        setEmployeeToDelete(emp);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!employeeToDelete) return;
        deleteEmployeeAction(
            employeeToDelete.id,
            (msg) => {
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
                fetchEmployees();
            },
            (err) => {
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
                alert(err);
            }
        );
    };

    const filteredEmployees = employees.filter(emp =>
        (emp.employee_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employee_code?.toString() || "").includes(searchTerm)
    );

    return (
        <div className={styles.reportsContainer}>
            <div className={styles.background}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`} />
                <div className={`${styles.gradientOrb} ${styles.orb2}`} />
                <div className={`${styles.gradientOrb} ${styles.orb3}`} />
                <div className={styles.gridOverlay} />
            </div>

            <div style={{ position: "relative", zIndex: 1, padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                    <div>
                        <h2 style={{ fontFamily: "var(--fontGraphikBold)", margin: 0 }}>Employees Management</h2>
                        <p style={{ color: "var(--textMuted)", fontSize: "14px", marginTop: "5px" }}>Manage and monitor all company staff members</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ position: "relative" }}>
                            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--textMuted)" }} />
                            <input
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                    overflow: "auto"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--borderColor)" }}>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Employee</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Code</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Contact</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Branch</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Status</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: "40px", textAlign: "center" }}>
                                        <Loader2 className="animate-spin" size={32} style={{ margin: "auto", color: "var(--themeColor)" }} />
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "var(--textMuted)" }}>
                                        No employees found.
                                    </td>
                                </tr>
                            ) : filteredEmployees.map((emp) => (
                                <tr key={emp.id} style={{ borderBottom: "1px solid var(--borderColor)", transition: "background 0.2s" }} className={styles.tableRow}>
                                    <td style={{ padding: "15px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--gradientTheme)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                                                {emp.employee_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: "var(--fontGraphikMedium)", fontSize: "14px" }}>{emp.employee_name}</div>
                                                <div style={{ fontSize: "12px", color: "var(--textMuted)" }}>{emp.email || "N/A"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>{emp.employee_code}</td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>{emp.phone_number || "N/A"}</td>
                                    <td style={{ padding: "15px 20px" }}>
                                        <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#edf2ff", color: "#445add", fontSize: "12px", fontWeight: "500" }}>{emp.branch_id || "N/A"}</span>
                                    </td>
                                    <td style={{ padding: "15px 20px" }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            background: emp.status ? "#ecfdf5" : "#fef2f2",
                                            color: emp.status ? "#059669" : "#dc2626",
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }}>
                                            {emp.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "15px 20px", textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                            <button
                                                onClick={() => handleEdit(emp)}
                                                style={{ border: "none", background: "none", color: "var(--textMuted)", cursor: "pointer" }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp)}
                                                style={{ border: "none", background: "none", color: "#ff4d4f", cursor: "pointer" }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
                onClick={() => {
                    setEmployeeToEdit(null);
                    setShowAddModal(true);
                }}
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
                employeeToEdit={employeeToEdit}
                onRefresh={fetchEmployees}
            />

            {showDeleteModal && (
                <GlobalAlertModal
                    show={showDeleteModal}
                    title="Confirm Deletion"
                    message={
                        <>
                            Are you sure you want to delete{" "}
                            <strong className={globalAlertStyles.warningName}>
                                {employeeToDelete?.employee_name}
                            </strong>
                            ?
                        </>
                    }
                    buttonText="Yes, Delete"
                    buttonGradient="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                    iconType="warning"
                    warningText="This action is permanent and will remove all record of this employee from the system."
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setEmployeeToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default Employees;
