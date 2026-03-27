import { useState, useEffect } from "react";
import styles from "../DbServiceTracking.module.css";
import { getFunctionStats } from "../../../Services/DbServiceTracker/serviceTracker";

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} Gb`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} Mb`;
  if (bytes >= 1024)      return `${(bytes / 1024).toFixed(2)} Kb`;
  return `${Math.round(bytes)} B`;
}

const FunctionListPanel = ({ selectedService, year, month, selectedFunc, onSelectFunc, city }) => {
  const [funcList, setFuncList] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!selectedService) { setFuncList([]); return; }
    let cancelled = false;
    setLoading(true);
    setFuncList([]);
    getFunctionStats(selectedService, year, month).then((data) => {
      if (cancelled) return;
      setFuncList(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedService, year, month, city]);

  return (
    <div className={styles.panel}>
      {loading ? (
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
              onClick={() => onSelectFunc?.(fn)}
            >
              <span className={styles.rowName}>{fn.functionName}</span>
              <div className={styles.rowMeta}>
                <span className={styles.rowSize}>{formatSize(fn.totalBytes)}</span>
                <span className={styles.rowCount}>{fn.callCount.toLocaleString()}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FunctionListPanel;
