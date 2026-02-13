import { useState } from "react";
import styles from "./SyncData.module.css";

export default function SyncData() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("January");

  const years = ["2024", "2025", "2026"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSync = () => {
    console.log(`Syncing data for ${selectedMonth} ${selectedYear}`);
    // Add your sync logic here
  };

  return (
    <div className={styles.syncContainer}>

      <div className={styles.syncCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>🔄</span>
          </div>
          <h3 className={styles.cardTitle}>Data Synchronization</h3>
          <p className={styles.cardDescription}>
            Choose the time period for data sync
          </p>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={styles.select}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Select Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.select}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectedInfo}>
            <span className={styles.infoLabel}>Selected Period:</span>
            <span className={styles.infoValue}>
              {selectedMonth} {selectedYear}
            </span>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <button onClick={handleSync} className={styles.syncButton}>
            <span className={styles.buttonIcon}>🔄</span>
            Sync Data
          </button>
        </div>
      </div>
    </div>
  );
}

