import React, { useState, useEffect } from "react";
import deptStyles from "./Departments.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import WevoisLoader from "../../components/Common/Loader/WevoisLoader";
import AddDepartment from "../components/AddDepartment";
import { getDepartmentsAction, deleteDepartmentAction } from "../../services/DepartmentService/DepartmentAction";
import * as common from "../../common/common";
import NoResult from "../../components/NoResultFound/NoResult";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";

const Departments = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deptToEdit, setDeptToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState(null);

    // Fetch Departments on Mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Filter departments when search query or departments change
    useEffect(() => {
        if (!departments) return;
        const filtered = departments.filter(dept =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDepartments(filtered);
    }, [searchQuery, departments]);

    const fetchDepartments = () => {
        getDepartmentsAction(setDepartments, setLoading);
    };

    const handleEdit = (e, dept) => {
        e.stopPropagation();
        setDeptToEdit(dept);
        setShowAddModal(true);
    };

    const handleDeleteClick = (e, dept) => {
        e.stopPropagation();
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
        <div className={deptStyles.pageContainer}>
            <div className={deptStyles.background}>
                {/* Reusing existing background if needed, or simplified */}
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb1}`} />
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb2}`} />
                <div className={deptStyles.gridOverlay} />
            </div>

            {/* Left Sidebar */}
            <div className={deptStyles.sidebar}>
                <div className={deptStyles.sidebarHeader}>
                    <h2 className={deptStyles.sidebarTitle}>Departments</h2>
                    <button
                        className={deptStyles.addBtn}
                        onClick={() => setShowAddModal(true)}
                        title="Add Department"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className={deptStyles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search departments..."
                        className={deptStyles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={deptStyles.departmentList}>
                    {loading ? (
                        <div className={deptStyles.loaderWrapper}>
                            <WevoisLoader title="Loading Departments..." />
                        </div>
                    ) : filteredDepartments.length > 0 ? (
                        filteredDepartments.map((dept) => (
                            <div
                                key={dept.id}
                                className={`${deptStyles.departmentCard} ${selectedDept?.id === dept.id ? deptStyles.activeCard : ''}`}
                                onClick={() => setSelectedDept(dept)}
                            >
                                <div className={deptStyles.cardContent}>
                                    <div className={deptStyles.cardHeader}>
                                        <h3 className={deptStyles.cardTitle}>{dept.name}</h3>
                                        <span className={deptStyles.cardCode}>{dept.code}</span>
                                    </div>
                                    <div className={deptStyles.cardActions}>
                                        <button
                                            onClick={(e) => handleEdit(e, dept)}
                                            className={deptStyles.actionBtn}
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(e, dept)}
                                            className={deptStyles.deleteBtn}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={deptStyles.noResult}>
                            <NoResult label="No Departments Found" />
                        </div>
                    )}
                </div>
            </div>

            {/* Right Content Area (Placeholder for now) */}
            <div className={deptStyles.mainContent}>
                {selectedDept ? (
                    <div className={deptStyles.detailsPlaceholder}>
                        <h2>{selectedDept.name}</h2>
                        <p>Department Code: {selectedDept.code}</p>
                        <p className={deptStyles.placeholderText}>Select an option to view details</p>
                    </div>
                ) : (
                    <div className={deptStyles.emptyState}>
                        <h3>Select a Department</h3>
                        <p>Choose a department from the sidebar to view details</p>
                    </div>
                )}
            </div>

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
