import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../../src/assets/css/popup.module.css";
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
  X
} from "lucide-react";

const appsList = [
  { id: 1, name: "D2D Monitoring", icon: Eye, color: "#667eea" },
  { id: 2, name: "Dustbin Management", icon: Trash2, color: "#f56565" },
  { id: 3, name: "Attendance Management", icon: CalendarCheck, color: "#48bb78" },
  { id: 4, name: "Field Tracking", icon: MapPin, color: "#ecc94b" },
  { id: 5, name: "Survey Management", icon: ClipboardList, color: "#38b2ac" },
  { id: 6, name: "UCC Management", icon: Building, color: "#9f7aea" },
  { id: 7, name: "IEC Management", icon: Info, color: "#ed64a6" },
];

const managementOptions = [
  { id: "admin", name: "Administrators", icon: LayoutDashboard, path: "/Dashboard", color: "#4a5568" },
  { id: "employee", name: "Employee Management", icon: UserCheck, path: "/employee/dashboard", color: "#2d3748" },
];

const QuickAppSelection = (props) => {
  const navigate = useNavigate();

  if (!props.showQuickAppSelect) return null;

  const handleAppClick = (path) => {
    if (path) {
      navigate(path);
      props.onClose();
    }
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal} style={{ maxWidth: "800px" }}>

        {/* Modal Header */}
        <div className={style.modalHeader}>
          <div className={style.headerLeft}>
            <div className={style.iconWrapper}>
              <LayoutDashboard size={24} />
            </div>
            <div className={style.headerTextRight}>
              <h5 className={style.modalTitle}>Quick App Selection</h5>
              <p className={style.modalSubtitle}>Switch between monitoring and management tools</p>
            </div>
          </div>
          <button className={style.closeBtn} onClick={props.onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={style.modalBody} style={{ padding: "20px" }}>

          <div style={{ marginBottom: "20px" }}>
            <h6 style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--textMuted)",
              marginBottom: "15px",
              fontFamily: "var(--fontGraphikMedium)"
            }}>
              Monitoring & Operational Apps
            </h6>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "12px"
            }}>
              {appsList.map((app) => (
                <div
                  key={app.id}
                  className={style.userTypeCard}
                  style={{
                    flexDirection: "column",
                    padding: "16px",
                    textAlign: "center",
                    gap: "10px"
                  }}
                  onClick={() => handleAppClick()} // Apps currently just visual for now as per "option show karne hai"
                >
                  <div className={style.userTypeIcon} style={{ background: `${app.color}15`, color: app.color }}>
                    <app.icon size={24} />
                  </div>
                  <span className={style.userTypeLabel} style={{ fontSize: "12px", textAlign: "center" }}>
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--borderColor)", paddingTop: "20px" }}>
            <h6 style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--textMuted)",
              marginBottom: "15px",
              fontFamily: "var(--fontGraphikMedium)"
            }}>
              Management & Administration
            </h6>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px"
            }}>
              {managementOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={style.userTypeCard}
                  onClick={() => handleAppClick(opt.path)}
                  style={{ gap: "15px" }}
                >
                  <div className={style.userTypeIcon} style={{ background: `${opt.color}15`, color: opt.color }}>
                    <opt.icon size={22} />
                  </div>
                  <span className={style.userTypeLabel}>
                    {opt.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className={style.modalFooter}>
          <button
            className={style.cancelBtn}
            onClick={props.onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuickAppSelection;
