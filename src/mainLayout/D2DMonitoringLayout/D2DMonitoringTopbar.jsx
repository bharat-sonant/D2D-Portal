import { useEffect, useState } from "react";
import { ClipboardMinus, FileText, LayoutDashboard, MapPinHouse, Menu, SquareActivity, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "../../assets/css/D2DMonitoring/Sidebar/Sidebar.module.css";

const D2DMonitoringSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", to: "/d2dMonitoring/dashboard" },
    { id: "realtime", icon: MapPinHouse, label: "Realtime", to: "/d2dMonitoring/realtime" },
    { id: "report", icon: ClipboardMinus, label: "Report", to: "/d2dMonitoring/report" },
    { id: "monitoring", icon: SquareActivity, label: "Monitoring", to: "/d2dMonitoring/monitoring" },
    { id: "daily-report", icon: FileText, label: "Daily report", to: "/d2dMonitoring/daily-report" },
  ];

  useEffect(() => {
    const setSidebarWidth = () => {
      const isMobile = window.innerWidth <= 768;
      const width = isMobile ? "0px" : "80px";
      document.documentElement.style.setProperty("--d2d-sidebar-width", width);
    };

    setSidebarWidth();
    window.addEventListener("resize", setSidebarWidth);
    return () => {
      window.removeEventListener("resize", setSidebarWidth);
      document.documentElement.style.removeProperty("--d2d-sidebar-width");
    };
  }, []);

  return (
    <>
      <button
        className={`${styles.mobileToggle} ${isMobileOpen ? styles.mobileToggleShift : ""}`}
        onClick={() => setIsMobileOpen((prev) => !prev)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </button>

      {isMobileOpen && <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${styles.collapsed} ${isMobileOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.menu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth <= 768) setIsMobileOpen(false);
                }}
                className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}
              >
                <Icon size={22} />
                <span className={styles.menuLabel}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className={styles.footer}>
          {/* <div className={styles.profile}>
            <div className={styles.avatar}>{userName?.charAt(0)?.toUpperCase() || "A"}</div>
            {isMobileOpen && (
              <div className={styles.userInfo}>
                <p className={styles.name}>{userName}</p>
                <p className={styles.status}>{email}</p>
              </div>
            )}
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default D2DMonitoringSidebar;
