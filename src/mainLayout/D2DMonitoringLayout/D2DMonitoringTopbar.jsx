import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ClipboardMinus, LayoutDashboard, MapPinHouse, Menu, SquareActivity, Store, UserStar, X, } from "lucide-react";

import { NavLink } from "react-router-dom";
import LogoImage from '../../assets/images/wevoisLogo.png';
import styles from "../../assets/css/D2DMonitoring/Sidebar/Sidebar.module.css";

const D2DMonitoringSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHoverExpanded, setIsHoverExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [userName, setUserName] = useState("Admin");
    const effectiveExpanded = isExpanded || isHoverExpanded;

    const rememberedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("remembered_user") || "null");
        } catch {
            return null;
        }
    }, []);

    const menuItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", to: "/d2dMonitoring/dashboard" },
        { id: "realtime", icon: MapPinHouse, label: "Realtime Design", to: "/d2dMonitoring/realtime" },
        { id: "report", icon: ClipboardMinus, label: "Report", to: "/d2dMonitoring/report" },
        { id: "monitoring", icon: SquareActivity, label: "Monitoring", to: "/monitoring" },
    ];

    useEffect(() => {
        const savedName = localStorage.getItem("name");
        if (savedName) setUserName(savedName);
    }, []);

    useEffect(() => {
        const setSidebarWidth = () => {
            const isMobile = window.innerWidth <= 768;
            const width = isMobile ? "0px" : effectiveExpanded ? "280px" : "80px";
            document.documentElement.style.setProperty("--d2d-sidebar-width", width);
        };

        setSidebarWidth();
        window.addEventListener("resize", setSidebarWidth);
        return () => {
            window.removeEventListener("resize", setSidebarWidth);
            document.documentElement.style.removeProperty("--d2d-sidebar-width");
        };
    }, [effectiveExpanded]);

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

    return (
        <>
            <button
                className={`${styles.mobileToggle} ${isMobileOpen ? styles.mobileToggleShift : ""}`}
                onClick={() => setIsMobileOpen((prev) => !prev)}
            >
                {isMobileOpen ? <X /> : <Menu />}
            </button>

            {isMobileOpen && <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />}

            <aside
                className={`${styles.sidebar} ${effectiveExpanded ? styles.expanded : styles.collapsed} ${isMobileOpen ? styles.mobileOpen : ""
                    }`}
                onMouseEnter={() => {
                    if (window.innerWidth > 768) setIsHoverExpanded(true);
                }}
                onMouseLeave={() => {
                    if (window.innerWidth > 768) setIsHoverExpanded(false);
                }}
            >
                <div className={styles.header}>
                    <div className={styles.logoWrap}>
                        <div className={styles.logo} title="D2DMonitoring">
                            <img src={LogoImage} alt="D2DMonitoring" title="D2DMonitoring" />
                        </div>
                        {effectiveExpanded && <span className={styles.brand}>D2D Monitoring</span>}
                    </div>

                    <button className={styles.collapseBtn} onClick={() => setIsExpanded((prev) => !prev)}>
                        <ChevronRight className={effectiveExpanded ? styles.rotate : ""} size={20} />
                    </button>

                    <button className={styles.mobileClose} onClick={() => setIsMobileOpen(false)}>
                        <X size={22} />
                    </button>
                </div>

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
                                {!effectiveExpanded && <span className={styles.tooltip}>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </div>

                <div className={styles.footer}>
                    <div className={styles.profile}>
                        <div className={styles.avatar}>{getInitial(userName)}</div>
                        {effectiveExpanded && (
                            <div className={styles.userInfo}>
                                <p className={styles.name}>{userName}</p>
                                <p className={styles.status}>{rememberedUser?.emailAddress || ""}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default D2DMonitoringSidebar;
