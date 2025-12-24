import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../Style/MainLayout/Topbar.module.css";
import { images } from "../assets/css/imagePath";
import { FaTasks } from "react-icons/fa";
import { Car } from "lucide-react";
import { CiSettings } from "react-icons/ci";
import { useCity } from "../context/CityContext";
import { getCityLogo } from "../services/logoServices";
import { GrMapLocation } from "react-icons/gr";
import { TbReportAnalytics } from "react-icons/tb";
import { SiTask } from "react-icons/si";
import { LuUsers } from "react-icons/lu";
import { FaCity } from "react-icons/fa";
import ChangePassword from "../components/ChangePassword/changePassword";

const Topbar = ({ hideNavLinks, customLogo, customTitle }) => {
  const location = useLocation();
  const [firstchar, setFirsthar] = useState("");
  const [secondchar, setSecondhar] = useState("");
  const storedImage = localStorage.getItem("profileImage");
  const storedName = localStorage.getItem("name");
  const storedCity = localStorage.getItem("city");
  // const logoToShow = customLogo || images.wevoisLogo;
  const titleToShow = customTitle || storedCity || "D2D PORTAL";
  const city = useCity();
  const [cityLogo, setCityLogo] = useState(images.wevoisLogo);
const [showChangePassword, setShowChangePassword] = useState(false);


  useEffect(() => {
    if (!city.city) return;

    const logoUrl = getCityLogo(city.city);

    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      setCityLogo(logoUrl);
    };

    img.onerror = () => {
      setCityLogo(images.wevoisLogo);
    };
  }, [city.city]);

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

  //Navnar Customization js
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    iconFilter: "icon-filter-black",
  });

  useEffect(() => {
    const savedStyle = localStorage.getItem("navbarStyle");
    if (savedStyle) {
      setNavbarStyle(JSON.parse(savedStyle));
    }
  }, []);


  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("isLogin");
  localStorage.removeItem("loginDate");
  localStorage.removeItem("name");
  localStorage.removeItem("savedEmail");
  localStorage.removeItem("savedPassword");
  navigate("/");
};

  const changePass = () => {
    setShowChangePassword(true);
  }



  return (
    <>
      <div
        className={`${styles.header}`}
        style={{
          backgroundColor: navbarStyle.backgroundColor,
          color: navbarStyle.textColor,
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className={`${styles.headerLeft}`}>
          <a className={`${styles.companyLogo}`} href="/dashboard">
            {storedImage !== undefined &&
              storedImage !== null &&
              storedImage !== "undefined" ? (
              <img
                className={`img-fluid ${styles.logoImg}`}
                src={storedImage}
                alt="Company Logo"
              />
            ) : (
              <>
                <div className="text-center">
                  <img
                    className={`img-fluid ${styles.logoImg}`}
                    src={cityLogo}
                    title="Attendance portal"
                    alt="Logo"
                  />
                  <div
                    className={`${styles.logoText}`}
                    style={{ color: navbarStyle.textColor }}
                  >
                    {titleToShow}
                  </div>
                </div>
              </>
            )}
          </a>
        </div>
        <div className={`${styles.headerRight}`}>
          <ul className={styles.navbarNav}>
            <Link
              aria-current="page"
              to="/users"
              title="users"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/users" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/users"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <LuUsers
                className={`${styles.iconNav} ${location.pathname === "/users"
                  ? navbarStyle.iconFilter
                  : "SiTask"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color: location.pathname === "/users" ? "#000000" : "#707070",
                }}
              >
                User
              </span>
            </Link>

            <Link
              aria-current="page"
              to="/cities"
              title="cities"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/cities" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/cities"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <FaCity
                className={`${styles.iconNav} ${location.pathname === "/cities"
                  ? navbarStyle.iconFilter
                  : "SiTask"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color:
                    location.pathname === "/cities" ? "#000000" : "#707070",
                }}
              >
                City
              </span>
            </Link>

            <Link
              aria-current="page"
              to="/TaskData"
              title="TaskData"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/TaskData" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/TaskData"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <SiTask
                className={`${styles.iconNav} ${location.pathname === "/TaskData"
                  ? navbarStyle.iconFilter
                  : "SiTask"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color:
                    location.pathname === "/TaskData" ? "#000000" : "#707070",
                }}
              >
                Task Data
              </span>
            </Link>

            <Link
              aria-current="page"
              to="/realtime-monitoring"
              title="Realtime Monitoring"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/realtime-monitoring"
                  ? styles.activeNav
                  : ""
                }`}
              style={
                location.pathname === "/realtime-monitoring"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <GrMapLocation
                className={`${styles.iconNav} ${location.pathname === "/realtime-monitoring"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color:
                    location.pathname === "/realtime-monitoring"
                      ? "#000000"
                      : "#707070",
                }}
              >
                Realtime Monitoring
              </span>
            </Link>
            <Link
              aria-current="page"
              to="/reports"
              title="Reports"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/reports" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/reports"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <TbReportAnalytics
                className={`${styles.iconNav} ${location.pathname === "/reports"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color:
                    location.pathname === "/reports" ? "#000000" : "#707070",
                }}
              >
                Reports
              </span>
            </Link>

            <Link
              aria-current="page"
              to="/tasks"
              title="Tasks"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/tasks" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/tasks"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <FaTasks
                className={`${styles.iconNav} ${location.pathname === "/tasks"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color: location.pathname === "/tasks" ? "#000000" : "#707070",
                }}
              >
                Tasks
              </span>
            </Link>

            <Link
              aria-current="page"
              to="/vehicle"
              title="Vehicles"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/vehicle" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/vehicle"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <Car
                className={`${styles.iconNav} ${location.pathname === "/vehicle"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color:
                    location.pathname === "/vehicle" ? "#000000" : "#707070",
                }}
              >
                Vehicles
              </span>
            </Link>

            <Link
              to="/settings"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/settings" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/settings"
                  ? {
                    backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114",
                    borderBottom: "2px solid #3fb2f1",
                  }
                  : {}
              }
            >
              <CiSettings
                className={`${styles.iconNav} ${location.pathname === "/settings"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{
                  color:
                    location.pathname === "/settings" ? "#000000" : "#707070",
                }}
              >
                Settings {/* 👉 ADDED SETTINGS LABEL */}
              </span>
            </Link>
          </ul>

          {city && (
            // <div className={styles.cityBadge}>
            //   <span className={`avatar ${styles.userBG}`}>{firstchar}{secondchar}</span>
            //   <span className={styles.cityName}>{storedName}</span>
            // </div>
            <div className={`dropdown ${styles.cityBadge}`}>
              <button
                className={`btn dropdown-toggle ${styles.cityBadgeBtn}`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className={`avatar ${styles.userBG}`}>{firstchar}{secondchar}</span>
                <span className={styles.cityName}>{storedName}</span>
              </button>
              <ul className={`dropdown-menu ${styles.dropdownCustom}`}>
                <li onClick={changePass}>
                  <Link className="dropdown-item">
                    Change Password
                  </Link>
                </li>
                <li onClick={handleLogout}>
                  <Link className="dropdown-item" >Log Out</Link>
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
