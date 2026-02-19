import { useEffect, useState } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import DepartmentList from "../../components/Department/DepartmentList";
import DesignationList from "../../components/Designation/DesignationList";
import { getAllDepartmentData } from "../../Action/Department/DepartmentAction";

const Departments = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddDesignation, setShowAddDesignation] = useState(false);
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentLoading, setDepartmentLoading] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

    useEffect(() => {
        getAllDepartmentData(setDepartmentData, setDepartmentLoading)
    }, []);

    useEffect(() => {
        if (!selectedDepartmentId && departmentData.length > 0) {
            setSelectedDepartmentId(departmentData[0].id);
        }
    }, [departmentData, selectedDepartmentId]);

    const handleSelectDepartment = (item) => {
        setSelectedDepartmentId(item.id);
    }

    const handleDepartmentSuccess = (departmentItem, mode) => {
        if (!departmentItem?.id) return;

        setDepartmentData((prev) => {
            if (mode === "edit") {
                return prev.map((item) =>
                    String(item.id) === String(departmentItem.id)
                        ? { ...item, ...departmentItem }
                        : item
                );
            }

            const exists = prev.some((item) => String(item.id) === String(departmentItem.id));
            if (exists) return prev;
            return [departmentItem, ...prev];
        });
    };

    const handleDepartmentDelete = (departmentId) => {
        setDepartmentData((prev) => prev.filter((item) => String(item.id) !== String(departmentId)));
        setSelectedDepartmentId((prev) => (String(prev) === String(departmentId) ? null : prev));
    };

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
                loading={departmentLoading}
                onDepartmentSuccess={handleDepartmentSuccess}
                onDepartmentDelete={handleDepartmentDelete}
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
