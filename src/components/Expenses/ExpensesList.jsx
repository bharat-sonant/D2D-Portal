import { useEffect, useRef, useState } from 'react';
import styles from '../../Style/Expense/ExpenseList.module.css';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import ExpensesRecord from './ExpensesRecord';
import { getAllEmployeesWithExpenses, getAllEmpOfApprover } from '../../services/MainExpense/ExpenseService';

const ExpensesList = (props) => {
    const company = localStorage.getItem('company');
    const empCode = localStorage.getItem('empCode');

    const [totalAmount, setTotalAmount] = useState(0)
    const [employeeList, setEmployeeList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);

    const yearDropdownRef = useRef(null);
    const monthDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
                setIsYearOpen(false);
            }

            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
                setIsMonthOpen(false);
            }
        };

        if (isYearOpen || isMonthOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isYearOpen, isMonthOpen]);

    const handleYearSelect = (year) => {
        props.setSelectedYear(year);
        setIsYearOpen(false);
    };

    const handleMonthSelect = (monthIndex) => {
        props.setSelectedMonth(monthIndex + 1);
        setIsMonthOpen(false);
    };

    const handleEmployeeSelect = (emp) => {
        props.setSelectedEmployee(emp.employeeCode);
        setSelectedEmployeeName(emp.employeeName);
        setIsEmployeeOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) {
                setIsEmployeeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (props.ownerPanel) {
            getAllEmployeesWithExpenses(company, empCode).then((resp) => {
                if (resp.status === 'success') {
                    const sortedEmployees = resp.data.sort((a, b) => {
                        return a.employeeName.localeCompare(b.employeeName);
                    });
                    setEmployeeList(sortedEmployees);

                    if (sortedEmployees.length > 0) {
                        props.setSelectedEmployee(sortedEmployees[0].employeeCode);
                        setSelectedEmployeeName(sortedEmployees[0].employeeName);
                    }
                } else {
                    setEmployeeList([]);
                }
            });
        }
    }, [props.ownerPanel]);

    useEffect(() => {
        if (props.approverOrNot || props.checkReviewerOrNot || props.checkReimburseOrNot) {
            getAllEmpOfApprover(company, empCode).then((resp) => {
                if (resp.status === 'success') {
                    const sortedEmployees = resp.data.sort((a, b) => {
                        return a.employeeName.localeCompare(b.employeeName);
                    });
                    setEmployeeList(sortedEmployees);

                    if (sortedEmployees.length > 0) {
                        props.setSelectedEmployee(sortedEmployees[0].employeeCode);
                        setSelectedEmployeeName(sortedEmployees[0].employeeName);
                    }
                } else {
                    setEmployeeList([]);
                }
            });
        }
    }, [props.employeeView]);

    return (
        <>
            <div className={`dropdown ${GlobalStyles.dropDown}`}>
                <button
                    className={`${GlobalStyles.dropdownBtn} ${styles.hideDesktop}`}
                    type="button"
                    id="dropdownMenuButton"
                >
                    <h4
                        className={`${GlobalStyles.dropdownText}`}
                        style={{ color: "#333333", fontWeight: "500" }}
                    >
                        Select Employee
                    </h4>
                    <img
                        src={images.iconDown}
                        className={`${GlobalStyles.iconDown}`}
                        title="Icon Down"
                        alt="Dropdown Arrow"
                    />
                </button>

                <div className={`${GlobalStyles.overlay}`} style={{ display: "block" }}>
                    <ul className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown} ${styles.scrollableDropdown}`}
                        aria-labelledby="dropdownMenuButton">
                        <div className={styles.filterHeader}>
                            <div className={`${styles.filterContainer} ${styles.fixedHeader}`} >
                                <div className={`dropdown ${styles.dropDownwwwp}`} ref={yearDropdownRef} >
                                    <button
                                        className={`btn ${styles.dropdowmbtn}`}
                                        type="button"
                                        onClick={() => { setIsYearOpen(!isYearOpen); setIsEmployeeOpen(false) }}
                                    >
                                        <div className={styles.projectNaam}>
                                            {props.selectedYear || 'Select Year'}
                                        </div>
                                    </button>

                                    {isYearOpen && (
                                        <ul className={`dropdown-menu newExpenseDropdown show ${styles.selectedProject}`}>
                                            {props.years.map((year) => (
                                                <li
                                                    key={year}
                                                    className={`${styles.customDropdownLI}`}
                                                    onClick={() => handleYearSelect(year)}
                                                >
                                                    <button className={styles.customDropdownItem}>
                                                        {year}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Month Dropdown */}
                                <div className={`dropdown ${styles.dropDownwwwp}`} ref={monthDropdownRef} >
                                    <button
                                        className={`btn ${styles.dropdowmbtn}`}
                                        type="button"
                                        onClick={() => { setIsMonthOpen(!isMonthOpen); setIsEmployeeOpen(false) }}
                                    >
                                        <div className={styles.projectNaam}>
                                            {props.selectedMonth
                                                ? props.months[props.selectedMonth - 1]
                                                : 'Select Month'}
                                        </div>
                                    </button>

                                    {isMonthOpen && (
                                        <ul className={`dropdown-menu newExpenseDropdown show ${styles.selectedProject}`}>
                                            {props.months.map((month, index) => (
                                                <li
                                                    key={index}
                                                    className={`${styles.customDropdownLI}`}
                                                    onClick={() => handleMonthSelect(index)}
                                                >
                                                    <button className={styles.customDropdownItem}>
                                                        {month}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.totalUserbg} ${styles.dropDownwwwp}`} >
                                <p >
                                    <img
                                        src={images.iconRupee}
                                        className={`${styles.iconRupee}`}
                                    />
                                    {parseFloat(Math.floor(totalAmount * 100) / 100).toFixed(2)}
                                </p>
                                <h5 className={styles.UserIcon}>Total Expense</h5>
                            </div>

                        </div>

                        {((props?.employeeView || props.ownerPanel) && employeeList?.length > 0) && (
                            <div className={styles.filterselect}>
                                <div className={`dropdown ${styles.dropDownwwwp}`}>
                                    <button
                                        className={`btn ${styles.dropdowmbtn} ${styles.dropwidth}`}
                                        type="button"
                                        onClick={() => {
                                            setIsEmployeeOpen(!isEmployeeOpen);
                                            setSearchTerm(''); // Reset search on open
                                        }}
                                    >
                                        <div className={styles.projectNaam}>
                                            {selectedEmployeeName || 'Select Employee'}
                                        </div>
                                    </button>

                                    {isEmployeeOpen && (
                                        <ul className={`dropdown-menu newExpenseDropdown show ${styles.selectedProject} ${styles.selectWidth}`}>
                                            <li className={styles.searchInputWrapper}>
                                                <div className={`${GlobalStyles.searchGroup} pt-0`} style={{ padding: '0px' }} >
                                                    <input
                                                        className={`${GlobalStyles.inputSearch}`}
                                                        type="text"
                                                        placeholder="Search Employees"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />

                                                </div>
                                            </li>
                                            <div className={styles.scrollList}>
                                                {employeeList
                                                    .filter((emp) =>
                                                        emp?.employeeName?.toLowerCase().startsWith(searchTerm.toLowerCase())
                                                    )
                                                    .map((emp, index) => (

                                                        <li
                                                            key={index}
                                                            className={styles.customDropdownLI}
                                                            onClick={() => handleEmployeeSelect(emp)}
                                                        >
                                                            <button className={styles.customDropdownItem}>
                                                                {emp?.employeeName}
                                                            </button>
                                                        </li>

                                                    ))}
                                            </div>
                                            {employeeList.filter((emp) =>
                                                emp?.employeeName?.toLowerCase().startsWith(searchTerm.toLowerCase())
                                            ).length === 0 && (

                                                    <li className={styles.noResult}>
                                                        No matching employee
                                                    </li>

                                                )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={`${GlobalStyles.searchGroup} pt-0`}>
                            <input
                                className={`${GlobalStyles.inputSearch}`}
                                type="text"
                                placeholder="Search by status"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.dropdownScrollable} style={{ maxHeight: (props.employeeView || props.ownerPanel) ? 'calc(100vh - 242px)' : 'calc(100vh - 200px)' }}>
                            <div className={`${styles.userListTitle}`}>Select Employee</div>
                            <ExpensesRecord
                                showData={props.showData}
                                setShowData={props.setShowData}
                                setData={props.setData}
                                setTrigger={props.setTrigger}
                                data={props.data}
                                selectedYear={props.selectedYear}
                                selectedMonth={props.selectedMonth}
                                setTotalAmount={setTotalAmount}
                                trigger={props.trigger}
                                selectedEmployee={props.selectedEmployee}
                                employeeView={props.employeeView}
                                searchQuery={searchQuery}
                                ownerPanel={props.ownerPanel}
                            />
                        </div>
                    </ul>
                </div>

            </div>
        </>
    );
};

export default ExpensesList;

