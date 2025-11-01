import { useState, useEffect, useRef } from "react";
import styles from "../../assets/css/YearMonthSelector.module.css";
import style from "../ExpenseReviewer/ExpenseReviewerList.module.css";

const YearMonthSelector = ({ onChange, defaultYear, defaultMonth }) => {
    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false); // 👈 For month dropdown
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

    useEffect(() => {
        onChange && onChange({ year: selectedYear, month: selectedMonth });
    }, [selectedYear, selectedMonth, onChange]);

    const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className={styles.container}>

            {/* Custom Year Dropdown */}
            <div className={`dropdown ${style.dropDownwwwp}`} ref={yearDropdownRef}>
                <button
                    className={`btn ${style.dropdowmbtn}`}
                    type="button"
                    onClick={() => setIsYearOpen(!isYearOpen)}
                >
                    <div className={style.projectNaam}>
                        {selectedYear || 'Select Year'}
                    </div>
                </button>

                {isYearOpen && (
                    <ul className={`dropdown-menu newExpenseDropdown show ${style.selectedProject}`}>
                        {years.map((year) => (
                            <li
                                key={year}
                                className={`${style.customDropdownLI}`}
                                onClick={() => {
                                    setSelectedYear(year);
                                    setIsYearOpen(false);
                                }}
                            >
                                <button className={style.customDropdownItem}>
                                    {year}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Custom Month Dropdown */}
            <div className={`dropdown ${style.dropDownwwwp}`} ref={monthDropdownRef}>
                <button
                    className={`btn ${style.dropdowmbtn}`}
                    type="button"
                    onClick={() => setIsMonthOpen(!isMonthOpen)}
                >
                    <div className={style.projectNaam}>
                        {months[selectedMonth - 1] || 'Select Month'}
                    </div>
                </button>

                {isMonthOpen && (
                    <ul className={`dropdown-menu newExpenseDropdown show ${style.selectedProject}`}>
                        {months.map((month, index) => (
                            <li
                                key={month}
                                className={`${style.customDropdownLI}`}
                                onClick={() => {
                                    setSelectedMonth(index + 1);
                                    setIsMonthOpen(false);
                                }}
                            >
                                <button className={style.customDropdownItem}>
                                    {month}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default YearMonthSelector;
