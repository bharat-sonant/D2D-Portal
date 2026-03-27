import { useState, useEffect } from "react";
import { X, Database } from "lucide-react";
import dayjs from "dayjs";
import ServiceListPanel from "../../../Pages/DbServiceTracking/components/ServiceListPanel";
import FunctionListPanel from "../../../Pages/DbServiceTracking/components/FunctionListPanel";
import DateBreakdownPanel from "../../../Pages/DbServiceTracking/components/DateBreakdownPanel";
import styles from "./DbServiceOffcanvas.module.css";

const DbServiceOffcanvas = ({ open, onClose, city }) => {
  const [selectedService, setSelectedService] = useState("MapServices");
  const [selectedFunc, setSelectedFunc] = useState(null);
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MMMM"));

  useEffect(() => {
    if (!open) {
      setSelectedService("MapServices");
      setSelectedFunc(null);
    }
  }, [open]);

  useEffect(() => {
    setSelectedService(null);
    setSelectedFunc(null);
    const t = setTimeout(() => setSelectedService("MapServices"), 0);
    return () => clearTimeout(t);
  }, [city]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Db Service Tracking"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Database size={16} />
            </div>
            <div>
              <div className={styles.headerTitle}>Db Service Tracking</div>
              {city && <div className={styles.headerSub}>{city}</div>}
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — three panels side by side */}
        <div className={styles.body}>
          <ServiceListPanel
            selectedService={selectedService}
            onSelectService={(s) => { setSelectedService(s); setSelectedFunc(null); }}
            city={city}
          />
          <FunctionListPanel
            selectedService={selectedService}
            year={year}
            month={month}
            selectedFunc={selectedFunc}
            onSelectFunc={setSelectedFunc}
            city={city}
          />
          <DateBreakdownPanel
            selectedService={selectedService}
            selectedFunc={selectedFunc}
            year={year}
            month={month}
            onYearChange={setYear}
            onMonthChange={setMonth}
            city={city}
          />
        </div>
      </div>
    </>
  );
};

export default DbServiceOffcanvas;
