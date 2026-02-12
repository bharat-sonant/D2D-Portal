import React, { useEffect, useState } from 'react'
import QuickAppSelection from './QuickAppSelection';
import ChangePassword from '../components/ChangePassword/changePassword';
import LogoImage from '../components/Common/Image/LogoImage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from "../Style/MainLayout/Topbar.module.css";
import { ClipboardPlus, File, Fuel, Menu, Users, X } from 'lucide-react';
import { images } from "../assets/css/imagePath";
import { FaRegHandPointRight } from 'react-icons/fa';
import { useCity } from '../context/CityContext';

const FuelManagementTopbar = () => {
   const location = useLocation();
    const navigate = useNavigate();
    const [firstchar, setFirsthar] = useState("");
    const [secondchar, setSecondhar] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const storedName = localStorage.getItem("name");
    const { setCityContext, city, cityId, cityLogo } = useCity();

    const [showQuickAppSelect, setShowQuickAppSelect] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const menuItems = [
        {
            id: "Add Fuel Entries",
            label: "Fuel Entries",
            icon: File,
            color: "#17a748",
            path: "/fuel/add_fuel_entries",
        },
        {
            id: "Fuel Analysis",
            label: "Analysis",
            icon: Fuel,
            color: "#17a748",
            path: "/fuel/fuel_analysis",
        },
        {
            id: "Fuel Report",
            label: "Report",
            icon: ClipboardPlus,
            color: "#17a748",
            path: "/fuel/fuel_report",
        },
    ];

    useEffect(() => {
        if (storedName) {
            let nameParts = storedName.split(" ");
            let nameFirstLetter = nameParts[0].charAt(0).toUpperCase();
            if (nameParts.length > 1) {
                let nameSecondLetter = nameParts[1].charAt(0).toUpperCase();
                setFirsthar(nameFirstLetter);
                setSecondhar(nameSecondLetter);
            } else {
                setFirsthar(nameFirstLetter);
            }
        }
    }, [storedName]);

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
    }

  return (
      <>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.companyLogo}>
                        <LogoImage image={images?.wevoisLogo} />
                        <div className={styles.logoText} style={{ cursor: "default" }}>
                            Fuel Management
                        </div>
                    </div>
                </div>

                {/* <div className={`${styles.desktopMenu} ${showMobileMenu ? styles.mobileMenuOpen : ""}`}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                                onClick={() => setShowMobileMenu(false)}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    "--menu-color": item.color,
                                }}
                            >
                                <div className={`${styles.menuIcon} ${isActive ? styles.menuIconActive : ""}`}>
                                    <Icon className={styles.navIcon} size={20} />
                                </div>
                                <span className={`${styles.menuLabel} ${isActive ? styles.menuLabelActive : ""}`}>
                                    {item.label}
                                </span>
                                {isActive && <div className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </div> */}

                <div className={styles.headerRight}>
                    <button
                        className={styles.hamburger}
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div
                        className={`${styles.userBadge}`}
                        onClick={() => setShowQuickAppSelect(!showQuickAppSelect)}
                        style={{ cursor: "pointer" }}
                    >
                        <button className={`btn ${styles.userDropdownBtn}`}>
                            <span className={styles.userBG}>
                                {firstchar}{secondchar}
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
  )
}

export default FuelManagementTopbar
