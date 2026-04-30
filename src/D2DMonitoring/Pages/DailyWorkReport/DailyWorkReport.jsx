import { useState, useEffect, useRef, useMemo } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { images } from "../../../assets/css/imagePath";
import styles from "./DailyWorkReport.module.css";
import { loadReportData, syncFromFirebase } from "../../Action/DailyWorkReport/DailyWorkReportAction";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";

const getToday = () => dayjs().format("YYYY-MM-DD");

const buildDateWindow = () => Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(i, "day");
    return {
        label: i === 0 ? "Today" : d.format("DD MMM"),
        day: d.format("ddd"),
        value: d.format("YYYY-MM-DD"),
    };
});

const fmtTime = (t) => {
    if (!t) return "-";
    const parts = String(t).split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : String(t);
};

const fmtHours = (v) => {
    if (v == null) return "-";
    const totalMinutes = Math.round(Number(v) * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${String(mins).padStart(2, "0")}m`;
};

const fmtDist = (v) => {
    if (v == null) return "-";
    if (v < 1) return `${Math.round(v * 1000)} m`;
    const rounded = Number(v);
    const decimals = String(rounded).split(".")[1] || "";
    const precision = decimals.length >= 3 ? 3 : decimals.length;
    return `${rounded.toFixed(precision)} km`;
};

const fmtPercent = (v) => {
    if (v == null || v === "") return "-";
    return `${v}%`;
};

const splitTopLevelComma = (value) => {
    const parts = [];
    let current = "";
    let depth = 0;

    for (const char of value) {
        if (char === "(") depth += 1;
        if (char === ")" && depth > 0) depth -= 1;

        if (char === "," && depth === 0) {
            if (current.trim()) parts.push(current.trim());
            current = "";
            continue;
        }

        current += char;
    }

    if (current.trim()) parts.push(current.trim());
    return parts;
};

const fmtEmployeeDisplay = (value) => {
    if (!value) return "-";

    const normalized = String(value).trim().replace(/\s+/g, " ");
    const repeatedParenMatch = normalized.match(/^(.*)\s\(([^()]+)\)\s\(\2\)$/);
    const baseValue = repeatedParenMatch
        ? `${repeatedParenMatch[1]} (${repeatedParenMatch[2]})`
        : normalized;

    const tokens = splitTopLevelComma(baseValue).map((token) => {
        const match = token.match(/^(.*?)(?:\s*\(([^()]+)\))?$/);
        const name = match?.[1]?.trim() || token.trim();
        const ids = match?.[2]
            ? [...new Set(match[2].split(",").map((item) => item.trim()).filter(Boolean))]
            : [];

        return {
            key: name.toLowerCase(),
            name,
            ids,
            display: ids.length ? `${name} (${ids.join(", ")})` : name,
        };
    });

    const deduped = new Map();
    tokens.forEach((token) => {
        const existing = deduped.get(token.key);
        if (!existing) {
            deduped.set(token.key, token);
            return;
        }

        const mergedIds = [...new Set([...existing.ids, ...token.ids])];
        deduped.set(token.key, {
            ...token,
            ids: mergedIds,
            display: mergedIds.length ? `${token.name} (${mergedIds.join(", ")})` : token.name,
        });
    });

    const finalValue = [...deduped.values()].map((token) => token.display).join(", ");
    return finalValue || "-";
};

const hasMultipleValues = (value) => {
    if (!value) return false;
    const normalized = String(value).trim();
    if (!normalized || normalized === "-") return false;
    return splitTopLevelComma(normalized).length > 1;
};

const getHourTone = (v) => {
    if (v == null) return "neutral";
    if (v >= 4) return "success";
    if (v >= 2) return "info";
    return "warning";
};

const getPercentTone = (v) => {
    if (v == null) return "neutral";
    if (v >= 80) return "success";
    if (v >= 50) return "info";
    return "violet";
};

const getDistanceTone = (v) => {
    if (v == null) return "neutral";
    return v >= 5 ? "success" : "violet";
};

const filterEmpty = (rows) =>
    rows.filter((row) =>
        row.is_bin_lifting_task ||
        row.duty_on || row.duty_off || row.entered_ward_boundary ||
        row.vehicle || row.driver || row.helper ||
        row.remark || row.actual_work_percentage != null || row.work_percentage != null
    );

const sortByZone = (rows) =>
    [...rows].sort((a, b) => {
        if (a.is_bin_lifting_task && b.is_bin_lifting_task) {
            return (a.bin_lifting_order ?? 0) - (b.bin_lifting_order ?? 0);
        }
        if (a.is_bin_lifting_task) return 1;
        if (b.is_bin_lifting_task) return -1;
        const aNum = parseInt(a.zone);
        const bNum = parseInt(b.zone);
        const aIsNum = !isNaN(aNum);
        const bIsNum = !isNaN(bNum);
        if (aIsNum && bIsNum) return aNum - bNum;
        if (aIsNum) return -1;
        if (bIsNum) return 1;
        return (a.zone || "").localeCompare(b.zone || "");
    });

const Icon = ({ name, className }) => {
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.9",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        "aria-hidden": true,
    };

    switch (name) {
        case "report":
            return (
                <svg {...common}>
                    <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
                    <path d="M9 8h6M9 12h6M9 16h4" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...common}>
                    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                    <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
                </svg>
            );
        case "sync":
            return (
                <svg {...common}>
                    <path d="M21 12a8.7 8.7 0 0 0-14.85-6.15L3 9" />
                    <path d="M3 4v5h5" />
                    <path d="M3 12a8.7 8.7 0 0 0 14.85 6.15L21 15" />
                    <path d="M16 15h5v5" />
                </svg>
            );
        case "zone":
            return (
                <svg {...common}>
                    <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2.2" />
                </svg>
            );
        case "clock":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.8v4.6l3 1.8" />
                </svg>
            );
        case "vehicle":
            return (
                <svg {...common}>
                    <path d="M3 14V9.5A2.5 2.5 0 0 1 5.5 7H15l3 3v4" />
                    <path d="M5 14h14" />
                    <circle cx="7" cy="16.5" r="1.5" />
                    <circle cx="17" cy="16.5" r="1.5" />
                </svg>
            );
        case "id":
            return (
                <svg {...common}>
                    <rect x="4" y="5" width="16" height="14" rx="2.5" />
                    <path d="M8 10h5M8 14h3M15.5 10.5h.01M15.5 14.5h.01" />
                </svg>
            );
        case "user":
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5.5 18a6.5 6.5 0 0 1 13 0" />
                </svg>
            );
        case "trips":
            return (
                <svg {...common}>
                    <path d="M12 3 5 7v10l7 4 7-4V7l-7-4Z" />
                    <path d="m5 7 7 4 7-4M12 11v10" />
                </svg>
            );
        case "chart":
            return (
                <svg {...common}>
                    <path d="M4 18V6M4 18h16" />
                    <path d="m8 14 3-3 3 2 4-5" />
                </svg>
            );
        case "road":
            return (
                <svg {...common}>
                    <path d="M8 3 5 21M16 3l3 18M12 3v4M12 11v4M12 19v2" />
                </svg>
            );
        case "remark":
            return (
                <svg {...common}>
                    <path d="M7 18.5 3.5 20l1.5-3.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H9l-2 2.5Z" />
                </svg>
            );
        default:
            return null;
    }
};

const headerColumns = [
    { key: "zone", label: "Zone", icon: "zone" },
    { key: "dutyOn", label: "Start Time", icon: "clock" },
    { key: "wardEntry", label: "Ward Entry", icon: "clock" },
    { key: "dutyOff", label: "End Time", icon: "clock" },
    { key: "vehicle", label: "Vehicle", icon: "vehicle" },
    { key: "regNo", label: "Reg. No.", icon: "id" },
    { key: "driver", label: "Driver", icon: "user" },
    { key: "helper1", label: "Helper 1", icon: "user" },
    { key: "helper2", label: "Helper 2", icon: "user" },
    { key: "trips", label: "Trips/Bins", icon: "trips" },
    { key: "workHrs", label: "Work Hrs", icon: "clock" },
    { key: "haltTime", label: "Halt Time", icon: "clock" },
    { key: "workPercent", label: "Work %", icon: "chart" },
    { key: "actualPercent", label: "Actual %", icon: "chart" },
    { key: "runKm", label: "Run (KM)", icon: "road" },
    { key: "zoneKm", label: "Zone (KM)", icon: "road" },
    { key: "remarks", label: "Remarks", icon: "remark" },
];

const DailyWorkReport = () => {
    const { city } = useParams();
    const [today, setToday] = useState(getToday);
    const [selectedDate, setSelectedDate] = useState(getToday);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [syncAge, setSyncAge] = useState("");
    const dateInputRef = useRef(null);
    const loadIdRef = useRef(0);
    const syncIdRef = useRef(0);

    useEffect(() => {
        const now = new Date();
        const next = new Date();
        next.setHours(24, 0, 0, 0);
        const timer = setTimeout(() => {
            const newToday = getToday();
            setToday(newToday);
            setSelectedDate((prev) => {
                const yesterday = dayjs(newToday).subtract(1, "day").format("YYYY-MM-DD");
                return prev === yesterday ? newToday : prev;
            });
        }, next - now);
        return () => clearTimeout(timer);
    }, []);

    const displayData = useMemo(
        () => sortByZone(filterEmpty(data)).map((row) => ({
            ...row,
            _vehicleList: row.vehicle
                ? [...new Set(row.vehicle.split(",").map((v) => v.trim()).filter(Boolean))]
                : [],
        })),
        [data]
    );

    const dateWindow = useMemo(() => buildDateWindow(), [today]);
    const isSelectedDateInWindow = dateWindow.some((d) => d.value === selectedDate);
    const titleDate = dayjs(selectedDate).format("DD MMMM YYYY");

    useEffect(() => {
        if (!lastSynced) return;
        const calc = () => {
            const mins = Math.floor((Date.now() - lastSynced) / 60000);
            if (mins < 1) return setSyncAge("just now");
            if (mins < 60) return setSyncAge(`${mins} min ago`);
            const hrs = Math.floor(mins / 60);
            return setSyncAge(`${hrs}h ago`);
        };
        calc();
        const interval = setInterval(calc, 60000);
        return () => clearInterval(interval);
    }, [lastSynced]);

    const handleSync = async () => {
        if (syncing || !city) return;
        const syncId = ++syncIdRef.current;
        const syncDate = selectedDate;
        setSyncing(true);
        try {
            const updated = await syncFromFirebase(city, syncDate);
            if (syncId !== syncIdRef.current || syncDate !== selectedDate) return;
            setData(updated);
            setLastSynced(Date.now());
        } catch {
            if (syncId !== syncIdRef.current) return;
            toast.error("Sync failed - data could not be saved. Please try again.");
        } finally {
            if (syncId === syncIdRef.current) setSyncing(false);
        }
    };

    useEffect(() => {
        if (!city) return;

        const loadId = ++loadIdRef.current;

        const load = async () => {
            setData([]);
            setLoading(true);
            try {
                let hitFromCache = false;
                const updated = await loadReportData(city, selectedDate, (cached) => {
                    if (loadId !== loadIdRef.current) return;
                    hitFromCache = true;
                    setData(cached);
                    setLoading(false);
                });
                if (loadId !== loadIdRef.current) return;
                if (!hitFromCache) setData(updated);
            } catch {
                if (loadId !== loadIdRef.current) return;
                toast.error("Data could not be loaded. Please refresh the page.");
            } finally {
                if (loadId === loadIdRef.current) setLoading(false);
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

    const handleExportExcel = () => {
        if (!displayData.length) {
            toast.info("No data available to export.");
            return;
        }

        const exportRows = displayData.map((row) => ({
            Zone: row.display_zone || row.zone
                ? row.is_bin_lifting_task
                    ? (row.display_zone || row.zone)
                    : `Zone ${row.display_zone || row.zone}`
                : "-",
            "Duty On": fmtTime(row.duty_on),
            "Ward Entry": fmtTime(row.entered_ward_boundary),
            "Duty Off": fmtTime(row.duty_off),
            Vehicle: row._vehicleList.length ? row._vehicleList.join(", ") : "-",
            "Reg. No.": row.vehicle_reg_no || "-",
            Driver: row.driver || "-",
            "Helper 1": row.helper || "-",
            "Helper 2": row.second_helper || "-",
            "Trips/Bins": row.trip_bins_display ?? row.trip_bins ?? "-",
            "Work Hrs": fmtHours(row.total_working_hrs),
            "Halt Time": fmtHours(row.ward_halt_duration),
            "Work %": fmtPercent(row.work_percentage ?? row.actual_work_percentage),
            "Actual %": fmtPercent(row.actual_work_percentage),
            "Run (KM)": fmtDist(row.run_km),
            "Zone (KM)": fmtDist(row.zone_run_km),
            Remarks: row.remark || "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Work Report");
        XLSX.writeFile(workbook, `Daily_Work_Report_${city || "city"}_${selectedDate}.xlsx`);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layout}>
                <div className={styles.pageHeadingBar}>
                    <h1 className={styles.pageHeading}>Daily Work Report</h1>
                </div>

                <div className={styles.heroCard}>
                    <div className={styles.toolbarRow}>
                        <div className={styles.toolbarLeft}>
                            <div className={styles.currentDateBlock}>
                                <Icon name="calendar" className={styles.subtitleIcon} />
                                <span>{selectedDate === today ? `Today, ${titleDate}` : titleDate}</span>
                                {loading && <span className={styles.tableDateBadge}>Loading...</span>}
                            </div>

                            <div className={styles.heroTimeline}>
                                <div className={styles.dateTabs}>
                                    {dateWindow.map((d) => (
                                        <button
                                            key={d.value}
                                            type="button"
                                            aria-pressed={selectedDate === d.value}
                                            aria-label={`Select date ${d.label}`}
                                            className={`${styles.dateTab} ${selectedDate === d.value ? styles.dateTabActive : ""}`}
                                            onClick={() => setSelectedDate(d.value)}
                                        >
                                            <span className={styles.dateTabDay}>{d.day}</span>
                                            <span className={styles.dateTabLabel}>{selectedDate === d.value && d.value === today ? "Today" : d.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <label
                                className={`${styles.actionBtn} ${styles.datePickerWrapper} ${!isSelectedDateInWindow ? styles.datePickerActive : ""}`}
                                onClick={openDatePicker}
                            >
                                <Icon name="calendar" className={styles.actionIcon} />
                                <span className={styles.datePickerLabel}>
                                    {!isSelectedDateInWindow ? dayjs(selectedDate).format("DD MMM YYYY") : "Pick Date"}
                                </span>
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    aria-label="Select custom date"
                                    className={styles.datePickerInput}
                                    value={selectedDate}
                                    max={today}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val) {
                                            const year = parseInt(val.split('-')[0], 10);
                                            if (year >= 2000 && year <= 2100) {
                                                setSelectedDate(val);
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <div className={styles.heroActions}>
                            <div className={styles.actionGroup}>
                                <button
                                    type="button"
                                    className={`${styles.actionBtn} ${styles.exportBtn}`}
                                    onClick={handleExportExcel}
                                    aria-label="Export table in Excel"
                                >
                                    <img
                                        src={images.iconExcel}
                                        className={styles.iconExcel}
                                        alt="Export to Excel"
                                    />
                                    <span>Export Excel</span>
                                </button>

                                <button
                                    className={`${styles.actionBtn} ${styles.syncBtn}`}
                                    onClick={handleSync}
                                    disabled={syncing}
                                    aria-label={syncing ? "Syncing data" : "Sync data from Firebase"}
                                >
                                    <Icon name="sync" className={`${styles.actionIcon} ${syncing ? styles.spinning : ""}`} />
                                    <span>{syncing ? "Syncing..." : "Sync"}</span>
                                    {lastSynced && !syncing ? <small>{syncAge}</small> : null}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.tableShell}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {headerColumns.map((column) => (
                                    <th key={column.key} scope="col">
                                        <div className={styles.headerCell}>
                                            <Icon name={column.icon} className={styles.headerIcon} />
                                            <span>{column.label}</span>
                                        </div>
                                    </th>
                                ))}
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
                                        <div className={styles.emptyState}>
                                            <div className={styles.emptyStateTitle}>No data found for this date</div>
                                            <div className={styles.emptyStateHint}>Press <strong>Sync</strong> to fetch latest data from Firebase</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                displayData.map((row, i) => {
                                    const zoneLabel = row.display_zone || row.zone
                                        ? row.is_bin_lifting_task
                                            ? (row.display_zone || row.zone)
                                            : `Zone ${row.display_zone || row.zone}`
                                        : "-";
                                    const workPercent = row.work_percentage ?? row.actual_work_percentage;

                                    return (
                                        <tr key={row.id ?? i}>
                                            <td className={styles.zoneCell} data-label="Zone">
                                                <span className={styles.zoneText}>{zoneLabel}</span>
                                            </td>
                                            <td data-label="Start Time">{fmtTime(row.duty_on)}</td>
                                            <td data-label="Ward Entry">{fmtTime(row.entered_ward_boundary)}</td>
                                            <td data-label="End Time">{fmtTime(row.duty_off)}</td>
                                            <td data-label="Vehicle">
                                                <span className={`${styles.compactCellText} ${row._vehicleList.length > 1 ? styles.doubleLineText : styles.singleLineText}`}>
                                                    {row._vehicleList.length > 0 ? row._vehicleList.join(", ") : "-"}
                                                </span>
                                            </td>
                                            <td data-label="Reg. No.">
                                                <span className={`${styles.compactCellText} ${hasMultipleValues(row.vehicle_reg_no) ? styles.doubleLineText : styles.singleLineText}`}>
                                                    {row.vehicle_reg_no || "-"}
                                                </span>
                                            </td>
                                            <td data-label="Driver">
                                                <span className={`${styles.compactCellText} ${hasMultipleValues(fmtEmployeeDisplay(row.driver)) ? styles.doubleLineText : styles.singleLineText}`}>
                                                    {fmtEmployeeDisplay(row.driver)}
                                                </span>
                                            </td>
                                            <td data-label="Helper 1">
                                                <span className={`${styles.compactCellText} ${hasMultipleValues(fmtEmployeeDisplay(row.helper)) ? styles.doubleLineText : styles.singleLineText}`}>
                                                    {fmtEmployeeDisplay(row.helper)}
                                                </span>
                                            </td>
                                            <td data-label="Helper 2">
                                                <span className={`${styles.compactCellText} ${hasMultipleValues(fmtEmployeeDisplay(row.second_helper)) ? styles.doubleLineText : styles.singleLineText}`}>
                                                    {fmtEmployeeDisplay(row.second_helper)}
                                                </span>
                                            </td>
                                            <td data-label="Trips/Bins">{row.trip_bins_display ?? row.trip_bins ?? "-"}</td>
                                            <td data-label="Work Hrs">{fmtHours(row.total_working_hrs)}</td>
                                            <td data-label="Halt Time">{fmtHours(row.ward_halt_duration)}</td>
                                            <td data-label="Work %">{fmtPercent(workPercent)}</td>
                                            <td data-label="Actual %">{fmtPercent(row.actual_work_percentage)}</td>
                                            <td data-label="Run (KM)">{fmtDist(row.run_km)}</td>
                                            <td data-label="Zone (KM)">{fmtDist(row.zone_run_km)}</td>
                                            <td data-label="Remarks">{row.remark || "-"}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DailyWorkReport;
