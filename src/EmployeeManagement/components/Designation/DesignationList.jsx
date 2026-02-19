import { useEffect, useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AddDesignation from "./AddDesignation";
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import NoResult from "../../../components/NoResultFound/NoResult";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import * as action from "../../Action/Designation/DesignationAction";
 

const DesignationList = (props) => {
    const [showDeleteDesignation, setShowDeleteDesignation] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [designationItems, setDesignationItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    // Sort alphabetically by name
    const sortedDesignations = [...designationItems].sort((a, b) => a.name.localeCompare(b.name));

    const loadDesignations = () => {
        action.getDesignationByDepartment(props.departmentId, setDesignationItems, setLoading);
    };

    useEffect(() => {
        if (props.departmentId) {
            loadDesignations();
        }
    }, [props.departmentId]);

    const deleteDesignation = () => {
        action.handleDesignationDelete(
            selectedDesignation,
            props.departmentId,
            setIsDeleting,
            setShowDeleteDesignation,
            (deletedId) => {
                setDesignationItems((prev) => action.removeDesignationFromList(prev, deletedId));
                setSelectedDesignation(null);
            }
        )
    };

    const handleDesignationSuccess = (designationItem, mode) => {
        setDesignationItems((prev) => action.upsertDesignationInList(prev, designationItem, mode));
    };

    return (
        <>
            <div className={deptStyles.mainContent}>
                <div style={{ width: "100%" }}>
                    <div className={deptStyles.designationHeader}>
                        <div>
                            <h5 style={{ margin: 0 }}>Designation</h5>
                        </div>
                        <div>
                            <button
                                className={deptStyles.addDesignationBtn}
                                title="Add Designation"
                                onClick={() => action.openDesignationAddModal(setSelectedDesignation, props.setShowAddDesignation)}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={deptStyles.designationList}>
                        {loading ? (
                            <WevoisLoader title="Loading Designations..." />
                        ) : sortedDesignations.length > 0 ? (
                            sortedDesignations.map((item) => (
                                <div key={item.id || item.designation_id} className={deptStyles.designationCard}>
                                    <div>
                                        <div className={deptStyles.designationName}>{item.name}</div>
                                        {item.code && (
                                            <div className={deptStyles.cardCode} style={{ marginTop: 6 }}>
                                                {item.code}
                                            </div>
                                        )}
                                    </div>
                                    <div className={deptStyles.designationActions}>
                                        <button className={deptStyles.actionBtn} title="Edit" onClick={() => action.openDesignationEditModal(item, setSelectedDesignation, props.setShowAddDesignation)}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className={deptStyles.deleteBtn} title="Delete" onClick={() => action.openDesignationDeleteModal(item, setSelectedDesignation, setShowDeleteDesignation)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <NoResult title="No Designations Found" />
                        )}
                    </div>
                </div>
            </div>
            <AddDesignation
                showCanvas={props.showAddDesignation}
                setShowCanvas={props.setShowAddDesignation}
                initialData={selectedDesignation}
                departmentId={props.departmentId}
                onSuccess={handleDesignationSuccess}
            />

            <GlobalAlertModal
                show={showDeleteDesignation}
                title="Delete Designation"
                message={
                    <>
                        Are you sure you want to delete{" "}
                        <strong className={globalAlertStyles.warningName}>
                            {selectedDesignation?.name}
                        </strong>
                        ?
                    </>
                }
                buttonText={isDeleting ? "Please wait..." : "Delete"}
                iconType="warning"
                warningText="This action cannot be undone."
                onCancel={() => {
                    if (!isDeleting) setShowDeleteDesignation(false);
                }}
                onConfirm={deleteDesignation}
                disabled={isDeleting}
                isLoading={isDeleting}
            />
        </>
    );
};

export default DesignationList;
