import { useEffect, useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import NoResult from "../../../components/NoResultFound/NoResult";
import WevoisLoader from '../../../components/Common/Loader/WevoisLoader';
import AddDepartment from "./AddDepartment";
import * as common from '../../../common/common';
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import { deleteDepartmentAction } from "../../../services/DepartmentService/DepartmentAction";

const DepartmentList = (props) => {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!props.departments) return;
        const filtered = props.departments.filter(dept =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        props.setFilteredDepartments(filtered);
    }, [searchQuery, props.departments]);

    const handleEdit = (e, dept) => {
        e.stopPropagation();
        props.setDeptToEdit(dept);
        props.setShowAddModal(true);
    };

    const handleDeleteClick = (e, dept) => {
        e.stopPropagation();
        props.setDeptToDelete(dept);
        props.setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        props.setShowDeleteModal(false);
        props.setDeptToDelete(null);
    };

    const confirmDelete = async () => {
        if (!props.deptToDelete) return;

        props.setIsDeleting(true);
        await deleteDepartmentAction(
            props.deptToDelete.id,
            (msg) => {
                props.setIsDeleting(false);
                props.setShowDeleteModal(false);
                props.setDeptToDelete(null);
                common.setAlertMessage("success", "Department deleted successfully");
                props.fetchDepartments();
            },
            (err) => {
                props.setIsDeleting(false);
                props.setShowDeleteModal(false);
                props.setDeptToDelete(null);
                common.setAlertMessage("error", err || "Failed to delete department");
            }
        );
    };

    return (
        <>
            <div className={deptStyles.sidebar}>
                <div className={deptStyles.sidebarHeader}>
                    <h2 className={deptStyles.sidebarTitle}>Departments</h2>
                    <button
                        className={deptStyles.addBtn}
                        onClick={() => props.setShowAddModal(true)}
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
                    {props.loading ? (
                        <div className={deptStyles.loaderWrapper}>
                            <WevoisLoader title="Loading Departments..." />
                        </div>
                    ) : props.filteredDepartments.length > 0 ? (
                        props.filteredDepartments.map((dept) => (
                            <div
                                key={dept.id}
                                className={`${deptStyles.departmentCard} ${props.selectedDept?.id === dept.id ? deptStyles.activeCard : ''}`}
                                onClick={() => props.setSelectedDept(dept)}
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
            <AddDepartment
                showCanvas={props.showAddModal}
                setShowCanvas={props.handleCloseModal}
                onRefresh={(msg) => {
                    props.fetchDepartments();
                    if (msg) common.setAlertMessage("success", msg);
                }}
                initialData={props.deptToEdit}
            />


            {props.showDeleteModal && (
                <GlobalAlertModal
                    show={props.showDeleteModal}
                    title="Confirm Deletion"
                    message={
                        <>
                            Are you sure you want to delete department{" "}
                            <strong className={globalAlertStyles.warningName}>
                                {props.deptToDelete?.name}
                            </strong>
                            ?
                        </>
                    }
                    buttonText={props.isDeleting ? "Deleting..." : "Yes, Delete"}
                    buttonGradient="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                    iconType="warning"
                    warningText="This action cannot be undone and will remove all associated data."
                    onCancel={handleCancelDelete}
                    onConfirm={confirmDelete}
                    disabled={props.isDeleting}
                />
            )}
        </>
    )
}

export default DepartmentList