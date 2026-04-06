import { useState, useEffect, useRef, useMemo } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./DailyWorkReport.module.css";
import { loadReportData, syncFromFirebase } from "../../Action/DailyWorkReport/DailyWorkReportAction";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";

const TODAY = dayjs().format("YYYY-MM-DD");
const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(i, "day");
    return {
        label: i === 0 ? "Today" : d.format("DD MMM"),
        day:   d.format("ddd"),
        value: d.format("YYYY-MM-DD"),
    };
});

// "11:42:00" → "11:42" | already "11:42" → "11:42" | null/undefined → "-"
const fmtTime = (t) => {
    if (!t) return "-";
    const parts = String(t).split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : String(t);
};

// 4.7 → "4h 42min" | 0.72 → "43min" | 4.0 → "4h" | null → "-"
const fmtHours = (v) => {
    if (v == null) return "-";
    const hrs  = Math.floor(v);
    const mins = Math.round((v - hrs) * 60);
    if (hrs === 0) return `${mins}min`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${String(mins).padStart(2, '0')}min`;
};

// 15.57 → "15.57 km" | 0.35 → "350 m" | 0.001 → "1 m" | null → "-"
const fmtDist = (v) => {
    if (v == null) return "-";
    if (v < 1) return `${Math.round(v * 1000)} m`;
    return `${Number(v.toFixed(2))} km`;
};

// Pure functions — component ke bahar taaki har render pe recreate na ho
const filterEmpty = (rows) =>
    rows.filter(row =>
        row.duty_on || row.duty_off || row.entered_ward_boundary ||
        row.vehicle || row.driver || row.helper ||
        row.remark || row.actual_work_percentage != null || row.work_percentage != null
    );

const sortByZone = (rows) =>
    [...rows].sort((a, b) => {
        const aNum = parseInt(a.zone);
        const bNum = parseInt(b.zone);
        const aIsNum = !isNaN(aNum);
        const bIsNum = !isNaN(bNum);
        if (aIsNum && bIsNum) return aNum - bNum;
        if (aIsNum) return -1;
        if (bIsNum) return 1;
        return (a.zone || "").localeCompare(b.zone || "");
    });

const DailyWorkReport = () => {
    const { city }                        = useParams();
    const [selectedDate, setSelectedDate] = useState(TODAY);
    const [data,         setData]         = useState([]);
    const [loading,      setLoading]      = useState(false);
    const [syncing,      setSyncing]      = useState(false);
    const [lastSynced,   setLastSynced]   = useState(null);
    const dateInputRef                    = useRef(null);

    // Sort + filter + vehicle_list — data change hone par ek baar compute hota hai, har render pe nahi
    const displayData = useMemo(
        () => sortByZone(filterEmpty(data)).map(row => ({
            ...row,
            _vehicleList: row.vehicle
                ? [...new Set(row.vehicle.split(',').map(v => v.trim()).filter(Boolean))]
                : [],
        })),
        [data]
    );

    const handleSync = async () => {
        if (syncing || !city) return;
        setSyncing(true);
        try {
            const updated = await syncFromFirebase(city, selectedDate);
            setData(updated);
            setLastSynced(dayjs().format("hh:mm A"));
        } catch {
            toast.error("Sync failed — data could not be saved. Please try again.");
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        if (!city) return;

        const load = async () => {
            setData([]);
            setLoading(true);
            try {
                let hitFromCache = false;
                const updated = await loadReportData(city, selectedDate, (cached) => {
                    hitFromCache = true;
                    setData(cached);
                    setLoading(false);
                });
                if (!hitFromCache) setData(updated);
            } catch {
                toast.error("Data could not be loaded. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [city, selectedDate]);

    const openDatePicker = () => {
        if (dateInputRef.current) {
            if (dateInputRef.current.showPicker) dateInputRef.current.showPicker();
            else dateInputRef.current.click();
        }
    };

    return (
        <div className={styles.pageWrapper}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <h2 className={styles.pageTitle}>Daily Work Report</h2>

                <div className={styles.dateControls}>
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

                    <div className={styles.datePickerDivider} />

                    <div
                        className={`${styles.datePickerWrapper} ${!last7Days.find(d => d.value === selectedDate) ? styles.datePickerActive : ""}`}
                        onClick={openDatePicker}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className={styles.datePickerLabel}>
                            {!last7Days.find(d => d.value === selectedDate)
                                ? dayjs(selectedDate).format("DD MMM YYYY")
                                : "Pick Date"}
                        </span>
                        <input
                            ref={dateInputRef}
                            type="date"
                            className={styles.datePickerInput}
                            value={selectedDate}
                            max={TODAY}
                            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className={styles.tableContainer}>
                <div className={styles.tableDateBar}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>
                        {selectedDate === TODAY
                            ? "Today — " + dayjs(selectedDate).format("DD MMMM YYYY")
                            : dayjs(selectedDate).format("DD MMMM YYYY")}
                    </span>
                    {loading && <span className={styles.tableDateBadge}>Loading...</span>}
                    <button
                        className={styles.syncBtn}
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={syncing ? styles.spinning : ""}>
                            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                        </svg>
                        {syncing ? "Syncing..." : lastSynced ? `Synced ${lastSynced}` : "Sync"}
                    </button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Duty On</th>
                            <th>Entered Ward Boundary</th>
                            <th>Duty Off</th>
                            <th>Vehicle</th>
                            <th>Vehicle Reg. No.</th>
                            <th>Driver</th>
                            <th>Helper</th>
                            <th>Second Helper</th>
                            <th>Trip/Bins</th>
                            <th>Total Working Hrs</th>
                            <th>Ward Halt Duration</th>
                            <th>Work Percentage</th>
                            <th>Actual Work Percentage</th>
                            <th>Run KM</th>
                            <th>Zone Run KM</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={17} className={styles.loaderCell}>
                                    <WevoisLoader />
                                </td>
                            </tr>
                        ) : displayData.length === 0 ? (
                            <tr>
                                <td colSpan={17}>
                                    <div className={styles.emptyState}>No data available</div>
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, i) => (
                                <tr key={row.id ?? i}>
                                    <td>{row.zone ? `Zone ${row.zone}` : "-"}</td>
                                    <td>{fmtTime(row.duty_on)}</td>
                                    <td>{fmtTime(row.entered_ward_boundary)}</td>
                                    <td>{fmtTime(row.duty_off)}</td>
                                    <td>{row._vehicleList.length > 0
                                        ? row._vehicleList.map((v, i, arr) => (
                                            <span key={i}><span className={styles.vehicleChip}>{v}</span>{i < arr.length - 1 ? ', ' : ''}</span>
                                        ))
                                        : "-"}
                                    </td>
                                    <td>{row.vehicle_reg_no            || "-"}</td>
                                    <td>{row.driver                    || "-"}</td>
                                    <td>{row.helper                    || "-"}</td>
                                    <td>{row.second_helper             || "-"}</td>
                                    <td>{row.trip_bins                 ?? "-"}</td>
                                    <td>{fmtHours(row.total_working_hrs)}</td>
                                    <td>{fmtHours(row.ward_halt_duration)}</td>
                                    <td>{row.work_percentage ?? row.actual_work_percentage ?? "-"}</td>
                                    <td>{row.actual_work_percentage    ?? "-"}</td>
                                    <td>{fmtDist(row.run_km)}</td>
                                    <td>{fmtDist(row.zone_run_km)}</td>
                                    <td>{row.remark                    || "-"}</td>
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
