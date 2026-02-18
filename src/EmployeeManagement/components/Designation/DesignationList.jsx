import NoResult from "../../../components/NoResultFound/NoResult";
import deptStyles from "../../Styles/Department/Department.module.css";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AddDesignation from "./AddDesignation";

const DesignationList = (props) => {

    const handleAddDesignationClick = () => {
        props.setDesignationToEdit(null);
        props.setShowAddDesignation(true);
    };

    const handleSaveDesignation = (designation) => {
        if (!props.selectedDept) return;
        const deptId = props.selectedDept.id;
        props.setDesignationsByDept(prev => {
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
        props.setShowAddDesignation(false);
        props.setDesignationToEdit(null);
    };

    return (
        <>
            <div className={deptStyles.mainContent}>
                {props.selectedDept ? (
                    <div style={{ width: '100%' }}>
                        <div className={deptStyles.designationHeader}>
                            <div>
                                <h2 style={{ margin: 0 }}>{props.selectedDept.name}</h2>
                                <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Department Code: {props.selectedDept.code}</p>
                            </div>
                            <div>
                                <button className={deptStyles.addDesignationBtn} onClick={handleAddDesignationClick} title="Add Designation">
                                    <Plus size={14} />&nbsp;Add Designation
                                </button>
                            </div>
                        </div>

                        <div ref={props.designationListRef} className={deptStyles.designationList}>
                            {((props.designationsByDept[props.selectedDept.id] || []).length > 0) ? (
                                (props.designationsByDept[props.selectedDept.id] || []).map((des) => (
                                    <div key={des.id} className={deptStyles.designationCard}>
                                        <div>
                                            <div className={deptStyles.designationName}>{des.name}</div>
                                            {des.code && <div className={deptStyles.cardCode} style={{ marginTop: 6 }}>{des.code}</div>}
                                        </div>
                                        <div className={deptStyles.designationActions}>
                                            <button onClick={(e) => props.handleEditDesignation(e, des)} className={deptStyles.actionBtn} title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={(e) => props.handleDeleteDesignation(e, des)} className={deptStyles.deleteBtn} title="Delete">
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
                        <h3>No Designation Found in this department.</h3>
                        <p>There are no designation to show. Click the + button to add one.</p>
                    </div>
                )}
            </div>
            <AddDesignation
                showCanvas={props.showAddDesignation}
                setShowCanvas={(val) => props.setShowAddDesignation(val)}
                onSave={handleSaveDesignation}
                initialData={props.designationToEdit}
            />
        </>
    )
}

export default DesignationList