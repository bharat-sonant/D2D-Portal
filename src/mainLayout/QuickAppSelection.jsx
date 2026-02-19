// import React from "react";
// import { useNavigate } from "react-router-dom";
// import style from "../../src/assets/css/popup.module.css";
// import {
//   Eye,
//   Trash2,
//   CalendarCheck,
//   MapPin,
//   ClipboardList,
//   Building,
//   Info,
//   UserCheck,
//   LayoutDashboard,
//   X,
//   LockKeyhole,
//   LogOut,
//   User,
//   Fuel,
// } from "lucide-react";

// const appsList = [
//   { id: 1, name: "D2D Monitoring", icon: Eye, color: "#667eea" },
//   { id: 2, name: "Dustbin Management", icon: Trash2, color: "#f56565" },
//   {
//     id: 3,
//     name: "Attendance Management",
//     icon: CalendarCheck,
//     color: "#48bb78",
//   },
//   {
//     id: 4,
//     name: "Field Tracking",
//     icon: MapPin,
//     color: "#ecc94b",
//     path: "/field-executive/dashboard",
//   },
//   { id: 5, name: "Survey Management", icon: ClipboardList, color: "#38b2ac" },
//   { id: 6, name: "UCC Management", icon: Building, color: "#9f7aea" },
//   { id: 7, name: "IEC Management", icon: Info, color: "#ed64a6" },
//   {
//     id: 8,
//     name: "Fuel Management",
//     icon: Fuel,
//     color: "#f6ad55",
//     path: "/fuel/add_fuel_entries",
//   },
//   {
//     id: 9,
//     name: "Administrators",
//     icon: LayoutDashboard,
//     color: "#4a5568",
//     path: "/Dashboard",
//   },
// ];

// const managementOptions = [
//   {
//     id: "employee",
//     name: "Employee Management",
//     icon: UserCheck,
//     path: "/employee/dashboard",
//     color: "#2d3748",
//   },
// ];

// const QuickAppSelection = (props) => {
//   const navigate = useNavigate();
//   const {
//     isDropdown,
//     showQuickAppSelect,
//     onClose,
//     onChangePassword,
//     onLogout,
//   } = props;

//   if (!showQuickAppSelect) return null;

//   const handleAppClick = (path) => {
//     if (path) {
//       navigate(path);
//       onClose();
//     }
//   };

//   // Dropdown specific styles
//   const dropdownOverlayStyle = isDropdown
//     ? {
//         background: "transparent",
//         justifyContent: "flex-end",
//         alignItems: "flex-start",
//         padding: "70px 20px 0 0",
//       }
//     : {};

//   // const dropdownModalStyle = isDropdown ? {
//   //   maxWidth: "750px",
//   //   width: "95%",
//   //   margin: 0,
//   //   boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
//   //   border: "1px solid var(--borderColor)",
//   //   animation: "slideDown 0.3s ease-out"
//   // } : { maxWidth: "800px" };

//   return (
//     <div
//       className={` ${style.overlay2}`}
//       style={dropdownOverlayStyle}
//       onClick={onClose}
//     >
//       <div
//         className={`${style.modal} ${style.modalApp}`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header */}
//         {/* <div className={style.modalHeader}>
//           <div className={style.headerLeft}>
//             <div className={style.iconWrapper}>
//               <LayoutDashboard size={24} />
//             </div>
//             <div className={style.headerTextRight}>
//               <h5 className={style.modalTitle}>Quick App Selection</h5>
//               <p className={style.modalSubtitle}>Switch between monitoring and management tools</p>
//             </div>
//           </div>
//           <button className={style.closeBtn} onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div> */}

