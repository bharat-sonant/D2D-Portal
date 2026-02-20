import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ClipboardMinus, LayoutDashboard, Lock, LockOpen, MapPinHouse, Menu, SquareActivity, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoImage from '../../assets/images/wevoisLogo.png';
import styles from "../../assets/css/D2DMonitoring/Sidebar/Sidebar.module.css";
import ChangePassword from "../../components/ChangePassword/changePassword";
import QuickAppSelection from "../QuickAppSelection";
import { useCity } from "../../context/CityContext";
import { Icon2SquareFill } from "react-bootstrap-icons";

const D2DMonitoringSidebar = () => {
    const navigate = useNavigate();
    const { setCityContext } = useCity();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isHoverExpanded, setIsHoverExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showQuickAppSelect, setShowQuickAppSelect] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [userName, setUserName] = useState("Admin");
    const effectiveExpanded = isExpanded || (isHoverExpanded && !isLocked);

    const rememberedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("remembered_user") || "null");
        } catch {
            return null;
        }
    }, []);

    const menuItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", to: "/d2dMonitoring/dashboard" },
        { id: "realtime", icon: MapPinHouse, label: "Realtime-Design", to: "/d2dMonitoring/realtime" },
        { id: "report", icon: ClipboardMinus, label: "Report", to: "/d2dMonitoring/report" },
        { id: "monitoring", icon: SquareActivity, label: "Monitoring", to: "/d2dMonitoring/monitoring" },
    ];

    useEffect(() => {
        const savedName = localStorage.getItem("name");
        if (savedName) setUserName(savedName);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginDate");
        localStorage.removeItem("name");
        localStorage.removeItem("userId");
        localStorage.removeItem("city");
        localStorage.removeItem("cityId");
        localStorage.removeItem("defaultCity");
        localStorage.removeItem("logoUrl");

        setCityContext({
            city: "",
            cityId: "",
            cityLogo: "",
        });
        navigate("/");
    };

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
                    if (window.innerWidth > 768 && !isLocked) setIsHoverExpanded(true);
                }}
                onMouseLeave={() => {
                    if (window.innerWidth > 768 && !isLocked) setIsHoverExpanded(false);
                }}
            >
                <div className={styles.header}>
                    <div className={styles.logoWrap}>
                        <div className={styles.logo} title="D2DMonitoring">
                            <img src={LogoImage} alt="D2DMonitoring" title="D2DMonitoring" />
                        </div>
                        {effectiveExpanded && <span className={styles.brand}>D2D Monitoring</span>}
                    </div>

                    <button
                        className={styles.collapseBtn}
                        title={isLocked ? "Unlock sidebar" : "Lock sidebar"}
                        onClick={() => {
                            if (isLocked) {
                                setIsLocked(false);
                                setIsHoverExpanded(false);
                            } else {
                                setIsLocked(true);
                            }
                        }}
                    >
                        {isLocked ? <Lock size={16} /> : <LockOpen size={16} />}
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
                    <div
                        className={styles.quickAccessCard}
                        onClick={() => setShowQuickAppSelect(true)}
                        title="Open Quick Apps"
                        style={{ cursor: "pointer" }}
                    >
                        <div className={styles.quickAccessIcon}>
                            <Icon2SquareFill size={16} />
                        </div>
                        {effectiveExpanded && (
                            <div className={styles.quickAccessInfo}>
                                <p className={styles.quickAccessTitle}>Quick Apps</p>
                                <p className={styles.quickAccessHint}>Switch apps and account actions</p>
                            </div>
                        )}
                        {effectiveExpanded && <ChevronRight size={16} className={styles.quickAccessArrow} />}
                    </div>
                </div>
            </aside>

            <ChangePassword
                showChangePassword={showChangePassword}
                setShowChangePassword={setShowChangePassword}
            />
            <QuickAppSelection
                showQuickAppSelect={showQuickAppSelect}
                onClose={() => setShowQuickAppSelect(false)}
                isDropdown={true}
                dropdownPosition="bottom-left"
                onChangePassword={() => setShowChangePassword(true)}
                onLogout={handleLogout}
            />
        </>
    );
};

export default D2DMonitoringSidebar;
