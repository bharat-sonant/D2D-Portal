import { useState } from "react";
import dayjs from "dayjs";
import { useParams, NavLink } from "react-router-dom";
import styles from "./DbServiceTracking.module.css";
import topbarStyles from "../../../Style/MainLayout/Topbar.module.css";
import wevoisLogo from "../../../assets/images/wevoisLogo.png";
import { Database, MonitorDot } from "lucide-react";
import ServiceListPanel from "./components/ServiceListPanel";
import FunctionListPanel from "./components/FunctionListPanel";
import DateBreakdownPanel from "./components/DateBreakdownPanel";

const DbServiceTracking = () => {
  const { city } = useParams();
  const [selectedService, setSelectedService] = useState("MapServices");
  const [selectedFunc,    setSelectedFunc]    = useState(null);
  const [year,  setYear]  = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MMMM"));

  return (
    <div className={styles.page}>
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
        <div className={styles.topBarRight}>
          <NavLink
            to={`/${city}/d2dMonitoring/monitoring`}
            className={({ isActive }) =>
              `${topbarStyles.menuItem} ${isActive ? topbarStyles.menuItemActive : ""}`
            }
          >
            <div className={topbarStyles.menuIcon}>
              <MonitorDot className={topbarStyles.navIcon} size={20} />
            </div>
            <span className={topbarStyles.menuLabel}>Monitoring</span>
          </NavLink>
        </div>
      </div>

      <div className={styles.body}>
        <ServiceListPanel
          selectedService={selectedService}
          onSelectService={(s) => { setSelectedService(s); setSelectedFunc(null); }}
        />
        <FunctionListPanel
          selectedService={selectedService}
          year={year}
          month={month}
          selectedFunc={selectedFunc}
          onSelectFunc={setSelectedFunc}
        />
        <DateBreakdownPanel
          selectedService={selectedService}
          selectedFunc={selectedFunc}
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
      </div>
    </div>
  );
};

export default DbServiceTracking;
