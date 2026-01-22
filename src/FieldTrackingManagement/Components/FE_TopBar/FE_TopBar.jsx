import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  ClipboardList,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

import styles from "../../../Style/MainLayout/Topbar.module.css";
import { images } from "../../../assets/css/imagePath";
import LogoImage from "../../../components/Common/Image/LogoImage";
import QuickAppSelection from "../../../mainLayout/QuickAppSelection";
import ChangePassword from "../../../components/ChangePassword/changePassword";

const FE_TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storedName = localStorage.getItem("name") || "Field Executive";

  const [firstChar, setFirstChar] = useState("");
  const [secondChar, setSecondChar] = useState("");
  const [showQuickAppSelect, setShowQuickAppSelect] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "#3b82f6",
      path: "/field-executive/dashboard",
    },
    {
      id: "Employees",
      label: "Employees",
      icon: Users,
      color: "#8b5cf6",
      path: "/field-executive/employees",
    },
    {
      id: "Tracking",
      label: "Tracking",
      icon: MapPin,
      color: "#22c55e",
      path: "/field-executive/tracking",
    },
    {
      id: "Reports",
      label: "Reports",
      icon: FileText,
      color: "#f97316",
      path: "/field-executive/reports",
    },
    {
      id: "Tasks",
      label: "Tasks",
      icon: ClipboardList,
      color: "#14b8a6",
      path: "/field-executive/tasks",
    },
    {
      id: "Analysis",
      label: "Analysis",
      icon: BarChart3,
      color: "#ef4444",
      path: "/field-executive/analysis",
    },
  ];

  useEffect(() => {
    if (storedName) {
      const parts = storedName.split(" ");
      setFirstChar(parts[0]?.charAt(0).toUpperCase() || "");
      setSecondChar(parts[1]?.charAt(0).toUpperCase() || "");
    }
  }, [storedName]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* TOP BAR */}
      <div className={styles.header}>
        {/* LEFT */}
        <div className={styles.headerLeft}>
          <div className={styles.companyLogo}>
            <LogoImage image={images?.wevoisLogo} />
            <div className={styles.logoText} style={{ cursor: "default" }}>
              Field Executive
            </div>
          </div>
        </div>

        {/* CENTER MENU */}
        <div
          className={`${styles.desktopMenu} ${showMobileMenu ? styles.mobileMenuOpen : ""
            }`}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""
                  }`}
                onClick={() => setShowMobileMenu(false)}
                style={{
                  animationDelay: `${index * 0.08}s`,
                  "--menu-color": item.color,
                }}
              >
                <div
                  className={`${styles.menuIcon} ${isActive ? styles.menuIconActive : ""
                    }`}
                >
                  <Icon className={styles.navIcon} size={20} />
                </div>
                <span
                  className={`${styles.menuLabel} ${isActive ? styles.menuLabelActive : ""
                    }`}
                >
                  {item.label}
                </span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className={styles.headerRight}>
          <button
            className={styles.hamburger}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            className={styles.userBadge}
            onClick={() => setShowQuickAppSelect(!showQuickAppSelect)}
            style={{ cursor: "pointer" }}
          >
            <button className={`btn ${styles.userDropdownBtn}`}>
              <span className={styles.userBG}>
                {firstChar}
                {secondChar}
              </span>
              <span className={styles.userName}>{storedName}</span>
            </button>
          </div>
        </div>
      </div>
      <ChangePassword
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
      />
      <QuickAppSelection
        showQuickAppSelect={showQuickAppSelect}
        onClose={() => setShowQuickAppSelect(false)}
        isDropdown={true}
        onChangePassword={() => setShowChangePassword(true)}
        onLogout={handleLogout}
      />

    </>
  );
};

export default FE_TopBar;
