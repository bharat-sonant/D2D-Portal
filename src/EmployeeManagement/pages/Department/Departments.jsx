import { useState, useEffect, useRef } from "react";
import deptStyles from "../../Styles/Department/Department.module.css";
import { getDepartmentsAction, deleteDepartmentAction } from "../../../services/DepartmentService/DepartmentAction";
import * as common from "../../../common/common";
import DepartmentList from "../../components/Department/DepartmentList";
import DesignationList from "../../components/Designation/DesignationList";

const Departments = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deptToEdit, setDeptToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [showAddDesignation, setShowAddDesignation] = useState(false);

    const [designationsByDept, setDesignationsByDept] = useState({});
    const [designationToEdit, setDesignationToEdit] = useState(null);
    const designationListRef = useRef(null);


    // Fetch Departments on Mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (departments && departments.length > 0 && !selectedDept) {
            setSelectedDept(departments[0]);
        }
        if (departments && departments.length === 0) {
            setSelectedDept(null);
        }
    }, [departments]);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('designations') || '{}');
            setDesignationsByDept(saved || {});
        } catch (e) {
            setDesignationsByDept({});
        }
    }, []);


    // when selected department changes, scroll designation list to top
    useEffect(() => {
        if (designationListRef.current) designationListRef.current.scrollTop = 0;
    }, [selectedDept]);

    // Filter departments when search query or departments change

    const fetchDepartments = () => {
        getDepartmentsAction(setDepartments, setLoading);
    };



    // Handle Modal Close
    const handleCloseModal = () => {
        setShowAddModal(false);
        setDeptToEdit(null); // Reset edit state
    };



    const handleEditDesignation = (e, des) => {
        e.stopPropagation();
        setDesignationToEdit(des);
        setShowAddDesignation(true);
    };


    const handleDeleteDesignation = (e, des) => {
        e.stopPropagation();
        if (!selectedDept) return;
        const deptId = selectedDept.id;
        setDesignationsByDept(prev => {
            const list = prev[deptId] ? [...prev[deptId]] : [];
            const updated = list.filter(d => d.id !== des.id);
            const newState = { ...prev, [deptId]: updated };
            localStorage.setItem('designations', JSON.stringify(newState));
            return newState;
        });
    };

    return (
        <>
            <div className={deptStyles.background}>
                {/* Reusing existing background if needed, or simplified */}
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb1}`} />
                <div className={`${deptStyles.gradientOrb} ${deptStyles.orb2}`} />
                <div className={deptStyles.gridOverlay} />
            </div>

            {/* Left Sidebar */}
            <DepartmentList
                setDeptToDelete={setDeptToDelete}
                setDeptToEdit={setDeptToEdit}
                setShowDeleteModal={setShowDeleteModal}
                setShowAddModal={setShowAddModal}
                departments={departments}
                filteredDepartments={filteredDepartments}
                setFilteredDepartments={setFilteredDepartments}
                selectedDept={selectedDept}
                setSelectedDept={setSelectedDept}
                loading={loading}
                handleCloseModal={handleCloseModal}
                fetchDepartments={fetchDepartments}
                showAddModal={showAddModal}
                deptToEdit={deptToEdit}
                deptToDelete={deptToDelete}
                showDeleteModal={showDeleteModal}
                setIsDeleting={setIsDeleting}
            />

            {/* Right Content Area */}
            <DesignationList
                selectedDept={selectedDept}
                designationsByDept={designationsByDept}
                designationListRef={designationListRef}
                handleEditDesignation={handleEditDesignation}
                handleDeleteDesignation={handleDeleteDesignation}
                setShowAddDesignation={setShowAddDesignation}
                setDesignationToEdit={setDesignationToEdit}
                showAddDesignation={showAddDesignation}
                designationToEdit={designationToEdit}
            />


        </>
    );
};

export default Departments;
