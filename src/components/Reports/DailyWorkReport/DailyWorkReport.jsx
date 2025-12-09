import { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaSortAmountDown, FaFileExcel } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import style from '../../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css';

const DailyWorkReport = () => {

    const [date, setDate] = useState("2025-12-05");
    const [rows, setRows] = useState([
        {
            zone: "Zone 1",
            start: "12:38",
            reach: "13:14",
            end: "19:08",
            vehicle: "LEY-AT–7174",
            driver: "SANWAR LAL (909)",
            helper1: "AMIT (C) (1408)",
            helper2: "",
            trips: 1,
            workTime: "6:30 hr",
            haltTime: "2:33 hr",
            workPerc: "70%",
            actualPerc: "33%",
            runKm: "16.232",
            zoneKm: "18.539",
            remark: ""
        },
        {
            zone: "Zone 2",
            start: "07:41",
            reach: "07:49",
            end: "13:38",
            vehicle: "TATA–AT–0662",
            driver: "AJAY KUMAR (1437)",
            helper1: "RAKESH KUMAR (378)",
            helper2: "",
            trips: 2,
            workTime: "5:57 hr",
            haltTime: "0:10 hr",
            workPerc: "100%",
            actualPerc: "100%",
            runKm: "26.505",
            zoneKm: "9.991",
            remark: ""
        },
        {
            zone: "Zone 3",
            start: "12:19",
            reach: "12:38",
            end: "15:16",
            vehicle: "TATA–AT–5520",
            driver: "VIJAY KUMAR (745)",
            helper1: "RAGHUNANDAN (1778)",
            helper2: "",
            trips: 1,
            workTime: "2:57 hr",
            haltTime: "0:15 hr",
            workPerc: "91%",
            actualPerc: "40%",
            runKm: "15.623",
            zoneKm: "7.311",
            remark: "ghar per urgent kaam hone ke kaaran ward pura nhi ho paya"
        }
    ]);

    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ----------------------------
    // SORT FUNCTIONS
    // ----------------------------
    const sortLowToHigh = () => {
        const sorted = [...rows].sort(
            (a, b) => parseFloat(a.actualPerc) - parseFloat(b.actualPerc)
        );
        setRows(sorted);
        setIsSortOpen(false);
    };

    const sortHighToLow = () => {
        const sorted = [...rows].sort(
            (a, b) => parseFloat(b.actualPerc) - parseFloat(a.actualPerc)
        );
        setRows(sorted);
        setIsSortOpen(false);
    };

    return (
        <div className={style.container}>

            {/* TOP BAR */}
            <div className={style.topBar}>

                {/* DATE PICKER */}
                <div
                    className={style.dateBox}
                    onClick={() => document.getElementById("reportDateInput").showPicker()}
                >
                    <input
                        id="reportDateInput"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={style.dateInput}
                    />
                </div>

                {/* SORT + EXPORT BUTTONS */}
                <div className={style.rightButtons} ref={sortRef}>

                    {/* SORT BUTTON */}
                    <button
                        className={style.sortBtn}
                        onClick={() => setIsSortOpen(!isSortOpen)}
                    >
                        <FaSortAmountDown /> Sort by
                    </button>

                    {/* SORT DROPDOWN */}
                    {isSortOpen && (
                        <div className={style.sortDropdown}>

                            <div className={style.sortItem} onClick={sortLowToHigh}>
                                <FaArrowUp className={style.sortUpIcon} />
                                Actual Work % ( Low → High )
                            </div>

                            <div className={style.sortItem} onClick={sortHighToLow}>
                                <FaArrowDown className={style.sortDownIcon} />
                                Actual Work % ( High → Low )
                            </div>

                        </div>
                    )}

                    {/* EXPORT BUTTON */}
                    <button className={style.exportBtn}>
                        <FaFileExcel /> Export to Excel
                    </button>

                </div>
            </div>

            {/* TABLE */}
            <div className={style.tableContainer}>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Start Time</th>
                            <th>Ward Reach On</th>
                            <th>End Time</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Helper</th>
                            <th>Second Helper</th>
                            <th>Trip/Bins</th>
                            <th>Work Time</th>
                            <th>Halt Time</th>
                            <th>Work Percentage</th>
                            <th>Actual Work Percentage</th>
                            <th>Run KM</th>
                            <th>Zone Run KM</th>
                            <th>Remark</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.zone}</td>
                                <td>{row.start}</td>
                                <td>{row.reach}</td>
                                <td>{row.end}</td>
                                <td>{row.vehicle}</td>
                                <td>{row.driver}</td>
                                <td>{row.helper1}</td>
                                <td>{row.helper2}</td>
                                <td>{row.trips}</td>
                                <td>{row.workTime}</td>
                                <td>{row.haltTime}</td>
                                <td>{row.workPerc}</td>
                                <td>{row.actualPerc}</td>
                                <td>{row.runKm}</td>
                                <td>{row.zoneKm}</td>
                                <td className={style.remark}>{row.remark}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default DailyWorkReport;
