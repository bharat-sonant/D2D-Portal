import { useState, useEffect, useRef } from "react";
import styles from "../../assets/css/YearMonthSelector.module.css";
import style from "../ExpenseReviewer/ExpenseReviewerList.module.css";

const YearMonthSelector = ({ onChange, defaultYear, defaultMonth, defaultWard, wards = [] }) => {
    const [selectedYear, setSelectedYear] = useState(defaultYear || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth || new Date().getMonth() + 1);
    const [selectedWard, setSelectedWard] = useState(defaultWard || '');
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isWardOpen, setIsWardOpen] = useState(false);

    const yearDropdownRef = useRef(null);
    const monthDropdownRef = useRef(null);
    const wardDropdownRef = useRef(null);

    const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) setIsYearOpen(false);
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) setIsMonthOpen(false);
            if (wardDropdownRef.current && !wardDropdownRef.current.contains(event.target)) setIsWardOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ✅ Sync defaultWard when fetched later
    useEffect(() => {
        if (defaultWard) {
            setSelectedWard(defaultWard);
        }
    }, [defaultWard]);

    // Trigger onChange
    useEffect(() => {
        if (selectedYear && selectedMonth && selectedWard && onChange) {
            onChange({
                year: selectedYear,
                month: selectedMonth,
                ward: selectedWard
            });
        }
    }, [selectedYear, selectedMonth, selectedWard]);

    return (
        <div className={styles.container}>
            {/* Ward Dropdown */}
            <div className={`dropdown ${style.dropDownwwwp}`} ref={wardDropdownRef}>
                <button
                    className={`btn ${style.dropdowmbtn}`}
                    type="button"
                    onClick={() => setIsWardOpen(!isWardOpen)}
                >
                    <div className={style.projectNaam}>
                        {selectedWard || 'Select Ward'}
                    </div>
                </button>

                {isWardOpen && (
                    <ul className={`dropdown-menu newExpenseDropdown show ${style.selectedProject}`}>
                        {wards.map((ward, index) => (
                            <li
                                key={index}
                                className={style.customDropdownLI}
                                onClick={() => {
                                    setSelectedWard(ward.zoneNo || ward.name || ward);
                                    setIsWardOpen(false);
                                }}
                            >
                                <button className={style.customDropdownItem}>
                                    {ward.zoneNo || ward.name || ward}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Year Dropdown */}
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
                                className={style.customDropdownLI}
                                onClick={() => {
                                    setSelectedYear(year);
                                    setIsYearOpen(false);
                                }}
                            >
                                <button className={style.customDropdownItem}>{year}</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Month Dropdown */}
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
                                className={style.customDropdownLI}
                                onClick={() => {
                                    setSelectedMonth(index + 1);
                                    setIsMonthOpen(false);
                                }}
                            >
                                <button className={style.customDropdownItem}>{month}</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default YearMonthSelector;
