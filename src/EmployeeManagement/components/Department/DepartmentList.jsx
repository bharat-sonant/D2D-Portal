import { useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import NoResult from "../../../components/NoResultFound/NoResult";
import AddDepartment from "./AddDepartment";
import { deleteDepartment } from "../../Action/Department/DepartmentAction";
import * as common from "../../../common/common";
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../../components/GlobalAlertModal/GlobalAlertModal.module.css";

const DepartmentList = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const filteredDepartments = props.departmentData.filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (e, dept) => {
        e.stopPropagation();
        setSelectedDepartment(dept);
        props.setShowAddModal(true);
    };

    const handleDelete = (e, dept) => {
        e.stopPropagation();
        setSelectedDepartment(dept);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedDepartment?.id) return;
        const success = await deleteDepartment(selectedDepartment.id);
        if (success) {
            common.setAlertMessage("success", "Department deleted successfully");
            props.refreshDepartments && props.refreshDepartments();
        } else {
            common.setAlertMessage("error", "Unable to delete department. Try again.");
        }
        setShowDeleteModal(false);
        setSelectedDepartment(null);
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
                    {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((dept) => (
                            <div key={dept.id} className={deptStyles.departmentCard}>
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
                                            onClick={(e) => handleDelete(e, dept)}
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
                setShowCanvas={() => props.setShowAddModal(false)}
                initialData={selectedDepartment}
                onSuccess={props.refreshDepartments}
            />
            <GlobalAlertModal
                show={showDeleteModal}
                title="Delete Department"
                message={
                    <>
                        Are you sure you want to delete{" "}
                        <strong className={globalAlertStyles.warningName}>
                            {selectedDepartment?.name}
                        </strong>
                        ?
                    </>
                }
                buttonText="Delete"
                buttonGradient="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                iconType="warning"
                warningText="Design preview only. No action will be performed."
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </>
    );
};

export default DepartmentList;
