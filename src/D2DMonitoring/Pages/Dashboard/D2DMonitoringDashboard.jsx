import { useEffect, useState } from "react";
import style from '../../../assets/css/Dashboard/Dashboard.module.css'
import d2dStyle from '../../../assets/css/D2DMonitoring/Dashboard/D2DMonitoringDashboard.module.css';
import {
  Map as MapIcon,
  Users,
  Warehouse,
  MapPinned,
  CheckCircle2,
  Activity,
  PauseCircle,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import iconSunrise from "../../../assets/images/icons/iconSunrise.png";
import iconSunshine from "../../../assets/images/icons/iconSunshine.png";
import iconSunset from "../../../assets/images/icons/iconSunset.png";
import iconNight from "../../../assets/images/icons/iconNight.png";

const D2DMonitoringDashboard = () => {

  const [greeting, setGreeting] = useState("Good Morning");
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("User");
  const [sessionType, setSessionType] = useState("morning");

  const zoneStats = {
    heroesOnWork: 89,
    garageDuty: "0/0",
    zones: { total: 74, completed: 31, active: 29, inactive: 9, stop: 5 },
  };
  const updateDateTime = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      setGreeting("Good Morning");
      setSessionType("morning");
    } else if (hours < 16) {
      setGreeting("Good Afternoon");
      setSessionType("afternoon");
    } else if (hours < 20) {
      setGreeting("Good Evening");
      setSessionType("evening");
    } else {
      setGreeting("Good Night");
      setSessionType("night");
    }

    setCurrentDate(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  };
  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    const storedUserName = localStorage.getItem("name");
    if (storedUserName) setUserName(storedUserName);

    return () => clearInterval(interval);
  }, []);

  const sessionImages = {
    morning: { src: iconSunrise, alt: "Morning sunrise" },
    afternoon: { src: iconSunshine, alt: "Afternoon sun" },
    evening: { src: iconSunset, alt: "Evening sunset" },
    night: { src: iconNight, alt: "Night moon" },
  };

  const sessionClassMap = {
    morning: d2dStyle.heroMorning,
    afternoon: d2dStyle.heroAfternoon,
    evening: d2dStyle.heroEvening,
    night: d2dStyle.heroNight,
  };

  const zoneDetailItems = [
    {
      label: "Total Zone",
      value: zoneStats.zones.total,
      icon: MapPinned,
      accent: "#4f46e5",
      note: "Planned coverage zones",
    },
    {
      label: "Completed Zone",
      value: zoneStats.zones.completed,
      icon: CheckCircle2,
      accent: "#16a34a",
      note: "Execution completed",
    },
    {
      label: "Active Zone",
      value: zoneStats.zones.active,
      icon: Activity,
      accent: "var(--themeColor)",
      note: "Currently in progress",
    },
    {
      label: "Inactive Zone",
      value: zoneStats.zones.inactive,
      icon: PauseCircle,
      accent: "#64748b",
      note: "No activity detected",
    },
    {
      label: "Stop Zone",
      value: zoneStats.zones.stop,
      icon: AlertTriangle,
      accent: "#ea580c",
      note: "Require quick attention",
    },
    {
      label: "Heroes On Work",
      value: zoneStats.heroesOnWork,
      icon: Users,
      accent: "var(--themeColor)",
      note: "Active teams in field",
    },
    {
      label: "Garage Duty",
      value: zoneStats.garageDuty,
      icon: Warehouse,
      accent: "#2563eb",
      note: "Vehicles in reserve",
    },
  ];

  return (
    <div className={`${style.dashboardPage} ${d2dStyle.dashboardPageRoot}`}>
      <div className={`${style.dashboardLeft} ${d2dStyle.dashboardLeftFull}`}>
        <div className={d2dStyle.dashboardContent}>

          <section className={`${d2dStyle.heroCard} ${sessionClassMap[sessionType]}`}>
            <div className={d2dStyle.heroGlowA} />
            <div className={d2dStyle.heroGlowB} />

            <div className={d2dStyle.heroMain}>
              <div className={d2dStyle.metaItem}>
                <CalendarDays size={15} />
                <span>{currentDate}</span>
              </div>
              <h2 className={d2dStyle.heroTitle}>
                {greeting}, <span>{userName}</span>
              </h2>
            </div>

            <div className={d2dStyle.heroVisual}>
              <img
                src={sessionImages[sessionType].src}
                alt={sessionImages[sessionType].alt}
                className={d2dStyle.heroSessionImage}
              />
            </div>
          </section>

          <section className={d2dStyle.zoneCard}>
            <div className={d2dStyle.zoneCardHeader}>
              <div className={d2dStyle.zoneTitleWrap}>
                <h3>Zone Details</h3>
                <p>Execution-focused operational cards</p>
              </div>
              <div className={d2dStyle.zoneHeaderRight}>
                <MapIcon size={18} color="var(--themeColor)" />
              </div>
            </div>

            <div className={d2dStyle.zoneGrid}>
              {zoneDetailItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className={d2dStyle.zoneStatItem}>
                    <div
                      className={d2dStyle.zoneStatIcon}
                      style={{
                        color: item.accent,
                        background: `${item.accent}1a`
                      }}
                    >
                      <Icon size={17} />
                    </div>
                    <div className={d2dStyle.zoneStatText}>
                      <p className={d2dStyle.zoneStatLabel}>{item.label}</p>
                      <h4 className={d2dStyle.zoneStatValue}>{item.value}</h4>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default D2DMonitoringDashboard;