//         {/* Modal Body */}
//         <div className={style.modalBody} style={{ padding: "20px" }}>
//           <div style={{ marginBottom: "20px" }}>
//             <h6
//               style={{
//                 fontSize: "12px",
//                 textTransform: "uppercase",
//                 letterSpacing: "1px",
//                 color: "var(--textMuted)",
//                 marginBottom: "15px",
//                 fontFamily: "var(--fontGraphikMedium)",
//               }}
//             >
//               Monitoring & Operational Apps
//             </h6>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: isDropdown
//                   ? "repeat(3, 1fr)"
//                   : "repeat(auto-fill, minmax(130px, 1fr))",
//                 gap: "12px",
//               }}
//             >
//               {appsList.map((app) => (
//                 <div
//                   key={app.id}
//                   className={style.userTypeCard}
//                   style={{
//                     flexDirection: isDropdown ? "column" : "column",
//                     padding: isDropdown ? "10px" : "16px",
//                     textAlign: isDropdown ? "left" : "center",
//                     gap: "10px",
//                   }}
//                   onClick={() => handleAppClick(app.path)}
//                 >
//                   <div
//                     className={style.userTypeIcon}
//                     style={{
//                       background: `${app.color}15`,
//                       color: app.color,
//                       width: "32px",
//                       height: "32px",
//                     }}
//                   >
//                     <app.icon size={18} />
//                   </div>
//                   <span
//                     className={style.userTypeLabel}
//                     style={{
//                       fontSize: "11px",
//                       textAlign: isDropdown ? "left" : "center",
//                     }}
//                   >
//                     {app.name}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div
//             style={{
//               borderTop: "1px solid var(--borderColor)",
//               paddingTop: "20px",
//             }}
//           >
//             <h6
//               style={{
//                 fontSize: "12px",
//                 textTransform: "uppercase",
//                 letterSpacing: "1px",
//                 color: "var(--textMuted)",
//                 marginBottom: "15px",
//                 fontFamily: "var(--fontGraphikMedium)",
//               }}
//             >
//               Management & Administration
//             </h6>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: isDropdown ? "1fr" : "repeat(2, 1fr)",
//                 gap: "12px",
//               }}
//             >
//               {managementOptions.map((opt) => (
//                 <div
//                   key={opt.id}
//                   className={style.userTypeCard}
//                   onClick={() => handleAppClick(opt.path)}
//                   style={{ gap: "15px", padding: "12px" }}
//                 >
//                   <div
//                     className={style.userTypeIcon}
//                     style={{ background: `${opt.color}15`, color: opt.color }}
//                   >
//                     <opt.icon size={20} />
//                   </div>
//                   <span className={style.userTypeLabel}>{opt.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Account Actions Section */}
//           <div
//             style={{
//               borderTop: "1px solid var(--borderColor)",
//               marginTop: "20px",
//               paddingTop: "20px",
//             }}
//           >
//             <h6
//               style={{
//                 fontSize: "12px",
//                 textTransform: "uppercase",
//                 letterSpacing: "1px",
//                 color: "var(--textMuted)",
//                 marginBottom: "15px",
//                 fontFamily: "var(--fontGraphikMedium)",
//               }}
//             >
//               Account & Security
//             </h6>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "12px",
//               }}
//             >
//               <div
//                 className={style.userTypeCard}
//                 onClick={() => {
//                   onChangePassword();
//                   onClose();
//                 }}
//                 style={{ gap: "10px", padding: "10px" }}
//               >
//                 <div
//                   className={style.userTypeIcon}
//                   style={{
//                     background: "rgba(102, 126, 234, 0.1)",
//                     color: "#667eea",
//                     width: "32px",
//                     height: "32px",
//                   }}
//                 >
//                   <LockKeyhole size={16} />
//                 </div>
//                 <span
//                   className={style.userTypeLabel}
//                   style={{ fontSize: "11px" }}
//                 >
//                   Change Password
//                 </span>
//               </div>
//               <div
//                 className={style.userTypeCard}
//                 onClick={() => {
//                   onLogout();
//                   onClose();
//                 }}
//                 style={{ gap: "10px", padding: "10px" }}
//               >
//                 <div
//                   className={style.userTypeIcon}
//                   style={{
//                     background: "rgba(245, 101, 101, 0.1)",
//                     color: "#f56565",
//                     width: "32px",
//                     height: "32px",
//                   }}
//                 >
//                   <LogOut size={16} />
//                 </div>
//                 <span
//                   className={style.userTypeLabel}
//                   style={{ fontSize: "11px" }}
//                 >
//                   Logout
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Modal Footer */}
//         {/* <div className={style.modalFooter}>
//           <button
//             className={style.cancelBtn}
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default QuickAppSelection;

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "./QuickAppSelection.module.css";
import {
  Eye,
  Trash2,
  CalendarCheck,
  MapPin,
  ClipboardList,
  Building,
  Info,
  UserCheck,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Fuel,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePermissions } from "../context/PermissionContext";

