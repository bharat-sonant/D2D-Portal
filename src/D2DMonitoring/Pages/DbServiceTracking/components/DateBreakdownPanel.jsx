import { useState, useEffect } from "react";
import dayjs from "dayjs";
import styles from "../DbServiceTracking.module.css";
import { getDateBreakdown } from "../../../Services/DbServiceTracker/serviceTracker";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} Gb`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} Mb`;
  if (bytes >= 1024)      return `${(bytes / 1024).toFixed(2)} Kb`;
  return `${Math.round(bytes)} B`;
}

const DateBreakdownPanel = ({ selectedService, selectedFunc, year, month, onYearChange, onMonthChange, city }) => {
  const [dateRows, setDateRows] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!selectedService || !selectedFunc) { setDateRows([]); return; }
    let cancelled = false;
    setLoading(true);
    setDateRows([]);
    getDateBreakdown(selectedService, selectedFunc.functionName, year, month).then((rows) => {
      if (cancelled) return;
      setDateRows(rows);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedService, selectedFunc, year, month, city]);

  const availableYears = [String(dayjs().year() - 1), String(dayjs().year())];

  return (
    <div className={styles.panel3}>

      {/* Header */}
      <div className={styles.panel3Header}>
        <div className={styles.selectors}>
          <select className={styles.select} value={year} onChange={(e) => onYearChange(e.target.value)}>
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className={styles.select} value={month} onChange={(e) => onMonthChange(e.target.value)}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <span className={styles.totalCount}>
          {selectedFunc ? selectedFunc.callCount.toLocaleString() : "—"}
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span className={styles.colDate}>Date</span>
          <span className={styles.colCount}>Counts</span>
          <span className={styles.colSize}>Size</span>
        </div>
        <div className={styles.tableBody}>
          {loading ? (
            <div className={styles.loaderWrap}><span className={styles.spinner} /></div>
          ) : !selectedFunc ? (
            <div className={styles.emptyList}>Select a function</div>
          ) : dateRows.length === 0 ? (
            <div className={styles.emptyList}>No data for this period</div>
          ) : (
            dateRows.map((row) => (
              <div key={row.date} className={styles.tableRow}>
                <span className={styles.colDate}>{dayjs(row.date).format("D MMM")}</span>
                <span className={styles.colCount}>{row.count.toLocaleString()}</span>
                <span className={styles.colSize}>{formatSize(row.bytes)}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DateBreakdownPanel;
