import { useEffect, useState } from "react";
import style from "../../../Style/Reports_Style/SidePannel/SidePannel.module.css";
import { File, Trash2 } from "lucide-react";

const THEME_KEY = "sidepanel-theme";
const THEME_TIME_KEY = "sidepanel-theme-time";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

const SidePannel = ({ selectedReport, setSelectedReport }) => {
  const [theme, setTheme] = useState("dark");

  const menuItems = [
    {
      label: "Zone",
      icon: File,
    },
    {
      label: "Binlifting",
      icon: Trash2,
    },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedTime = localStorage.getItem(THEME_TIME_KEY);

    const now = Date.now();

    if (savedTheme && savedTime) {
      const timeDiff = now - parseInt(savedTime, 10);

      if (timeDiff >= SEVEN_DAYS) {
        // Toggle theme
        const newTheme = savedTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        localStorage.setItem(THEME_TIME_KEY, now.toString());
      } else {
        setTheme(savedTheme);
      }
    } else {
      // First time visit
      localStorage.setItem(THEME_KEY, "dark");
      localStorage.setItem(THEME_TIME_KEY, now.toString());
      setTheme("dark");
    }

    // Interval check every hour (so it auto switches without refresh)
    const interval = setInterval(() => {
      const themeNow = localStorage.getItem(THEME_KEY);
      const themeTime = localStorage.getItem(THEME_TIME_KEY);

      if (!themeNow || !themeTime) return;

      const diff = Date.now() - parseInt(themeTime, 10);

      if (diff >= SEVEN_DAYS) {
        const newTheme = themeNow === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        localStorage.setItem(THEME_TIME_KEY, Date.now().toString());
      }
    }, 60 * 60 * 1000); // check every 1 hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${style.menuList} ${style[theme]}`}>
      {menuItems.map(({label, icon : Icon}) => (
        <div
          key={label}
          className={`${style.menuItem} ${
            selectedReport === label ? style.active : ""
          }`}
          onClick={() => setSelectedReport(label)}
        >
          <div className={style.menuIconBG}>
            <Icon className={style.menuIcon} />
          </div>
          <div className={style.menuText}>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default SidePannel;
