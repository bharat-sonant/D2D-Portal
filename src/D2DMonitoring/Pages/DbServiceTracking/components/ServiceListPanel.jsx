import { useState, useEffect } from "react";
import dayjs from "dayjs";
import styles from "../DbServiceTracking.module.css";
import { getServiceFiles } from "../../../Services/DbServiceTracker/serviceTracker";

// static — order never changes
const SERVICE_GROUPS = [
  { label: "Map Services",              key: "MapServices"             },
  { label: "Ward Services",             key: "WardServices"            },
  { label: "Employee Detail Services",  key: "EmployeeDetailServices" },
];

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} Gb`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} Mb`;
  if (bytes >= 1024)      return `${(bytes / 1024).toFixed(2)} Kb`;
  return `${Math.round(bytes)} B`;
}

const ServiceListPanel = ({ selectedService, onSelectService, city }) => {
  const [dataMap, setDataMap] = useState({});

  useEffect(() => {
    let cancelled = false;
    const year  = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");

    setDataMap({});
    getServiceFiles(year, month).then((list) => {
      if (cancelled) return;
      const map = {};
      list.forEach((sf) => { map[sf.name] = sf; });
      setDataMap(map);
    });
    return () => { cancelled = true; };
  }, [city]);

  return (
    <div className={styles.panel}>
      {SERVICE_GROUPS.map((group) => {
        const sf     = dataMap[group.key];
        const active = selectedService === group.key;
        return (
          <div
            key={group.key}
            className={`${styles.row} ${active ? styles.rowActive : ""}`}
            onClick={() => onSelectService?.(group.key)}
          >
            <span className={styles.rowName}>{group.label}</span>
            <div className={styles.rowMeta}>
              <span className={styles.rowSize}>{sf ? formatSize(sf.totalBytes) : "—"}</span>
              <span className={styles.rowCount}>{sf ? sf.totalCalls.toLocaleString() : "—"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceListPanel;