const appsList = [
  { id: 1, name: "D2D Monitoring", icon: Eye, color: "#667eea" },
  // { id: 2, name: "Dustbin Management", icon: Trash2, color: "#f56565" },
  // {
  //   id: 3,
  //   name: "Attendance Management",
  //   icon: CalendarCheck,
  //   color: "#48bb78",
  // },
  // {
  //   id: 4,
  //   name: "Field Tracking",
  //   icon: MapPin,
  //   color: "#ecc94b",
  //   path: "/field-executive/dashboard",
  //   permissionKey: "CanAccessFieldTrackingSection",
  // },
  // { id: 5, name: "Survey Management", icon: ClipboardList, color: "#38b2ac" },
  // { id: 6, name: "UCC Management", icon: Building, color: "#9f7aea" },
  // { id: 7, name: "IEC Management", icon: Info, color: "#ed64a6" },
  {
    id: 8,
    name: "Fuel Management",
    icon: Fuel,
    color: "#f6ad55",
    path: "/fuel/add_fuel_entries",
  },
  {
    id: 9,
    name: "Administrators",
    icon: LayoutDashboard,
    color: "#4a5568",
    path: "/Dashboard",
  },
];

const managementOptions = [
  {
    id: "employee",
    name: "Employee Management",
    icon: UserCheck,
    path: "/employee/dashboard",
    color: "#2d3748",
  },
];

const QuickAppSelection = ({
  isDropdown,
  showQuickAppSelect,
  onClose,
  onChangePassword,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePath, setActivePath] = useState("");
  const { permissionGranted } = usePermissions();
  // ✅ Set active app based on current route
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const visibleApps = useMemo(
    () =>
      appsList.filter(
        (app) => !app.permissionKey || permissionGranted?.[app.permissionKey],
      ),
    [appsList, permissionGranted],
  );

  const handleAppClick = (path) => {
    if (path) {
      setActivePath(path);
      navigate(path);
      onClose();
    }
  };

  if (!showQuickAppSelect) return null;

  return (
    <div
      className={`${styles.overlay2} ${isDropdown ? styles.dropdownOverlay : ""}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${styles.modalApp}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Orbs */}
        <div className={styles.floatingOrbs}>
          <span className={`${styles.orb} ${styles.orbOne}`} />
          <span className={`${styles.orb} ${styles.orbTwo}`} />
          <span className={`${styles.orb} ${styles.orbThree}`} />
        </div>
        <div className={`${styles.modalBodyApp} ${styles.modalBody}`}>
          {/* Monitoring Apps */}
          <div className={styles.sectionHeader}>
            <h6 className={styles.sectionTitle}>
              Monitoring & Operational Apps
            </h6>
            <span className={styles.sectionNumber}> {visibleApps.length}</span>
          </div>
          <div
            className={`${styles.appsGrid} ${isDropdown ? styles.appsGridDropdown : ""}`}
          >
            {visibleApps.map((app) => (
              <div
                key={app.id}
                className={`${styles.userTypeCard} ${
                  activePath === app.path ? styles.activeCard : ""
                }`}
                onClick={() => handleAppClick(app.path)}
              >
                <div
                  className={styles.userTypeIcon}
                  style={{ background: `${app.color}15`, color: app.color }}
                >
                  <app.icon size={20} />
                </div>
                <span className={styles.userTypeLabel2}>{app.name}</span>
              </div>
            ))}
          </div>

          {/* Management */}
          <div className={styles.sectionDivider}>
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>
                Management & Administration
              </h6>
              <span className={styles.sectionNumber}>
                {managementOptions.length}
              </span>
            </div>
            <div
              className={`${styles.managementGrid} ${isDropdown ? styles.singleColumn : ""}`}
            >
              {managementOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`${styles.userTypeCard} ${
                    activePath === opt.path ? styles.activeCard : ""
                  }`}
                  onClick={() => handleAppClick(opt.path)}
                >
                  <div
                    className={styles.userTypeIcon}
                    style={{ background: `${opt.color}15`, color: opt.color }}
                  >
                    <opt.icon size={20} />
                  </div>
                  <span className={styles.userTypeLabel2}>{opt.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className={styles.sectionDivider}>
            <div className={styles.sectionHeader}>
              <h6 className={styles.sectionTitle}>Account & Security</h6>
            </div>
            <div className={styles.accountGrid}>
              <div
                className={styles.userTypeCard}
                onClick={() => {
                  onChangePassword();
                  onClose();
                }}
              >
                <div className={`${styles.userTypeIcon} ${styles.iconBlue}`}>
                  <LockKeyhole size={16} />
                </div>
                <span
                  className={`${styles.userTypeIcon2} ${styles.userTypeLabel2}`}
                >
                  Change Password
                  <ChevronRight size={14} />
                </span>
              </div>

              <div
                className={styles.userTypeCard}
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <div className={`${styles.userTypeIcon} ${styles.iconRed}`}>
                  <LogOut size={16} />
                </div>
                <span
                  className={`${styles.userTypeIcon2} ${styles.userTypeLabel2}`}
                >
                  Logout <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAppSelection;
