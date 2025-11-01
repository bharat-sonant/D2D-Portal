import  { useEffect, useRef, useState } from "react";
import styles from "../../assets/css/FilterDropdown/FilterDropdown.module.css";
import { getEmployeeThoseHaveTaskPageAccess } from "../../services/Dashboard/dashboardServices";

export const TechEmployeeFilter = (props) => {
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [employee, setEmployee] = useState([])
    const [selectedUser, setSelectedUser] = useState('')

    const Company = localStorage.getItem("company");
    useEffect(() => {
        getEmployeeThoseHaveTaskPageAccess(Company).then((response) => {
            if (response.status === 'success') {

                setEmployee(response.data)
            } else {
                setEmployee([])
            }
        })
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);



    const handleEmployeeSelection = (emp) => {
        props.setEmpCode(emp.empCode)
        // let filteredTasks;
        // if (emp.empCode === "all") {
        //     filteredTasks = props.allTasks.filter(task =>
        //         props.selectedStatus.length > 0
        //             ? props.selectedStatus.some(selectedOption => selectedOption.id === Number(task.status))
        //             : true
        //     );
        //     const allEmployees = { empCode: "all", name: " Select All" };
        //     props.setSelectedUser(allEmployees);
        //     localStorage.setItem("selectedEmployee", JSON.stringify(allEmployees));
        // } else {
        //     if (emp.empCode && props.selectedStatus.length > 0) {
        //         filteredTasks = props.allTasks.filter(
        //             (task) =>
        //                 props.selectedStatus.some((selectedOption) => selectedOption.id === Number(task.status)) &&
        //                 task.owner == emp.empCode
        //         );
        //     } else {
        //         filteredTasks = props.allTasks.filter((task) => task.owner == emp.empCode);
        //     }
        //     props.setSelectedUser(emp);
        //     localStorage.setItem("selectedEmployee", JSON.stringify(emp));
        // }

        // props.setTasksList(filteredTasks);
        setSelectedUser(emp)
        setDropdownOpen(false);
    };


    return (
        <div className={`dropdown `} ref={dropdownRef}>
            <button
                className={`btn   ${styles.dropdowmbtn}`}
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ minWidth: '250px' }}
            >
                <div className={styles.projectNaam}>
                    {selectedUser?.name
                        ? selectedUser.name || "Select Employee"
                        : "Select Employee"}
                </div>
            </button>

            {dropdownOpen && (
                <ul
                    className={`dropdown-menu newSelectDropdown selectDropdown show ${styles.selectedProject}`}
                    style={{
                        maxHeight: '500px', overflowY: 'auto', width: '400px', width: '100%', minWidth: '250px', maxWidth: '100%'
                    }}
                >
                    {employee &&
                        employee.map((emp) => (
                            <li
                                key={emp.empCode}
                                className={`${styles.customDropdownLIList}`}
                            >
                                <button
                                    className={`${styles.customDropdownItem}`}
                                    onClick={() => handleEmployeeSelection(emp)}
                                >
                                    {emp.name}
                                </button>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};
