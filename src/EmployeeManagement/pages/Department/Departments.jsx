import { useEffect, useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import DepartmentList from "../../components/Department/DepartmentList";
import DesignationList from "../../components/Designation/DesignationList";
import { getDepartments } from "../../Action/Department/DepartmentAction";

const Departments = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddDesignation, setShowAddDesignation] = useState(false);
    const [departmentData, setDepartmentData] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

    useEffect(() => {
        getDepartments(setDepartmentData)
    }, []);

    const handleSelectDepartment = (item) => {
        setSelectedDepartmentId(item.id);
    }

    return (
        <div style={{ display: 'flex', position: 'absolute', top: '65px' }}>
            <div className={deptStyles.background}>
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb1}`} />
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb2}`} />
                <div className={deptStyles.gridOverlay} />
            </div>

            <DepartmentList
                setShowAddModal={setShowAddModal}
                showAddModal={showAddModal}
                departmentData={departmentData}
                handleSelectDepartment={handleSelectDepartment}
                selectedDepartmentId={selectedDepartmentId}
            // refreshDepartments={() => getDepartments(setDepartmentData)}
            />
            {selectedDepartmentId && (
                <DesignationList
                    setShowAddDesignation={setShowAddDesignation}
                    showAddDesignation={showAddDesignation}
                    departmentId={selectedDepartmentId}
                />
            )}
        </div>
    );
};

export default Departments;
