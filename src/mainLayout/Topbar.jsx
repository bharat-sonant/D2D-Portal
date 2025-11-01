import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../Style/MainLayout/Topbar.module.css";
import { imagesRefPath } from "../common/imagesRef/imagesRefPath";
import { images } from "../assets/css/imagePath";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuGitBranchPlus, LuUsers } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { PiChartLineUpBold } from "react-icons/pi";
import { RiEqualizer2Line } from "react-icons/ri";
import { TbLayoutDashboard } from "react-icons/tb";
import { BsWindowDock } from "react-icons/bs";

import {
  MdApproval,
  MdAssignment,
  MdKeyboardArrowDown,
  MdOutlineHolidayVillage,
  MdOutlinePassword,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { BsListTask } from "react-icons/bs";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoCalendarClearOutline } from "react-icons/io5";
import { PulseLoader } from "react-spinners";
import { usePermissions } from "../context/PermissionContext";
import { MdOutlineReportProblem } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { FaArrowRightArrowLeft, FaCity, FaMoneyBill1Wave } from "react-icons/fa6";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { GiPayMoney } from "react-icons/gi";
import LoginAsModal from "../components/LoginAs/LoginAsModal";
import { GrMoney } from "react-icons/gr";
import { IoTicketSharp } from "react-icons/io5";
const Topbar = ({ hideNavLinks, customLogo, customTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstchar, setFirsthar] = useState("");
  const [secondchar, setSecondhar] = useState("");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showLoginAsModal, setShowLoginAsModal] = useState(false);
  const [LoginLoading, setLoginLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [employeeArray, setEmployeeArray] = useState([]);
  const companyName = localStorage.getItem("company");
  const employeeCode = localStorage.getItem("empCode");
  const storedImage = localStorage.getItem("profileImage");
  const storedName = localStorage.getItem("name");
  const isOwner = localStorage.getItem("isOwner");
  const isLoginAsUser = localStorage.getItem("loginAsUser") === "true";
  const isOwnerUser = isOwner === "Yes";
  const shouldShowRed = isLoginAsUser && !isOwnerUser;
  const [showReviewer, setShowReviewer] = useState(false);
  const logoToShow = customLogo || images.defaultLogo;
  const titleToShow = customTitle || "D2D PORTAL";

  //Navnar Customization State
  const [showCustomization, setShowCustomization] = useState(false);

  const { loading, setLoading, isHolidayPermissionGranted, permissionGranted } =
    usePermissions();
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopModeOnMobile, setIsDesktopModeOnMobile] = useState(false);



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

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

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

  useEffect(() => {
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const checkDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|android|mobile/i.test(userAgent);

    // Checking touch support
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Checking device pixel ratio (mobile devices have higher DPR)
    const isLikelyMobile = hasTouchScreen && window.devicePixelRatio > 1.5;

    // Checking screen width (if mobile has high width, it’s desktop mode)
    const isDesktopMode = isLikelyMobile && window.innerWidth > 768;
    //console.log(isMobileDevice)
    setIsMobile(isMobileDevice);
    setIsDesktopModeOnMobile(isDesktopMode);
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

  const navbarThemes = [
    {
      name: "Green",
      backgroundColor: "#d8ffd8",
      textColor: "#004d00",
      iconFilter: "icon-filter-green",
      activeNavBg: "#004d0014",
    },
    {
      name: "Sky Blue",
      backgroundColor: "#e3f2fd",
      textColor: "#00334d",
      iconFilter: "icon-filter-blue",
      activeNavBg: "#00334d14",
    },
    {
      name: "Light",
      backgroundColor: "#f4f4f4",
      textColor: "#333333",
      iconFilter: "icon-filter-black",
      activeNavBg: "#33333314",
    },

    {
      name: "Orange",
      backgroundColor: "#ffddb3",
      textColor: "#663c00",
      iconFilter: "icon-filter-red",
      activeNavBg: "#663c0014",
    },
    {
      name: "lightblue",
      backgroundColor: "#cdfbff",
      textColor: "#000000",
      iconFilter: "icon-filter-lightblue",
      activeNavBg: "#4a000014", // transparent dark red
    },
    {
      name: "Gray",
      backgroundColor: "#d9d9d9",
      textColor: "#1a1a1a",
      iconFilter: "icon-filter-black",
      activeNavBg: "#1a1a1a14",
    },
  ];

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
          <div className={`${styles.headerApps}`}>
            <div className="dropdown">
             
              <div className={`dropdown-menu ${styles.appOverlay}`}>
                <div className={`${styles.appModal}`}>
                  <div className={`${styles.appContent}`}>
                    <div className={`${styles.appHeader}`}>Quick Links</div>
                    <ul className={`${styles.appBody}`}>
                      <li className={`${styles.appLi}`}>
                        <Link
                          to="/dashboard"
                          title="Office Management"
                          className={`dropdown-item ${styles.appLink} ${location.pathname === "/dashboard"
                            ? styles.activeAppLink
                            : ""
                            }`}
                        >
                          <img
                            src={images.logoOfficeManagement}
                            className={styles.appLogo}
                            title="Logo"
                            alt="Logo"
                          />
                          <span className={styles.appText}>
                            Office Management
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className={styles.navbarNav}>
            {/* <Link
              aria-current="page"
              to="/dashboard"
              title="Dashboard"
              className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                } ${location.pathname === "/dashboard" ? styles.activeNav : ""}`}
              style={
                location.pathname === "/dashboard"
                  ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                  : {}
              }
            >
              <TbLayoutDashboard
                className={`${styles.iconNav} ${location.pathname === "/dashboard"
                  ? navbarStyle.iconFilter
                  : "icon-filter-black"
                  }`}
              />
              <span
                className={styles.iconText}
                style={{ color: navbarStyle.textColor }}
              >
                Dashboard
              </span>
            </Link> */}

            

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

        

           
        


         

            {isOwner === "No" && (
              <>
                {showReviewer && (
                  <Link
                    aria-current="page"
                    to="/expense-reviewer"
                    title="Expense Reviewer"
                    className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""} ${location.pathname === "/expense-reviewer" ? styles.activeNav : ""}`}
                    style={
                      location.pathname === "/expense-reviewer"
                        ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                        : {}
                    }
                  >
                    <AiOutlineCheckSquare
                      className={`${styles.iconNav} ${location.pathname === "/expense-reviewer" ? navbarStyle.iconFilter : "icon-filter-black"}`}
                    />
                    <span
                      className={styles.iconText}
                      style={{ color: navbarStyle.textColor }}
                    >
                      Expense Reviewer
                    </span>
                  </Link>
                )}

                {permissionGranted.CanAccessExpenseApprovepage && (
                  <Link
                    aria-current="page"
                    to="/expense-approve"
                    title="Expense Approve"
                    className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""} ${location.pathname === "/expense-approve" ? styles.activeNav : ""}`}
                    style={
                      location.pathname === "/expense-approve"
                        ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                        : {}
                    }
                  >
                    <AiOutlineCheckSquare
                      className={`${styles.iconNav} ${location.pathname === "/expense-approve" ? navbarStyle.iconFilter : "icon-filter-black"}`}
                    />
                    <span
                      className={styles.iconText}
                      style={{ color: navbarStyle.textColor }}
                    >
                      Expense Approve
                    </span>
                  </Link>
                )}

                {permissionGranted.CanAccessExpenseReimbursepage && (
                  <Link
                    aria-current="page"
                    to="/expense-reimburse"
                    title="Expense Reimburse"
                    className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""} ${location.pathname === "/expense-reimburse" ? styles.activeNav : ""}`}
                    style={
                      location.pathname === "/expense-reimburse"
                        ? { backgroundColor: navbarStyle?.activeNavBg || "#3fb2f114" }
                        : {}
                    }
                  >
                    <GiPayMoney
                      className={`${styles.iconNav} ${location.pathname === "/expense-reimburse" ? navbarStyle.iconFilter : "icon-filter-black"}`}
                    />
                    <span
                      className={styles.iconText}
                      style={{ color: navbarStyle.textColor }}
                    >
                      Expense Reimburse
                    </span>
                  </Link>
                )}

                {(permissionGranted.CanAccessDuplicateExpenseReportPage) && (
                  <Link
                    aria-current="page"
                    to="/duplicate-expenses"
                    title="Expense Category"
                    className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                      } ${location.pathname === "/duplicate-expenses" ? styles.activeNav : ""}`}
                    style={
                      location.pathname === "/duplicate-expenses"
                        ? {
                          backgroundColor:
                            navbarStyle?.activeNavBg || "#3fb2f114",
                        }
                        : {}
                    }
                  >
                    <MdOutlineReportProblem
                      className={`${styles.iconNav} ${location.pathname === "/duplicate-expenses"
                        ? navbarStyle.iconFilter
                        : "icon-filter-black"
                        }`}
                    />
                    <span
                      className={styles.iconText}
                      style={{ color: navbarStyle.textColor }}
                    >
                      Duplicate Expense
                    </span>
                  </Link>
                )}
              </>
            )}

            {(permissionGranted.CanAccessExpenseCategory) && (
              <Link
                aria-current="page"
                to="/expense-category"
                title="Expense Category"
                className={`nav-link ${styles.navLink} ${hideNavLinks ? styles.hide : ""
                  } ${location.pathname === "/expense-category" ? styles.activeNav : ""}`}
                style={
                  location.pathname === "/expense-category"
                    ? {
                      backgroundColor:
                        navbarStyle?.activeNavBg || "#3fb2f114",
                    }
                    : {}
                }
              >
                <GiExpense
                  className={`${styles.iconNav} ${location.pathname === "/expense-category"
                    ? navbarStyle.iconFilter
                    : "icon-filter-black"
                    }`}
                />

                <span
                  className={styles.iconText}
                  style={{ color: navbarStyle.textColor }}
                >
                  Expense category
                </span>
              </Link>
            )}


            

           
          
          </ul>

          <form className="d-flex">
            {/* Dropdown menu */}
            <div
              className={`dropdown ${styles.dropdown_profile}`}
              style={{ backgroundColor: navbarStyle.activeNavBg }}
            >
              <button
                className={`${styles.btn_custom_dropdown}`}
                id="dropdown-basic"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className={`${styles.user_name_group}`}>
                  <div
                    className={`${styles.user_img}`}
                    style={{ background: shouldShowRed ? "red" : "" }}
                  >
                    {loading ? (
                      <PulseLoader color="blue" size={7} />
                    ) : profileImage &&
                      profileImage.trim().length > 0 &&
                      profileImage !== "undefined" &&
                      profileImage !== "null" ? (
                      <img
                        src={profileImage}
                        alt="Avatar"
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <span className="avatar">
                        {firstchar}
                        {secondchar}
                      </span>
                    )}
                  </div>
                  <div
                    className={`${styles.user_name}`}
                    style={{
                      // color: shouldShowRed && "red",
                      color: navbarStyle.textColor,
                      fontWeight: shouldShowRed && "bold",
                    }}
                  >
                    {storedName}
                  </div>
                  <div className={`${styles.dropdownIcon}`}>
                    <MdKeyboardArrowDown
                      className={`${styles.drop_down}`}
                      style={{
                        color: shouldShowRed ? "red" : "",
                        fontWeight: shouldShowRed && "bold",
                      }}
                    />
                  </div>
                </div>
              </button>

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
                  {(isOwner === "Yes" ||
                    localStorage.getItem("loginAsUser") === "true") && (
                      <div onClick={() => setShowLoginAsModal(!showLoginAsModal)}>
                        <li
                          className={`${styles.profile_main_div} ${styles.profile_border_top}`}
                        >
                          <div className={`${styles.profile_dropdown_icon}`}>
                            <FaArrowRightArrowLeft
                              className={`${styles.profile_icon} ${styles.icon_setting}`}
                            />
                          </div>
                          <div className={`${styles.profile_dropdown_info}`}>
                            Login As
                          </div>
                        </li>
                      </div>
                    )}

                 
                 
                
                 
                

               
               
               
                 
              
                  
                  <div>
                    {isOwner === "Yes" && (
                      <>
                        <li
                          className={`${styles.profile_main_div} ${styles.profile_border_top}`}
                        >
                          <div className={`${styles.dropdownRow}`}>
                            <div className={`${styles.dropdownTop}`}>
                              <div
                                className={`${styles.profile_dropdown_icon}`}
                              >
                                <RiEqualizer2Line
                                  className={`${styles.profile_icon} ${styles.icon_setting}`}
                                />
                              </div>
                              <div
                                className={`${styles.profile_dropdown_info}`}
                              >
                                Navbar Customization
                              </div>
                            </div>
                          </div>
                        </li>

                        <div className={`${styles.dropdownBottom}`}>
                          <div className={`${styles.navbarCustmizationBG}`}>
                            <div className={styles.navbarThemesContainer}>
                              {navbarThemes.map((theme, index) => (
                                <div
                                  key={index}
                                  className={`${styles.themeCard} ${navbarStyle.backgroundColor ===
                                    theme.backgroundColor &&
                                    navbarStyle.textColor === theme.textColor &&
                                    navbarStyle.iconFilter === theme.iconFilter
                                    ? styles.themeCardSelected
                                    : ""
                                    }`}
                                  style={{
                                    backgroundColor: theme.backgroundColor,
                                    color: theme.textColor,
                                  }}
                                  onClick={() => {
                                    setNavbarStyle(theme);
                                    localStorage.setItem(
                                      "navbarStyle",
                                      JSON.stringify(theme)
                                    );
                                  }}
                                >
                                  {/* {theme.name} */}
                                </div>
                              ))}
                            </div>
                            <div className={styles.navFooterRow}>
                              {/* <button
                               type="button"
                                onClick={() => {
                                  localStorage.setItem(
                                    "navbarStyle",
                                    JSON.stringify(navbarStyle)
                                  );
                                  setShowCustomization(false);
                                }}
                                className={styles.btnNavSave}
                              >
                                Apply
                              </button> */}

                              <button
                                type="button"
                                className={styles.btnNavReset}
                                onClick={() => {
                                  localStorage.removeItem("navbarStyle");
                                  setNavbarStyle({
                                    backgroundColor: "#ffffff",
                                    textColor: "#000000",
                                    iconFilter: "icon-filter-black",
                                  });
                                }}
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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

      {isNavbarOpen && (
        <div className={styles.navbarOverlay} onClick={toggleNavbar}></div>
      )}
      {showLoginAsModal && (
        <LoginAsModal
          setShowLoginAsModal={setShowLoginAsModal}
          employeeArray={employeeArray}
          filteredUsers={filteredUsers}
          setFilteredUsers={setFilteredUsers}
          loading={LoginLoading}
        />
      )}

      
    </>
  );
};

export default Topbar;
