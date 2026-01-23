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
  ClipboardCheck
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
      color: "#1e40af", // Deep Blue
      path: "/field-executive/dashboard",
    },

    {
      id: "Tasks",
      label: "Tasks",
      icon: ClipboardList,
      color: "#0f766e", // Deep Teal
      path: "/field-executive/tasks",
    },
    {
      id: "Assignments",
      label: "Assignments",
      icon: ClipboardCheck,
      color: "#075985", // Strong Cyan-Blue
      path: "/field-executive/assignments",
    },

    {
      id: "Employees",
      label: "Users",
      icon: Users,
      color: "#5b21b6", // Deep Purple
      path: "/field-executive/users",
    },

    {
      id: "Tracking",
      label: "Tracking",
      icon: MapPin,
      color: "#166534", // Forest Green
      path: "/field-executive/tracking",
    },

    {
      id: "Reports",
      label: "Report",
      icon: FileText,
      color: "#9a3412", // Burnt Orange
      path: "/field-executive/reports",
    },
    {
      id: "Analysis",
      label: "Analysis",
      icon: BarChart3,
      color: "#7f1d1d", // Deep Red
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
