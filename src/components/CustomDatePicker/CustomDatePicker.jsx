import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import styles from "./CustomDatePicker.module.css";

const CustomDatePicker = ({ value, onChange }) => {
  const today = value ? new Date(value) : new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [open, setOpen] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const ref = useRef(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSelect = (day) => {
    const selected = new Date(Date.UTC(year, month, day));
    onChange(selected.toISOString().split("T")[0]);
    setIsDateSelected(true);
    setOpen(false);
  };

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      {/* Input */}
      <div className={styles.inputBox} onClick={() => setOpen(!open)}>
        <span>
          {isDateSelected && value
            ? new Date(value).toLocaleDateString("en-GB")
            : "Customize Date"}
        </span>
        <Calendar size={16} />
      </div>

      {/* Calendar */}
      {open && (
        <div className={styles.calendar}>
          <div className={styles.header}>
            <ChevronLeft
              className={styles.calendarHeaderIcon}
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            />
            <span className={styles.calendarTitle}>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <ChevronRight
              className={styles.calendarHeaderIcon}
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            />
          </div>
          <div className={styles.calendarBody}>
            <div className={styles.weekdays}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className={styles.days}>
              {[...Array(firstDay)].map((_, i) => (
                <span key={i} />
              ))}

              {[...Array(daysInMonth)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i + 1)}
                  className={
                    value &&
                      new Date(value).getDate() === i + 1 &&
                      new Date(value).getMonth() === month
                      ? styles.active
                      : ""
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
