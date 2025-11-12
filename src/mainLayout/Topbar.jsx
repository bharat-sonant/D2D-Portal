import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../Style/MainLayout/Topbar.module.css";
import { images } from "../assets/css/imagePath";
import { FaUser } from "react-icons/fa";
import { MdKeyboardArrowDown, MdStart } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { PulseLoader } from "react-spinners";
import { FaCity } from "react-icons/fa6";
import { AlignStartVertical, ListStartIcon, LucideUserRoundCheck } from "lucide-react";
import { SkipStartBtn, SkipStartCircleFill } from "react-bootstrap-icons";

const Topbar = ({ hideNavLinks, customLogo, customTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstchar, setFirsthar] = useState("");
  const [secondchar, setSecondhar] = useState("");
  const storedImage = localStorage.getItem("profileImage");
  const storedName = localStorage.getItem("name");
  const isOwner = localStorage.getItem("isOwner");
  const isLoginAsUser = localStorage.getItem("loginAsUser") === "true";
  const isOwnerUser = isOwner === "Yes";
  const shouldShowRed = isLoginAsUser && !isOwnerUser;
  const logoToShow = customLogo || images.wevoisLogo;
  const titleToShow = customTitle || "D2D PORTAL";
  const profileImage = ""


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
    localStorage.setItem("islogin", "Fail");
    localStorage.removeItem("name");
    localStorage.removeItem("isOwner");
    localStorage.removeItem("userName");
    localStorage.removeItem("loginDate");
    localStorage.removeItem("lastPath");
    localStorage.removeItem("empCode");
    localStorage.removeItem("company");
    localStorage.removeItem("branchCode");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("companyEmail");
    localStorage.removeItem("loginAsUser");
    setTimeout(() => {
      navigate("/");
    }, 100);
    console.log("Handle Logout");
  };

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
                    src={logoToShow}
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
              to="/wards"
              title="wards"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/wards" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/wards"
                  ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                  : {}
              }
            >
              <FaCity
                className={`${styles.iconNav} ${location.pathname === "/wards"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{ color: navbarStyle.textColor }}
              >
                Ward List
              </span>
            </Link>


            <Link
              aria-current="page"
              to="/daily-assignment"
              title="Daily Assignment"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/daily-assignment" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/daily-assignment"
                  ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                  : {}
              }
            >
              <LucideUserRoundCheck 
                className={`${styles.iconNav} ${location.pathname === "/daily-assignment"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{ color: navbarStyle.textColor }}
              >
                Daily Assignment
              </span>
            </Link>

             <Link
              aria-current="page"
              to="/start-assignment"
              title="Start Assignment"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/start-assignment" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/start-assignment"
                  ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                  : {}
              }
            >
              <AlignStartVertical 
                className={`${styles.iconNav} ${location.pathname === "/start-assignment"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{ color: navbarStyle.textColor }}
              >
                Start Assignment
              </span>
            </Link>
          </ul>

          <form className="d-flex">
            {/* Dropdown menu */}
            <div
              className={`dropdown ${styles.dropdown_profile}`}
              style={{ backgroundColor: navbarStyle.activeNavBg }}
            >
             

              <div className={`dropdown-menu ${styles.custom_drop_profile}`}>
                <ul className={`${styles.profile_ul}`}>
                  <div>
                    <Link to="/profile">
                      <li
                        className={`${styles.profile_main_div} ${styles.profile_border_top}`}
                      >
                        <div className={`${styles.profile_dropdown_icon}`}>
                          <FaUser
                            className={`${styles.profile_icon} ${styles.icon_setting}`}
                          />
                        </div>
                        <div className={`${styles.profile_dropdown_info}`}>
                          Profile
                        </div>
                      </li>
                    </Link>
                  </div>

                  <div onClick={handleLogout}>
                    <li
                      className={`${styles.profile_main_div} ${styles.profile_border_top}`}
                    >
                      <div className={`${styles.profile_dropdown_icon}`}>
                        <RiShutDownLine
                          className={`${styles.profile_icon} ${styles.icon_logout}`}
                        />
                      </div>
                      <div className={`${styles.profile_dropdown_info}`}>
                        Logout
                      </div>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Topbar;
