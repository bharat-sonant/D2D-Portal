import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import styles from "./DailyWorkReport.module.css";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import {
    initCacheCleanup,
    getWardsForReportAction,
    loadPastDateAction,
    subscribeTodayAction,
} from "../../Action/DailyWorkReport/DailyWorkReportAction";

const TODAY = dayjs().format("YYYY-MM-DD");

const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(i, "day");
    return {
        label: i === 0 ? "Today" : d.format("DD MMM"),
        day:   d.format("ddd"),
        value: d.format("YYYY-MM-DD"),
    };
});

const DailyWorkReport = () => {
    const { city } = useParams();
    const [selectedDate, setSelectedDate] = useState(TODAY);
    const [wards,        setWards]        = useState([]);
    const [data,         setData]         = useState([]);
    const [loading,      setLoading]      = useState(false);
    const unsubRef = useRef(null);

    // 1. Cleanup stale cache on mount
    useEffect(() => { initCacheCleanup(); }, []);

    // 2. Load ward list (localStorage → Firebase Storage, sirf pehli baar)
    useEffect(() => {
        if (!city) return;
        getWardsForReportAction(city).then(setWards);
    }, [city]);

    // 3. Load / subscribe data whenever date or wards change
    useEffect(() => {
        if (!wards?.length) return;

        // Cleanup previous realtime listeners
        if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }

        if (selectedDate === TODAY) {
            // Realtime: har zone pe live listener
            unsubRef.current = subscribeTodayAction(wards, selectedDate, setData, setLoading, city);
        } else {
            // Past date: localStorage → Firebase parallel fetch
            loadPastDateAction(city, selectedDate, wards, setData, setLoading);
        }

        // Cleanup on date change / unmount
        return () => {
            if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
        };
    }, [selectedDate, wards]);

    return (
        <div className={styles.pageWrapper}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <h2 className={styles.pageTitle}>Daily Work Report</h2>

                <div className={styles.dateTabs}>
                    {last7Days.map((d) => (
                        <button
                            key={d.value}
                            type="button"
                            className={`${styles.dateTab} ${selectedDate === d.value ? styles.dateTabActive : ""}`}
                            onClick={() => setSelectedDate(d.value)}
                        >
                            <span className={styles.dateTabDay}>{d.day}</span>
                            <span className={styles.dateTabLabel}>{d.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Duty On</th>
                            <th>Entered Ward Boundary</th>
                            <th>Duty Off</th>
                            <th>Vehicle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className={styles.loaderCell}>
                                    <WevoisLoader title="Loading data..." />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className={styles.emptyState}>No data available</div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.wardId}>
                                    <td>{row.zone}</td>
                                    <td>{row.dutyOn               || "-"}</td>
                                    <td>{row.enteredWardBoundary  || "-"}</td>
                                    <td>{row.dutyOff              || "-"}</td>
                                    <td>
                                        {row.vehicle
                                            ? <span className={styles.vehicleChip}>{row.vehicle}</span>
                                            : "-"
                                        }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default DailyWorkReport;
