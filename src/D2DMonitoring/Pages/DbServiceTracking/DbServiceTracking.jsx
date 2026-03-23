import { useState, useEffect, useCallback, forwardRef } from "react";
import styles from "./DbServiceTracking.module.css";
import wevoisLogo from "../../../assets/images/wevoisLogo.png";
import { Database, Calendar, Activity, HardDrive, Zap } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getServiceFiles, getFunctionStats } from "../../Services/DbServiceTracker/serviceTracker";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
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
  const [selectedDate, setSelectedDate]       = useState(new Date());
  const [serviceFiles, setServiceFiles]       = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingFuncs, setLoadingFuncs]       = useState(false);
  const [colorMap, setColorMap]               = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [funcMap, setFuncMap]                 = useState({});
  const [selectedFunc, setSelectedFunc]       = useState(null);

  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    const data = await getServiceFiles(selectedDate);
    setServiceFiles(data);
    setLoadingServices(false);
    setColorMap((prev) => {
      const next = { ...prev };
      data.forEach((sf, i) => {
        if (!next[sf.name]) next[sf.name] = SERVICE_COLORS[i % SERVICE_COLORS.length];
      });
      return next;
    });
    if (data.length > 0) {
      setSelectedService((prev) => prev ?? data[0].name);
      setFuncMap((prev) => {
        if (prev[data[0].name]) return prev;
        setLoadingFuncs(true);
        getFunctionStats(data[0].name, selectedDate).then((fns) => {
          setFuncMap((p) => ({ ...p, [data[0].name]: fns }));
          if (fns.length > 0) setSelectedFunc((f) => f ?? fns[0]);
          setLoadingFuncs(false);
        });
        return prev;
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    setSelectedFunc(null);
    setFuncMap({});
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    const interval = setInterval(loadServices, 10000);
    window.addEventListener("d2d_tracker_update", loadServices);
    return () => {
      clearInterval(interval);
      window.removeEventListener("d2d_tracker_update", loadServices);
    };
  }, [loadServices]);

  const handleServiceClick = useCallback(async (sf) => {
    setSelectedService(sf.name);
    setSelectedFunc(null);
    if (!funcMap[sf.name]) {
      setLoadingFuncs(true);
      const fns = await getFunctionStats(sf.name, selectedDate);
      setFuncMap((prev) => ({ ...prev, [sf.name]: fns }));
      if (fns.length > 0) setSelectedFunc(fns[0]);
      setLoadingFuncs(false);
    } else {
      const fns = funcMap[sf.name];
      if (fns.length > 0) setSelectedFunc(fns[0]);
    }
  }, [funcMap, selectedDate]);

  const handleFuncClick = useCallback((fn) => {
    setSelectedFunc(fn);
  }, []);

  const fns     = selectedService ? (funcMap[selectedService] || []) : [];
  const color   = selectedService ? (colorMap[selectedService] || SERVICE_COLORS[0]) : SERVICE_COLORS[0];
  const avg     = selectedFunc?.callCount > 0 ? selectedFunc.totalBytes / selectedFunc.callCount : 0;

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

      {/* Body — 3 panels */}
      <div className={styles.body}>

        {/* Panel 1 — Service Files */}
        <div className={styles.panel1}>
          <div className={styles.panelHeader}>
            <div className={styles.panelLabel}>Date</div>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="dd MMM yyyy"
              maxDate={new Date()}
              popperPlacement="bottom-start"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className={styles.panelLabel} style={{ padding: "12px 14px 6px" }}>Services</div>

          <div className={styles.listScroll}>
            {loadingServices ? (
              <div className={styles.loaderWrap}>
                <span className={styles.spinner} />
              </div>
            ) : serviceFiles.length === 0 ? (
              <div className={styles.emptyList}>No data for this date</div>
            ) : (
              serviceFiles.map((sf) => {
                const c       = colorMap[sf.name] || SERVICE_COLORS[0];
                const active  = selectedService === sf.name;
                return (
                  <div
                    key={sf.name}
                    className={`${styles.serviceRow} ${active ? styles.rowActive : ""}`}
                    style={active ? { borderLeftColor: c, background: `${c}12` } : {}}
                    onClick={() => handleServiceClick(sf)}
                  >
                    <span className={styles.dot} style={{ background: c }} />
                    <span className={styles.rowName}>{sf.name}</span>
                    <span
                      className={styles.badge}
                      style={active ? { background: c, color: "#fff" } : {}}
                    >
                      {sf.totalCalls}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel 2 — Functions */}
        <div className={styles.panel2}>
          <div className={styles.panelLabel} style={{ padding: "14px 14px 8px" }}>
            {selectedService ? selectedService : "Functions"}
          </div>

          <div className={styles.listScroll}>
            {loadingFuncs ? (
              <div className={styles.loaderWrap}>
                <span className={styles.spinner} />
              </div>
            ) : !selectedService ? (
              <div className={styles.emptyList}>Select a service</div>
            ) : fns.length === 0 ? (
              <div className={styles.emptyList}>No functions found</div>
            ) : (
              fns.map((fn) => {
                const active = selectedFunc?.functionName === fn.functionName;
                return (
                  <div
                    key={fn.functionName}
                    className={`${styles.funcRow} ${active ? styles.rowActive : ""}`}
                    style={active ? { borderLeftColor: color, background: `${color}12` } : {}}
                    onClick={() => handleFuncClick(fn)}
                  >
                    <span
                      className={styles.funcDot}
                      style={active ? { background: color } : {}}
                    />
                    <span className={styles.rowName}>{fn.functionName}</span>
                    <span
                      className={styles.badge}
                      style={active ? { background: color, color: "#fff" } : {}}
                    >
                      {fn.callCount}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel 3 — Detail */}
        <div className={styles.panel3}>
          {!selectedFunc ? (
            <div className={styles.emptyState}>
              <Database size={48} color="#d1d8e8" />
              <p>Select a function<br />to view its details.</p>
            </div>
          ) : (
            <div className={styles.detailWrap}>
              <div className={styles.detailHeader}>
                <div className={styles.detailBreadcrumb} style={{ color }}>
                  {selectedService}
                </div>
                <div className={styles.detailTitle}>{selectedFunc.functionName}</div>
              </div>

              <div className={styles.statCards}>
                <div className={styles.statCard} style={{ borderTopColor: "#4f8ef7" }}>
                  <div className={styles.statCardIcon} style={{ background: "#eef3fe" }}>
                    <Activity size={22} color="#4f8ef7" />
                  </div>
                  <div className={styles.statCardVal}>{selectedFunc.callCount.toLocaleString()}</div>
                  <div className={styles.statCardLabel}>Total Calls</div>
                </div>

                <div className={styles.statCard} style={{ borderTopColor: "#10b981" }}>
                  <div className={styles.statCardIcon} style={{ background: "#edfaf4" }}>
                    <HardDrive size={22} color="#10b981" />
                  </div>
                  <div className={styles.statCardVal}>{formatBytes(selectedFunc.totalBytes)}</div>
                  <div className={styles.statCardLabel}>Data Consumed</div>
                </div>

                <div className={styles.statCard} style={{ borderTopColor: "#f59e0b" }}>
                  <div className={styles.statCardIcon} style={{ background: "#fff4e5" }}>
                    <Zap size={22} color="#f59e0b" />
                  </div>
                  <div className={styles.statCardVal}>{formatBytes(avg)}</div>
                  <div className={styles.statCardLabel}>Avg / Call</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DbServiceTracking;
