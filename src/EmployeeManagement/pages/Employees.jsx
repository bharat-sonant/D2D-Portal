import { useEffect, useState } from "react";
import empStyles from "./Employees.module.css";
import { Search, Plus, Edit2, Trash2, Loader2, RefreshCcw } from "lucide-react";
import AddEmployee from "../components/AddEmployee";
import { deleteEmployeeAction } from "../../services/EmployeeService/EmployeeAction";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import * as common from "../../common/common";
import { migrateEmployeesToSupabase } from "../Service/EmployeeService";

import { getEmployeeListAction } from "../Service/EmployeeAction";
import EmployeeDetailsSidebar from "../components/EmployeeDetailsSidebar";
import WevoisLoader from "../../components/Common/Loader/WevoisLoader";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployees = async () => {
        await getEmployeeListAction(setEmployees, setLoading);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleMigration = async () => {
        await migrateEmployeesToSupabase();
        fetchEmployees();
    };

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
                common.setAlertMessage("success", msg || "Employee deleted successfully");
                fetchEmployees();
            },
            (err) => {
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
                    <div onClick={handleMigration} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} >
                        <RefreshCcw size={20} xlinkTitle="Fetch employees" />
                        <span>Sync Data</span>
                    </div>

                </div>

                <div className={empStyles.tableContainer}>
                    <table className={empStyles.employeesTable}>
                        <thead>
                            <tr className={empStyles.tableHeader}>
                                <th style={{ width: "50px", textAlign: "center" }}>#</th>
                                <th>Employee</th>
                                <th>Code</th>
                                <th>Gender</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className={empStyles.loadingCell}>
                                        <WevoisLoader title="Loading Employees..." />
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "var(--textMuted)" }}>
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp, index) => (
                                    <tr
                                        key={emp.id}
                                        className={empStyles.tableRow}
                                        onClick={() => {
                                            setSelectedEmployee(emp);
                                            setShowDetailsSidebar(true);
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td className={empStyles.cellText} style={{ textAlign: "center", fontWeight: "bold", color: "#64748b" }}>
                                            {index + 1}
                                        </td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <div className={empStyles.employeeInfo}>
                                                <div className={empStyles.avatar}>
                                                    {emp.image_url ? (
                                                        <img src={emp.image_url} alt="" className={empStyles.avatarImg} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                                    ) : (
                                                        emp.employee_name?.charAt(0) || "U"
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={empStyles.employeeName}>{emp.name}</div>
                                                    <div className={empStyles.employeeEmail}>{emp.desig_id || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={empStyles.cellText}>{emp.empCode}</td>
                                        <td className={empStyles.cellText}>{emp.gender || "N/A"}</td>
                                        <td className={empStyles.cellText}>{emp.mobile || "N/A"}</td>
                                        <td className={empStyles.cellText}>{emp.email || "N/A"}</td>
                                        <td style={{ padding: "15px 20px" }}>
                                            <span className={`${empStyles.statusBadge} ${emp.status ? empStyles.statusActive : empStyles.statusInactive}`}>
                                                {emp.status ? "Active" : "Inactive"}
                                            </span>
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

            <EmployeeDetailsSidebar
                isOpen={showDetailsSidebar}
                onClose={() => setShowDetailsSidebar(false)}
                employee={selectedEmployee}
                onEdit={(emp) => {
                    setShowDetailsSidebar(false);
                    handleEdit(emp);
                }}
                onDelete={(emp) => {
                    setShowDetailsSidebar(false);
                    handleDelete(emp);
                }}
            />

        </div>
    );
};

export default Employees;
