import React, { useState, forwardRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./DbServiceTracking.module.css";
import wevoisLogo from "../../../assets/images/wevoisLogo.png";
import { Database, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className={styles.datePickerWrapper} onClick={onClick} ref={ref}>
    <Calendar size={15} className={styles.calendarIcon} />
    <span className={styles.dateValue}>{value}</span>
  </div>
));

const DbServiceTracking = () => {
  const { city } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <img src={wevoisLogo} alt="WeVOIS" className={styles.topBarLogo} />
        </div>
        <div className={styles.topBarCenter}>
          <span className={styles.topBarTitle}>
            <Database size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
            DbService Tracking
          </span>
        </div>
        <div className={styles.topBarRight}></div>
      </div>

      <div className={styles.toolbar}>
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

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <Database size={64} color="#b0b8c9" />
          <h2>DbService Tracking</h2>
          <p>City: <strong>{city || "N/A"}</strong></p>
          <p>This page is under construction.</p>
        </div>
      </div>
    </div>
  );
};

export default DbServiceTracking;
