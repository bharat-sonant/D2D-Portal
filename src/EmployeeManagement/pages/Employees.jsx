import React, { useState, useEffect } from "react";
import empStyles from "./Employees.module.css";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Loader2,
} from "lucide-react";
import AddEmployee from "../components/AddEmployee";
import {
    getEmployeesAction,
    deleteEmployeeAction,
} from "../../services/EmployeeService/EmployeeAction";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import * as common from "../../common/common";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setIsDeleting(true);
        deleteEmployeeAction(
            employeeToDelete.id,
            (msg) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
                common.setAlertMessage("success", msg || "Employee deleted successfully");
                fetchEmployees();
            },
            (err) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
                common.setAlertMessage("error", err || "Failed to delete employee");
            },
        );
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            (emp.employee_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (emp.employee_code?.toString() || "").includes(searchTerm),
    );

    return (
        <div className={empStyles.employeesContainer}>
            <div className={empStyles.background}>
                <div className={`${empStyles.gradientOrb} ${empStyles.orb1}`} />
                <div className={`${empStyles.gradientOrb} ${empStyles.orb2}`} />
                <div className={`${empStyles.gradientOrb} ${empStyles.orb3}`} />
                <div className={empStyles.gridOverlay} />
            </div>

            <div className={empStyles.contentWrapper}>
                <div className={empStyles.headerRow}>
                    <div>
                        <h2 className={empStyles.pageTitle}>Employees Management</h2>
                        <p className={empStyles.pageSubtitle}>Manage and monitor all company staff members</p>
                    </div>
                    <div className={empStyles.searchActions}>
                        <div className={empStyles.searchWrapper}>
                            <Search size={18} className={empStyles.searchIcon} />
                            <input
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={empStyles.searchInput}
                            />
                        </div>
                    </div>
                </div>

                <div className={empStyles.tableContainer}>
                    <table className={empStyles.employeesTable}>
                        <thead>
                            <tr className={empStyles.tableHeader}>
                                <th>Employee</th>
                                <th>Code</th>
                                <th>Contact</th>
                                <th>Branch</th>
                                <th>Status</th>
                                <th style={{ textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className={empStyles.loadingCell}>
                                        <Loader2
                                            className="animate-spin"
                                            size={32}
                                            style={{ margin: "auto", color: "var(--themeColor)" }}
                                        />
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "var(--textMuted)" }}>
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className={empStyles.tableRow}>
                                        <td style={{ padding: "15px 20px" }}>
                                            <div className={empStyles.employeeInfo}>
                                                <div className={empStyles.avatar}>
                                                    {emp.employee_name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <div className={empStyles.employeeName}>{emp.employee_name}</div>
                                                    <div className={empStyles.employeeEmail}>{emp.email || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={empStyles.cellText}>{emp.employee_code}</td>
                                        <td className={empStyles.cellText}>{emp.phone_number || "N/A"}</td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <span className={empStyles.branchBadge}>{emp.branch_id || "N/A"}</span>
                                        </td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <span className={`${empStyles.statusBadge} ${emp.status ? empStyles.statusActive : empStyles.statusInactive}`}>
                                                {emp.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px 20px", textAlign: "center" }}>
                                            <div className={empStyles.actionsContainer}>
                                                <button
                                                    onClick={() => handleEdit(emp)}
                                                    className={empStyles.actionBtn}
                                                    title="Edit Employee"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp)}
                                                    className={empStyles.deleteBtn}
                                                    title="Delete Employee"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                className={empStyles.fab}
                title="Add New Employee"
            >
                <Plus size={28} />
            </button>

            <AddEmployee
                showCanvas={showAddModal}
                setShowCanvas={setShowAddModal}
                employeeToEdit={employeeToEdit}
                onRefresh={(msg) => {
                    fetchEmployees();
                    if (msg) common.setAlertMessage("success", msg);
                }}
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
