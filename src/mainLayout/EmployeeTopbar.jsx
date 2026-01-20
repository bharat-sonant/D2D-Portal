import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Building2,
    GitBranch,
    LockKeyhole,
    Frown,
    Menu
} from "lucide-react";
import styles from "../Style/MainLayout/Topbar.module.css";
import { images } from "../assets/css/imagePath";
import { useCity } from "../context/CityContext";
import ChangePassword from "../components/ChangePassword/changePassword";
import LogoImage from "../components/Common/Image/LogoImage";
import QuickAppSelection from "./QuickAppSelection";

const EmployeeTopbar = ({ setShowDefaultCity }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [firstchar, setFirsthar] = useState("");
    const [secondchar, setSecondhar] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const storedName = localStorage.getItem("name");
    const { cityLogo, city } = useCity();
    const Logo = cityLogo || images?.wevoisLogo;
    const titleToShow = city || "D2D PORTAL";

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showQuickAppSelect, setShowQuickAppSelect] = useState(false);

    const menuItems = [
        {
            id: "Dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            color: "#354db9",
            path: "/employee/dashboard",
        },
        {
            id: "Employees",
            label: "Employees",
            icon: Users,
            color: "#b84dc5",
            path: "/employee/employees",
        },
        {
            id: "Branch",
            label: "Branch",
            icon: Building2,
            color: "#3481c6",
            path: "/employee/branches",
        },
        {
            id: "Department",
            label: "Department",
            icon: GitBranch,
            color: "#17a748",
            path: "/employee/departments",
        }
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
        localStorage.clear();
        navigate("/");
    };

    return (
        <>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.companyLogo}>
                        <LogoImage image={Logo} />
                        <div className={styles.logoText}>
                            {titleToShow}
                        </div>
                    </div>
                </div>

                <div className={`${styles.desktopMenu}`}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
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
                </div>

                <div className={styles.headerRight}>
                    {city && (
                        <div
                            className={`${styles.userBadge}`}
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                        >
                            <button className={`btn ${styles.userDropdownBtn} ${isProfileOpen ? styles.rotateIcon : ""}`}>
                                <span className={styles.userBG}>
                                    {firstchar}{secondchar}
                                </span>
                                <span className={styles.userName}>{storedName}</span>
                            </button>

                            {isProfileOpen && (
                                <ul className={`${styles.dropdownCustom}`}>
                                    <li onClick={() => setShowQuickAppSelect(true)} className={styles.dropdownLI}>
                                        <span className={styles.dropdownItem}><Menu size={16} /> Quick Apps</span>
                                    </li>
                                    <li onClick={() => setShowChangePassword(true)} className={styles.dropdownLI}>
                                        <span className={styles.dropdownItem}><LockKeyhole size={16} /> Change Password</span>
                                    </li>
                                    <li onClick={handleLogout} className={styles.dropdownLI}>
                                        <span className={styles.dropdownItem}><Frown size={16} /> Log Out</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ChangePassword
                showChangePassword={showChangePassword}
                setShowChangePassword={setShowChangePassword}
            />
            <QuickAppSelection
                showQuickAppSelect={showQuickAppSelect}
                onClose={() => setShowQuickAppSelect(false)}
            />
        </>
    );
};

export default EmployeeTopbar;
