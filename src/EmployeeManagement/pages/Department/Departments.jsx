import { useEffect, useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import DepartmentList from "../../components/Department/DepartmentList";
import DesignationList from "../../components/Designation/DesignationList";
import { getDepartments } from "../../Action/Department/DepartmentAction";

const Departments = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddDesignation, setShowAddDesignation] = useState(false);
    const [departmentData, setDepartmentData] = useState([]);

    useEffect(() => {
        getDepartments(setDepartmentData)
    }, []);

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
            />

            <DesignationList
                setShowAddDesignation={setShowAddDesignation}
                showAddDesignation={showAddDesignation}
            />
        </div>
    );
};

export default Departments;
