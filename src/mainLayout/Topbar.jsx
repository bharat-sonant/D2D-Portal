


import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Eye,
  Settings,
  LockKeyhole,
  Frown,
  Ellipsis,
  X,
} from "lucide-react";
import styles from "../Style/MainLayout/Topbar.module.css";
import { images } from "../assets/css/imagePath";
import { useCity } from "../context/CityContext";
import ChangePassword from "../components/ChangePassword/changePassword";
import logoStyle from "../assets/css/DefaultCitySelection/defaultCitySelection.module.css";

const Topbar = ({ customTitle, setShowDefaultCity }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [firstchar, setFirsthar] = useState("");
  const [secondchar, setSecondhar] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const storedName = localStorage.getItem("name");
  const storedCity = localStorage.getItem("city");
  const {city, setCity, setCityId, cityLogo, setCityLogo} = useCity();
  const Logo = cityLogo || images?.wevoisLogo;
  const titleToShow = city || customTitle || storedCity || "D2D PORTAL";

  const menuItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "#354db9",
      path: "/Dashboard",
    },
    {
      id: "User",
      label: "User",
      icon: Users,
      color: "#b84dc5",
      path: "/users",
    },
    {
      id: "City",
      label: "City",
      icon: Building2,
      color: "#3481c6",
      path: "/cities",
    },
    {
      id: "Reports",
      label: "Reports",
      icon: FileText,
      color: "#17a748",
      path: "/reports",
    },
    {
      id: "Monitoring",
      label: "Monitoring",
      icon: Eye,
      color: "#d84672",
      path: "/monitoring",
    },
    {
      id: "Settings",
      label: "Settings",
      icon: Settings,
      color: "#6e35a5",
      path: "/settings",
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
    } else {
      console.log("Name not found in local storage");
    }
  }, [storedName]);

const handleLogout = () => {
    setCity("");
    setCityId("");
    setCityLogo("");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("loginDate");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("city");
    localStorage.removeItem("cityId");
    localStorage.removeItem("defaultCity");
    localStorage.removeItem("logoUrl");
   
    navigate("/");
  };
 const changePass = () => {
    setShowChangePassword(true);
  }
  return (
    <>
      <div className={styles.header}>
        {/* LEFT */}
        <div className={styles.headerLeft}>
          <div className={styles.companyLogo}>
            <div className={styles.logoImg}>
              <img
                src={Logo}
                alt="Logo"
                onError={(e) => (e.target.src = images?.wevoisLogo)}
              />
            </div>
            <div
              className={styles.logoText}
              onClick={() => setShowDefaultCity(true)}
            >
              {titleToShow}
            </div>
          </div>
        </div>

        {/* DESKTOP + MOBILE MENU */}
        <div
          className={`${styles.desktopMenu} ${
            showMobileMenu ? styles.mobileMenuOpen : ""
          }`}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`${styles.menuItem} ${
                  isActive ? styles.menuItemActive : ""
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  "--menu-color": item.color,
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                <div
                  className={`${styles.menuIcon} ${
                    isActive ? styles.menuIconActive : ""
                  }`}
                >
                  <Icon className={styles.navIcon} size={20} />
                </div>

                <span
                  className={`${styles.menuLabel} ${
                    isActive ? styles.menuLabelActive : ""
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
          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={20} /> : <Ellipsis size={20} />}
          </button>

          {/* User */}
          {city && (
            <div className={`dropdown ${styles.userBadge}`}>
              <button
                className={`btn ${styles.userDropdownBtn}`}
                data-bs-toggle="dropdown"
              >
                <span className={styles.userBG}>
                  {firstchar}
                  {secondchar}
                </span>
                <span className={styles.userName}>{storedName}</span>
              </button>

              <ul className={`dropdown-menu ${styles.dropdownCustom}`}>
                <li
                  onClick={changePass}
                  className={styles.dropdownLI}
                >
                  <span className={styles.dropdownItem}>
                    <LockKeyhole size={16} /> Change Password
                  </span>
                </li>
                <li onClick={handleLogout} className={styles.dropdownLI}>
                  <span className={styles.dropdownItem}>
                    <Frown size={16} /> Log Out
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <ChangePassword
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
      />
    </>
  );
};

export default Topbar;
