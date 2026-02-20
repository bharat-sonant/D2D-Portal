import { useEffect, useState } from "react";
import { Building2, GitBranch, LayoutDashboard, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../components/Common/Image/LogoImage";
import { images } from "../../assets/css/imagePath";
import styles from "../../Style/MainLayout/Topbar.module.css";
import ChangePassword from "../../components/ChangePassword/changePassword";
import QuickAppSelection from "../QuickAppSelection";
import { useCity } from "../../context/CityContext";

const menuItems = [
  // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  // { id: "employees", label: "Employees", icon: Users },
  // { id: "branch", label: "Branch", icon: Building2 },
  // { id: "department", label: "Department", icon: GitBranch },
];

const D2DMonitoringStaticTopbar = () => {
  const navigate = useNavigate();
  const { setCityContext } = useCity();
  const [firstchar, setFirsthar] = useState("");
  const [secondchar, setSecondhar] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showQuickAppSelect, setShowQuickAppSelect] = useState(false);
  const storedName = localStorage.getItem("name");

  useEffect(() => {
    if (storedName) {
      const nameParts = storedName.split(" ");
      const nameFirstLetter = nameParts[0].charAt(0).toUpperCase();
      if (nameParts.length > 1) {
        const nameSecondLetter = nameParts[1].charAt(0).toUpperCase();
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
  };

  return (
    <>
      <div className={styles.header} style={{ zIndex: 1100 }}>
        <div className={styles.headerLeft}>
          <div className={styles.companyLogo}>
            <LogoImage image={images?.wevoisLogo} />
            <div className={styles.logoText} style={{ cursor: "default" }}>
              D2D Monitoring
            </div>
          </div>
        </div>

        <div className={styles.desktopMenu}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={styles.menuItem}
                style={{
                  animationDelay: `${index * 0.08}s`,
                  cursor: "default",
                }}
              >
                <div className={styles.menuIcon}>
                  <Icon className={styles.navIcon} size={20} />
                </div>
                <span className={styles.menuLabel}>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.headerRight}>
          <div
            className={styles.userBadge}
            onClick={() => setShowQuickAppSelect((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <button className={`btn ${styles.userDropdownBtn}`}>
              <span className={styles.userBG}>
                {firstchar}
                {secondchar}
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

export default D2DMonitoringStaticTopbar;
