import { useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AddDesignation from "./AddDesignation";
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../../components/GlobalAlertModal/GlobalAlertModal.module.css";

const DesignationList = (props) => {
    const [showEditDesignation, setShowEditDesignation] = useState(false);
    const [showDeleteDesignation, setShowDeleteDesignation] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);

    const designationItems = [
        { id: 1, name: "HR Manager", code: "HR-MGR" },
        { id: 2, name: "Senior Recruiter", code: "HR-SR" },
        { id: 3, name: "Payroll Executive", code: "HR-PAY" }
    ];

    const openEdit = (item) => {
        setSelectedDesignation(item);
        setShowEditDesignation(true);
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
                                onClick={() => props.setShowAddDesignation(true)}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={deptStyles.designationList}>
                        {designationItems.map((item) => (
                            <div key={item.id} className={deptStyles.designationCard}>
                                <div>
                                    <div className={deptStyles.designationName}>{item.name}</div>
                                    <div className={deptStyles.cardCode} style={{ marginTop: 6 }}>
                                        {item.code}
                                    </div>
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
                        ))}
                    </div>
                </div>
            </div>
            <AddDesignation
                showCanvas={showEditDesignation}
                setShowCanvas={setShowEditDesignation}
                initialData={selectedDesignation}
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
                warningText="Design preview only. No action will be performed."
                onCancel={() => setShowDeleteDesignation(false)}
                onConfirm={() => setShowDeleteDesignation(false)}
            />
        </>
    );
};

export default DesignationList;
