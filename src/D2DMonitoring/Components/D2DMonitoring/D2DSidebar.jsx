import { useEffect, useState } from "react";
import LogoImage from "../../../../src/components/Common/Image/LogoImage";
import { images } from "../../../assets/css/imagePath";
import {
  Bot,
  ClipboardMinus,
  LayoutDashboard,
  MapPinHouse,
  Menu,
  X,
  Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "../../Style/D2DMonitoring/Sidebar.module.css";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/d2dMonitoring/dashboard", tag: "Live" },
  { id: "realtime", label: "Monitoring", icon: Activity , to: "/d2dMonitoring/monitoring", tag: "AI" },
  { id: "report", label: "Report", icon: ClipboardMinus, to: "/d2dMonitoring/report", tag: "Data" },
  // { id: "monitoring", label: "Monitoring", icon: CircleGauge, to: "/d2dMonitoring/monitoring", tag: "Auto" },
  // { id: "daily-report", label: "Daily Report", icon: FileText, to: "/d2dMonitoring/daily-report", tag: "Doc" },
];

const D2DSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const setSidebarWidth = () => {
      const isMobile = window.innerWidth <= 900;
      const width = isMobile ? "0px" : "280px";
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
    <div className={styles.sidebarShell}>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isMobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.brandCard}>
            <LogoImage image={images?.wevoisLogo} />
       
          {/* <div>
            <p className={styles.brandTitle}>D2D Neural Desk</p>
            <p className={styles.brandSub}>Light AI Workspace</p>
          </div> */}
        </div>

        {/* <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search command..."
          />
        </div> */}

        <nav className={styles.menuList}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end
                onClick={() => {
                  if (window.innerWidth <= 900) setIsMobileOpen(false);
                }}
                className={styles.menuItem}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`${styles.menuIcon} ${isActive ? styles.menuIconActive : ""}`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className={styles.menuLabel}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* <div className={styles.footer}>
          <div className={styles.assistantCard}>
            <div className={styles.assistantDot}>
              <Sparkles size={16} />
            </div>
            <div>
              <p className={styles.assistantName}>AI Copilot</p>
              <p className={styles.assistantStatus}>System ready for prompts</p>
            </div>
          </div>
        </div> */}
      </aside>
    </div>
  );
};

export default D2DSidebar;
