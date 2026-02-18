import { useEffect, useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AddDesignation from "./AddDesignation";
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import NoResult from "../../../components/NoResultFound/NoResult";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import { getDesignationByDepartmentAction, handleDesignationDelete } from "../../Action/Designation/DesignationAction";

const DesignationList = (props) => {
    const [showDeleteDesignation, setShowDeleteDesignation] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [designationItems, setDesignationItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const departmentId = 12;

    const loadDesignations = () => {
        getDesignationByDepartmentAction(departmentId, setDesignationItems, setLoading);
    };

    useEffect(() => {
        loadDesignations();
    }, []);

    const openEdit = (item) => {
        setSelectedDesignation(item);
        props.setShowAddDesignation(true);
    };

    const openDelete = (item) => {
        setSelectedDesignation(item);
        setShowDeleteDesignation(true);
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
                                onClick={() => {
                                    setSelectedDesignation(null);
                                    props.setShowAddDesignation(true);
                                }}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={deptStyles.designationList}>
                        {loading ? (
                            <WevoisLoader title="Loading Designations..." />
                        ) : designationItems.length > 0 ? (
                            designationItems.map((item) => (
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
                                        <button className={deptStyles.actionBtn} title="Edit" onClick={() => openEdit(item)}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className={deptStyles.deleteBtn} title="Delete" onClick={() => openDelete(item)}>
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
                onSaveSuccess={loadDesignations}
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
                buttonText="Delete"
                iconType="warning"
                warningText="This action cannot be undone."
                onCancel={() => setShowDeleteDesignation(false)}
                onConfirm={() =>
                    handleDesignationDelete({
                        selectedDesignation,
                        departmentId,
                        setIsDeleting,
                        setShowDeleteDesignation,
                        onSuccessRefresh: loadDesignations,
                    })
                }
                disabled={isDeleting}
            />
        </>
    );
};

export default DesignationList;
