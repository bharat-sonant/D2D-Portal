import { useMemo } from "react";
import dayjs from "dayjs";
import styles from "./QuickDateSelection.module.css";

const QuickDateSelection = ({ value, onChange }) => {
  const todayDate = dayjs().format("YYYY-MM-DD");

  // Always generate the last 7 days from today (static range)
  const last7Days = useMemo(() => {
    const arr = [];
    const today = dayjs();

    for (let i = 0; i < 7; i++) {
      const d = today.subtract(i, "day");
      const fullDate = d.format("YYYY-MM-DD");
      arr.push({
        full: fullDate,
        display: fullDate === todayDate ? "Today" : d.format("DD MMM"),
        day: d.format("ddd"),
      });
    }
    return arr;
  }, [todayDate]);

  return (
    <>
      <div className={styles.dateBoxContainer}>
        {last7Days.map((d) => (
          <div
            key={d.full}
            className={`${styles.dateBox} ${
              d.full === value ? styles.selectedDateBox : ""
            }`}
            onClick={() => onChange(d.full)}
          >
            <div className={styles.dateBoxDay}>{d.day}</div>
            <div className={styles.dateBoxDisplay}>{d.display}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default QuickDateSelection;
