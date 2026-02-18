import React, { useState, useEffect, useRef } from "react";
import deptStyles from "./Departments.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import WevoisLoader from "../../components/Common/Loader/WevoisLoader";
import AddDepartment from "../components/AddDepartment";
import AddDesignation from "../components/AddDesignation";
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
    const [designationsByDept, setDesignationsByDept] = useState({});
    const [showAddDesignation, setShowAddDesignation] = useState(false);
    const [designationToEdit, setDesignationToEdit] = useState(null);

    // Fetch Departments on Mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    // When departments load, select first by default
    useEffect(() => {
        if (departments && departments.length > 0 && !selectedDept) {
            setSelectedDept(departments[0]);
        }
        if (departments && departments.length === 0) {
            setSelectedDept(null);
        }
    }, [departments]);

    // Load designations from localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('designations') || '{}');
            setDesignationsByDept(saved || {});
        } catch (e) {
            setDesignationsByDept({});
        }
    }, []);

    const designationListRef = useRef(null);

    // when selected department changes, scroll designation list to top
    useEffect(() => {
        if (designationListRef.current) designationListRef.current.scrollTop = 0;
    }, [selectedDept]);

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

    const handleAddDesignationClick = () => {
        setDesignationToEdit(null);
        setShowAddDesignation(true);
    };

    const handleEditDesignation = (e, des) => {
        e.stopPropagation();
        setDesignationToEdit(des);
        setShowAddDesignation(true);
    };

    const handleSaveDesignation = (designation) => {
        if (!selectedDept) return;
        const deptId = selectedDept.id;
        setDesignationsByDept(prev => {
            const list = prev[deptId] ? [...prev[deptId]] : [];
            let updated;
            if (designation.id) {
                updated = list.map(d => d.id === designation.id ? designation : d);
            } else {
                const newItem = { ...designation, id: Date.now().toString() };
                updated = [newItem, ...list];
            }
            const newState = { ...prev, [deptId]: updated };
            localStorage.setItem('designations', JSON.stringify(newState));
            return newState;
        });
        setShowAddDesignation(false);
        setDesignationToEdit(null);
    };

    const handleDeleteDesignation = (e, des) => {
        e.stopPropagation();
        if (!selectedDept) return;
        const deptId = selectedDept.id;
        setDesignationsByDept(prev => {
            const list = prev[deptId] ? [...prev[deptId]] : [];
            const updated = list.filter(d => d.id !== des.id);
            const newState = { ...prev, [deptId]: updated };
            localStorage.setItem('designations', JSON.stringify(newState));
            return newState;
        });
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

            {/* Right Content Area */}
            <div className={deptStyles.mainContent}>
                {selectedDept ? (
                    <div style={{ width: '100%' }}>
                        <div className={deptStyles.designationHeader}>
                            <div>
                                <h2 style={{ margin: 0 }}>{selectedDept.name}</h2>
                                <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Department Code: {selectedDept.code}</p>
                            </div>
                            <div>
                                <button className={deptStyles.addDesignationBtn} onClick={handleAddDesignationClick} title="Add Designation">
                                    <Plus size={14} />&nbsp;Add Designation
                                </button>
                            </div>
                        </div>

                        <div ref={designationListRef} className={deptStyles.designationList}>
                            {((designationsByDept[selectedDept.id] || []).length > 0) ? (
                                (designationsByDept[selectedDept.id] || []).map((des) => (
                                    <div key={des.id} className={deptStyles.designationCard}>
                                        <div>
                                            <div className={deptStyles.designationName}>{des.name}</div>
                                            {des.code && <div className={deptStyles.cardCode} style={{ marginTop: 6 }}>{des.code}</div>}
                                        </div>
                                        <div className={deptStyles.designationActions}>
                                            <button onClick={(e) => handleEditDesignation(e, des)} className={deptStyles.actionBtn} title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={(e) => handleDeleteDesignation(e, des)} className={deptStyles.deleteBtn} title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={deptStyles.noDesignation}>
                                    <NoResult label="No Designations Found" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={deptStyles.emptyState}>
                        <h3>No Departments</h3>
                        <p>There are no departments to show. Click the + button to add one.</p>
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

            <AddDesignation
                showCanvas={showAddDesignation}
                setShowCanvas={(val) => setShowAddDesignation(val)}
                onSave={handleSaveDesignation}
                initialData={designationToEdit}
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
