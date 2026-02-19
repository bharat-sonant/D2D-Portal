import { useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import NoResult from "../../../components/NoResultFound/NoResult";
import AddDepartment from "./AddDepartment";
import * as action from "../../Action/Department/DepartmentAction";
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";

const DepartmentList = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const filteredDepartments = action.getFilteredDepartments(props.departmentData, searchQuery);

    const confirmDelete = async () => {
        action.deleteDepartmentData(
            selectedDepartment,
            setShowDeleteModal,
            setSelectedDepartment,
            props.onDepartmentDelete
        );
    };

    return (
        <>
            <div className={deptStyles.sidebar}>
                <div className={deptStyles.sidebarHeader}>
                    <h2 className={deptStyles.sidebarTitle}>Departments</h2>
                    <button
                        className={deptStyles.addBtn}
                        onClick={() => action.openDepartmentAddModal(setSelectedDepartment, props.setShowAddModal)}
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
                        <WevoisLoader title="Loading Departments..." />
                    ) : filteredDepartments.length > 0 ? (
                        filteredDepartments.map((dept) => {
                            const isSelected = String(props.selectedDepartmentId) === String(dept.id);

                            return (
                                <div
                                    key={dept.id}
                                    className={`${deptStyles.departmentCard} ${isSelected ? deptStyles.activeCard : ""}`}
                                    onClick={() => props.handleSelectDepartment(dept)}
                                >
                                    <div className={deptStyles.cardContent}>
                                        <div className={deptStyles.cardHeader}>
                                            <h3 className={deptStyles.cardTitle}>{dept.name}</h3>
                                            <span className={deptStyles.cardCode}>{dept.code}</span>
                                        </div>
                                        <div className={deptStyles.cardActions}>
                                            <button
                                                onClick={(e) => action.openDepartmentEditModal(e, dept, setSelectedDepartment, props.setShowAddModal)}
                                                className={deptStyles.actionBtn}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => action.openDepartmentDeleteModal(e, dept, setSelectedDepartment, setShowDeleteModal)}
                                                className={deptStyles.deleteBtn}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
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
                onSuccess={props.onDepartmentSuccess}
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
