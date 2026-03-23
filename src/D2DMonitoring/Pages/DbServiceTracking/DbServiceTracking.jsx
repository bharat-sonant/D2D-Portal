import React, { useState, useEffect, forwardRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./DbServiceTracking.module.css";
import wevoisLogo from "../../../assets/images/wevoisLogo.png";
import { Database, Calendar, Activity, HardDrive, Layers, ChevronUp, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getStats } from "../../Services/DbServiceTracker/serviceTracker";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const SERVICE_COLORS = [
  "#4f8ef7", "#10b981", "#f59e0b", "#8b5cf6",
  "#ef4444", "#06b6d4", "#f97316", "#84cc16",
  "#ec4899", "#6366f1", "#14b8a6", "#eab308",
];

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className={styles.datePickerWrapper} onClick={onClick} ref={ref}>
    <Calendar size={14} className={styles.calendarIcon} />
    <span className={styles.dateValue}>{value}</span>
  </div>
));

const DbServiceTracking = () => {
  const { city } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState([]);
  const [sortBy, setSortBy] = useState("callCount");
  const [sortDir, setSortDir] = useState("desc");

  const loadStats = async () => {
    const data = await getStats(selectedDate);
    setStats(data);
  };

  useEffect(() => { loadStats(); }, [selectedDate]);

  useEffect(() => {
    window.addEventListener("d2d_tracker_update", loadStats);
    const interval = setInterval(loadStats, 5000);
    return () => {
      window.removeEventListener("d2d_tracker_update", loadStats);
      clearInterval(interval);
    };
  }, [selectedDate]);

  const totalCalls  = stats.reduce((s, r) => s + r.callCount, 0);
  const totalBytes  = stats.reduce((s, r) => s + r.totalBytes, 0);
  const maxCalls    = Math.max(...stats.map(r => r.callCount), 1);

  const sorted = [...stats].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "callCount") return dir * (a.callCount - b.callCount);
    if (sortBy === "totalBytes") return dir * (a.totalBytes - b.totalBytes);
    return 0;
  });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const SortBtn = ({ col, label }) => (
    <button className={`${styles.sortBtn} ${sortBy === col ? styles.sortBtnActive : ""}`} onClick={() => handleSort(col)}>
      {label}
      {sortBy === col
        ? sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        : <ChevronDown size={12} style={{ opacity: 0.3 }} />}
    </button>
  );

  return (
    <div className={styles.page}>

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <img src={wevoisLogo} alt="WeVOIS" className={styles.topBarLogo} />
        </div>
        <div className={styles.topBarCenter}>
          <span className={styles.topBarTitle}>
            <Database size={16} style={{ marginRight: 7, verticalAlign: "middle" }} />
            DbService Tracking
          </span>
        </div>
        <div className={styles.topBarRight} />
      </div>

      {/* Content */}
      <div className={styles.body}>

        {/* Left Panel */}
        <div className={styles.leftPanel}>

          {/* Date Picker */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Date</div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd MMM yyyy"
              maxDate={new Date()}
              placeholderText="Select date"
              popperPlacement="bottom-start"
              customInput={<CustomDateInput />}
            />
          </div>

          {/* Stats Cards */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Summary</div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "#eef3fe" }}>
                <Activity size={16} color="#4f8ef7" />
              </div>
              <div>
                <div className={styles.statVal}>{totalCalls.toLocaleString()}</div>
                <div className={styles.statLabel}>Total Calls</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "#edfaf4" }}>
                <HardDrive size={16} color="#10b981" />
              </div>
              <div>
                <div className={styles.statVal}>{formatBytes(totalBytes)}</div>
                <div className={styles.statLabel}>Total Data</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "#fff4e5" }}>
                <Layers size={16} color="#f59e0b" />
              </div>
              <div>
                <div className={styles.statVal}>{stats.length}</div>
                <div className={styles.statLabel}>Services</div>
              </div>
            </div>
          </div>


        </div>

        {/* Right Panel — Table */}
        <div className={styles.rightPanel}>
          {sorted.length === 0 ? (
            <div className={styles.emptyState}>
              <Database size={48} color="#d1d8e8" />
              <p>No data for this date.<br />Open the Monitoring page to start tracking.</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className={styles.tableHead}>
                <div className={styles.thIdx}>#</div>
                <div className={styles.thName}>Service Name</div>
                <div className={styles.thBar} />
                <div className={styles.thNum}><SortBtn col="callCount" label="Total Call" /></div>
                <div className={styles.thNum}><SortBtn col="totalBytes" label="Data Consume" /></div>
                <div className={styles.thNum} style={{ color: "#9aa5bc", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Avg / Call</div>
              </div>

              {/* Rows */}
              <div className={styles.tableBody}>
                {sorted.map((row, i) => {
                  const color   = SERVICE_COLORS[i % SERVICE_COLORS.length];
                  const pct     = Math.round((row.callCount / maxCalls) * 100);
                  const avg     = row.callCount > 0 ? Math.round(row.totalBytes / row.callCount) : 0;
                  return (
                    <div className={styles.tableRow} key={row.path}>
                      <div className={styles.tdIdx}>{i + 1}</div>
                      <div className={styles.tdName}>
                        <span className={styles.dot} style={{ background: color }} />
                        <span className={styles.serviceName}>{row.path}</span>
                      </div>
                      <div className={styles.tdBar}>
                        <div className={styles.barTrack}>
                          <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                      <div className={styles.tdNum}>
                        <span className={styles.callBadge} style={{ background: `${color}18`, color }}>{row.callCount}</span>
                      </div>
                      <div className={styles.tdNum}>{formatBytes(row.totalBytes)}</div>
                      <div className={styles.tdNum} style={{ color: "#9aa5bc" }}>{formatBytes(avg)}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default DbServiceTracking;
