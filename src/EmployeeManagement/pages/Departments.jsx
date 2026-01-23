import React, { useState, useEffect } from "react";
import deptStyles from "./Departments.module.css";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import AddDepartment from "../components/AddDepartment";
import { getDepartmentsAction, deleteDepartmentAction } from "../../services/DepartmentService/DepartmentAction";
import * as common from "../../common/common";
import NoResult from "../../components/NoResultFound/NoResult";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";

const Departments = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deptToEdit, setDeptToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch Departments on Mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        getDepartmentsAction(setDepartments, setLoading);
    };

    const handleEdit = (dept) => {
        setDeptToEdit(dept);
        setShowAddModal(true);
    };

    const handleDeleteClick = (dept) => {
        setDeptToDelete(dept);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeptToDelete(null);
    };

    const confirmDelete = async () => {
        if (!deptToDelete) return;

        setIsDeleting(true);
        await deleteDepartmentAction(
            deptToDelete.id,
            (msg) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setDeptToDelete(null);
                common.setAlertMessage("success", "Department deleted successfully");
                fetchDepartments();
            },
            (err) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setDeptToDelete(null);
                common.setAlertMessage("error", err || "Failed to delete department");
            }
        );
    };

    // Handle Modal Close
    const handleCloseModal = () => {
        setShowAddModal(false);
        setDeptToEdit(null); // Reset edit state
    };

    return (
        <div className={deptStyles.departmentsContainer}>
            <div className={deptStyles.background}>
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb1}`} />
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb2}`} />
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb3}`} />
                <div className={deptStyles.gridOverlay} />
            </div>
            <div className={deptStyles.contentWrapper}>
                <div className={deptStyles.headerRow}>
                    <div>
                        <h2 className={deptStyles.pageTitle}>Department Management</h2>
                        <p className={deptStyles.pageSubtitle}>Define and organize company departments and structures</p>
                    </div>
                </div>

                <div className={deptStyles.tableContainer}>
                    {loading ? (
                        <div className={deptStyles.loadingWrapper}>
                            <Loader2 className="animate-spin" size={30} style={{ color: "var(--primary)" }} />
                        </div>
                    ) : departments.length > 0 ? (
                        <table className={deptStyles.departmentTable}>
                            <thead>
                                <tr className={deptStyles.tableHeader}>
                                    <th>Department Name</th>
                                    <th>Dept Code</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept) => (
                                    <tr key={dept.id} className={deptStyles.tableRow}>
                                        <td className={deptStyles.tableCell}>
                                            <div className={deptStyles.deptNameContainer}>
                                                <span className={deptStyles.deptNameText}>{dept.name}</span>
                                            </div>
                                        </td>
                                        <td className={deptStyles.tableCell}>
                                            <code className={deptStyles.deptCode}>{dept.code}</code>
                                        </td>
                                        <td className={deptStyles.tableCell}>
                                            <div className={deptStyles.actionsContainer}>
                                                <button
                                                    onClick={() => handleEdit(dept)}
                                                    className={deptStyles.actionBtn}
                                                    title="Edit Department"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(dept)}
                                                    className={deptStyles.deleteBtn}
                                                    title="Delete Department"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
                            <NoResult label="No Departments Found" />
                        </div>
                    )}
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setShowAddModal(true)}
                className={deptStyles.fab}
                title="Add New Department"
            >
                <Plus size={28} />
            </button>

            <AddDepartment
                showCanvas={showAddModal}
                setShowCanvas={handleCloseModal}
                onRefresh={(msg) => {
                    fetchDepartments();
                    if (msg) common.setAlertMessage("success", msg);
                }}
                initialData={deptToEdit}
            />

            {showDeleteModal && (
                <GlobalAlertModal
                    show={showDeleteModal}
                    title="Confirm Deletion"
                    message={
                        <>
                            Are you sure you want to delete department{" "}
                            <strong className={globalAlertStyles.warningName}>
                                {deptToDelete?.name}
                            </strong>
                            ?
                        </>
                    }
                    buttonText={isDeleting ? "Deleting..." : "Yes, Delete"}
                    buttonGradient="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                    iconType="warning"
                    warningText="This action cannot be undone and will remove all associated data."
                    onCancel={handleCancelDelete}
                    onConfirm={confirmDelete}
                    disabled={isDeleting}
                />
            )}

        </div>
    );
};

export default Departments;
