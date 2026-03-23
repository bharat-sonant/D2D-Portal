import { useState, useEffect, useCallback } from "react";
import styles from "./DbServiceTracking.module.css";
import wevoisLogo from "../../../assets/images/wevoisLogo.png";
import { Database } from "lucide-react";
import dayjs from "dayjs";
import {
  getServiceFiles,
  getFunctionStats,
  getDateBreakdown,
} from "../../Services/DbServiceTracker/serviceTracker";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes) {
  if (!bytes || bytes === 0) return "—";
  if (bytes >= 1024 ** 3) return { val: (bytes / 1024 ** 3).toFixed(2), unit: "Gb" };
  if (bytes >= 1024 ** 2) return { val: (bytes / 1024 ** 2).toFixed(2), unit: "Mb" };
  if (bytes >= 1024)      return { val: (bytes / 1024).toFixed(2),       unit: "Kb" };
  return { val: String(Math.round(bytes)), unit: "B" };
}

function SizeCell({ bytes, className }) {
  const s = formatSize(bytes);
  if (s === "—") return <span className={className}>—</span>;
  return (
    <span className={className}>
      <strong>{s.val}</strong>
      <span className={styles.unit}>{s.unit}</span>
    </span>
  );
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const now = dayjs();

// ── Component ─────────────────────────────────────────────────────────────────

const DbServiceTracking = () => {
  const [year,  setYear]  = useState(now.format("YYYY"));
  const [month, setMonth] = useState(now.format("MMMM"));

  const [serviceFiles,      setServiceFiles]      = useState([]);
  const [loadingServices,   setLoadingServices]   = useState(true);
  const [selectedService,   setSelectedService]   = useState(null);

  const [funcList,          setFuncList]          = useState([]);
  const [loadingFuncs,      setLoadingFuncs]      = useState(false);
  const [selectedFunc,      setSelectedFunc]      = useState(null);

  const [dateRows,          setDateRows]          = useState([]);
  const [loadingDates,      setLoadingDates]      = useState(false);

  // ── Load service files ──────────────────────────────────────────────────────
  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    const data = await getServiceFiles(year, month);
    setServiceFiles(data);
    setLoadingServices(false);

    if (data.length > 0) {
      const first = data[0];
      setSelectedService((prev) => prev ?? first.name);
    }
  }, [year, month]);

  useEffect(() => {
    setSelectedService(null);
    setFuncList([]);
    setSelectedFunc(null);
    setDateRows([]);
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    const iv = setInterval(loadServices, 15000);
    window.addEventListener("d2d_tracker_update", loadServices);
    return () => { clearInterval(iv); window.removeEventListener("d2d_tracker_update", loadServices); };
  }, [loadServices]);

  // ── Load functions when service changes ────────────────────────────────────
  useEffect(() => {
    if (!selectedService) return;
    setLoadingFuncs(true);
    setFuncList([]);
    setSelectedFunc(null);
    setDateRows([]);
    getFunctionStats(selectedService, year, month).then((fns) => {
      setFuncList(fns);
      setLoadingFuncs(false);
      if (fns.length > 0) setSelectedFunc(fns[0]);
    });
  }, [selectedService, year, month]);

  // ── Load date breakdown when func changes ─────────────────────────────────
  useEffect(() => {
    if (!selectedService || !selectedFunc) return;
    setLoadingDates(true);
    setDateRows([]);
    getDateBreakdown(selectedService, selectedFunc.functionName, year, month).then((rows) => {
      setDateRows(rows);
      setLoadingDates(false);
    });
  }, [selectedService, selectedFunc, year, month]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalCount = selectedFunc?.callCount ?? 0;

  const availableYears = [String(now.year() - 1), String(now.year())];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <img src={wevoisLogo} alt="WeVOIS" className={styles.topBarLogo} />
        </div>
        <div className={styles.topBarCenter}>
          <span className={styles.topBarTitle}>
            <Database size={15} style={{ marginRight: 7 }} />
            DbService Tracking
          </span>
        </div>
        <div className={styles.topBarRight} />
      </div>

      {/* 3-column body */}
      <div className={styles.body}>

        {/* ── Panel 1: Service Files ── */}
        <div className={styles.panel}>

          {loadingServices ? (
            <div className={styles.loaderWrap}><span className={styles.spinner} /></div>
          ) : serviceFiles.length === 0 ? (
            <div className={styles.emptyList}>No data for {month} {year}</div>
          ) : (
            serviceFiles.map((sf) => {
              const active = selectedService === sf.name;
              return (
                <div
                  key={sf.name}
                  className={`${styles.row} ${active ? styles.rowActive : ""}`}
                  onClick={() => setSelectedService(sf.name)}
                >
                  <span className={styles.rowName}>{sf.name}</span>
                  <SizeCell bytes={sf.totalBytes} className={styles.rowSize} />
                </div>
              );
            })
          )}
        </div>

        {/* ── Panel 2: Functions ── */}
        <div className={styles.panel}>

          {loadingFuncs ? (
            <div className={styles.loaderWrap}><span className={styles.spinner} /></div>
          ) : !selectedService ? (
            <div className={styles.emptyList}>Select a service</div>
          ) : funcList.length === 0 ? (
            <div className={styles.emptyList}>No functions found</div>
          ) : (
            funcList.map((fn) => {
              const active = selectedFunc?.functionName === fn.functionName;
              return (
                <div
                  key={fn.functionName}
                  className={`${styles.row} ${active ? styles.rowActive : ""}`}
                  onClick={() => setSelectedFunc(fn)}
                >
                  <span className={styles.rowName}>{fn.functionName}</span>
                  <div className={styles.rowMeta}>
                    <SizeCell bytes={fn.totalBytes} className={styles.rowSize} />
                    <span className={styles.rowCount}>{fn.callCount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Panel 3: Date Breakdown ── */}
        <div className={styles.panel3}>
          {/* Header */}
          <div className={styles.panel3Header}>
            <div className={styles.selectors}>
              <select
                className={styles.select}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                className={styles.select}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <span className={styles.totalCount}>{totalCount.toLocaleString()}</span>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <div className={styles.tableHead}>
              <span className={styles.colDate}>Date</span>
              <span className={styles.colCount}>Counts</span>
              <span className={styles.colSize}>Size</span>
            </div>

            <div className={styles.tableBody}>
              {loadingDates ? (
                <div className={styles.loaderWrap}><span className={styles.spinner} /></div>
              ) : !selectedFunc ? (
                <div className={styles.emptyList}>Select a function</div>
              ) : dateRows.length === 0 ? (
                <div className={styles.emptyList}>No data for this period</div>
              ) : (
                dateRows.map((row) => (
                  <div key={row.date} className={styles.tableRow}>
                    <span className={styles.colDate}>
                      {dayjs(row.date).format("D MMM")}
                    </span>
                    <span className={styles.colCount}>{row.count.toLocaleString()}</span>
                    <SizeCell bytes={row.bytes} className={styles.colSize} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DbServiceTracking;
