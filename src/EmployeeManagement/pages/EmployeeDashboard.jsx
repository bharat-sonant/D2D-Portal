import React, { useState, useEffect } from "react";
import styles from "./EmployeeDashboard.module.css";
import * as EmployeeAction from "../../services/EmployeeService/EmployeeAction";
import * as DepartmentAction from "../../services/DepartmentService/DepartmentAction";
import * as LucideIcons from "lucide-react";
import {
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Calendar,
  AlertCircle,
  Building2,
  Clock,
  Award,
  Target,
  Activity,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  BarChart3,
  PieChart,
} from "lucide-react";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncompleteEmp, setSelectedIncompleteEmp] = useState(null);

  useEffect(() => {
    EmployeeAction.getEmployeesAction(setEmployees, setLoading);
    DepartmentAction.getDepartmentsAction(setDepartments);
    EmployeeAction.getBranchesAction(setBranches);
  }, []);

  const DynamicLucideIcon = ({
    name,
    size = 24,
    color = "var(--themeColor)",
  }) => {
    // If name is an emoji or missing, fallback to GitBranch
    const isLucideIcon = name && LucideIcons[name];
    const IconComponent = isLucideIcon
      ? LucideIcons[name]
      : LucideIcons.GitBranch;
    return <IconComponent size={size} color={color} />;
  };

  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (emp) => emp.status !== false,
    ).length;
    const exEmployees = employees.filter((emp) => emp.status === false).length;

    const thisMonthJoiners = employees.filter((emp) => {
      const joinDate = new Date(emp.created_at);
      return (
        joinDate.getMonth() === currentMonth &&
        joinDate.getFullYear() === currentYear
      );
    }).length;

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);
    const recentJoiners = employees.filter(
      (emp) => new Date(emp.created_at) > last30Days,
    ).length;

    return [
      {
        title: "Total Employees",
        value: totalEmployees.toString().padStart(2, "0"),
        change: "+0%",
        icon: <Users size={24} />,
      },
      {
        title: "Active Employees",
        value: activeEmployees.toString().padStart(2, "0"),
        change: "+0%",
        icon: <UserCheck size={24} />,
      },
      {
        title: "This Month Joiners",
        value: thisMonthJoiners.toString().padStart(2, "0"),
        change: "+0%",
        icon: <UserPlus size={24} />,
      },
      {
        title: "Ex-Employees",
        value: exEmployees.toString().padStart(2, "0"),
        change: "-0%",
        icon: <UserMinus size={24} />,
      },
      {
        title: "Recent Joiners (30d)",
        value: recentJoiners.toString().padStart(2, "0"),
        change: "+0%",
        icon: <Activity size={24} />,
      },
    ];
  };

  const stats = calculateStats();

  const quickActions = [
    { title: "Add Employee", icon: <UserPlus size={18} />, color: "#667eea" },
    { title: "Bulk Upload", icon: <Download size={18} />, color: "#f093fb" },
    {
      title: "Generate Report",
      icon: <BarChart3 size={18} />,
      color: "#4facfe",
    },
    { title: "Attendance", icon: <Clock size={18} />, color: "#43e97b" },
    { title: "Payroll", icon: <Award size={18} />, color: "#fa709a" },
    { title: "Performance", icon: <Target size={18} />, color: "#feca57" },
  ];

  const getIncompleteProfiles = () => {
    return employees.filter((emp) => {
      const missingFields = [];
      if (!emp.employee_code) missingFields.push("Code");
      if (!emp.phone_number) missingFields.push("Phone");
      if (!emp.email) missingFields.push("Email");
      if (!emp.branch_id) missingFields.push("Branch");
      if (!emp.department_id) missingFields.push("Dept");

      if (missingFields.length > 0) {
        emp.missingDetailsCount = missingFields.length;
        emp.missingFieldsText = missingFields.join(", ");
        return true;
      }
      return false;
    });
  };

  const incompleteProfiles = getIncompleteProfiles();

  return (
    <div className={styles.container}>
      {/* Header */}
      {/* <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Employee Dashboard</h1>
          <p className={styles.subtitle}>Manage your workforce efficiently</p>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.iconBtn}><Search size={20} /></button>
          <button className={styles.iconBtn}><Filter size={20} /></button>
          <button className={`${styles.iconBtn} ${styles.notificationBtn}`}>
            <Bell size={20} />
            <span className={styles.badge}>5</span>
          </button>
          <button className={styles.iconBtn}><Settings size={20} /></button>
        </div>
      </div> */}

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: stat.gradient }}
            >
              {stat.icon}
            </div>
            <div>
              <div className={styles.statLabel}>{stat.title}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div
                className={`${styles.statChange} ${stat.change.startsWith("+") ? styles.positive : styles.negative}`}
              >
                {stat.change} from last month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.mainGrid}>
        {/* Branch Distribution */}
        <div className={`${styles.card} ${styles.cardBranch} ${styles.fadeInDelay1}`}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Branch Distribution</h3>
              <p className={styles.cardSubtitle}>
                {branches.length} total branches
              </p>
            </div>
            <Building2 size={24} color="#667eea" />
          </div>

          <div className={styles.pieWrapper}>
            <div className={styles.pieLegend}>
              {branches.map((branch, idx) => {
                const branchEmployees = employees.filter(
                  (emp) => emp.branch_id === branch.name,
                ).length;

                const totalEmployees = employees.length || 1;
                const percent = branchEmployees / totalEmployees;

                const angle = percent * 360;

                return (
                  <div key={idx} className={styles.legendItem}>
                    <span className={styles.legendName}>{branch.name}</span>

                    <div className={styles.miniPie}>
                      <div className={styles.miniPieProgress} />

                      <div className={styles.miniPieCenter}>
                        {branchEmployees}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Department Graph */}
        <div className={`${styles.card} ${styles.cardDepartment} ${styles.fadeInDelay2}`}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Department Overview</h3>
              <p className={styles.cardSubtitle}>Employee distribution</p>
            </div>
            <PieChart size={24} color="#f093fb" />
          </div>

          <div className={styles.deptGrid}>
            {departments.map((dept, idx) => {
              const deptCount = employees.filter(
                (emp) => emp.department_id === dept.id,
              ).length;
              const maxCount = Math.max(
                ...departments.map(
                  (d) =>
                    employees.filter((e) => e.department_id === d.id).length,
                ),
                1,
              );

              return (
                <div key={idx} className={styles.deptCard}>
                  {/* <div className={styles.deptIcon}>
                    <DynamicLucideIcon name={dept.icon} />
                  </div> */}

                  <div className={styles.deptInfo}>
                    <div className={styles.deptName}>{dept.name}</div>
                    <div className={styles.deptCount}>{deptCount}</div>
                  </div>

                  {/* <div
                    className={styles.deptBar}
                    style={{ background: `var(--themeColor)` }}
                  >
                    <div
                      className={styles.deptBarFill}
                      style={{
                        width: `${(deptCount / maxCount) * 100}%`,
                        background: "var(--themeColor)",
                      }}
                    />
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardMissing} ${styles.fadeInDelay3}`}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Incomplete Profile</h3>
              <p className={styles.cardSubtitle}>
                Total <b> {incompleteProfiles.length}</b> Incomplete Profiles
              </p>
            </div>
            <AlertCircle size={24} color="var(--themeColor)" />
          </div>

          <div className={styles.activityList}>
            {incompleteProfiles.length > 0 ? (
              incompleteProfiles.slice(0, 5).map((emp, idx) => (
                <div
                  key={idx}
                  className={`${styles.activityItem} ${selectedIncompleteEmp === emp.id ? styles.activeActivity : ""}`}
                  onClick={() =>
                    setSelectedIncompleteEmp(
                      selectedIncompleteEmp === emp.id ? null : emp.id,
                    )
                  }
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "12px",
                    }}
                  >
                    <div className={styles.activityAvatar}>
                      {emp.employee_name
                        ? emp.employee_name.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    <div className={styles.activityContent}>
                      <div className={styles.activityName}>
                        {emp.employee_name || "Unknown Name"}
                      </div>
                      <div
                        style={{ fontSize: "12px", color: "var(--textMuted)" }}
                      >
                        {emp.employee_code || "No Code"}
                      </div>
                    </div>

                    <div
                      className={styles.activityTime}
                      style={{
                        color: "#fa709a",
                        fontWeight: "500",
                        marginLeft: "auto",
                      }}
                    >
                      {emp.missingDetailsCount} missing
                    </div>
                  </div>

                  {selectedIncompleteEmp === emp.id && (
                    <div className={styles.missingDetailsBox}>
                      <strong>Missing:</strong> {emp.missingFieldsText}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--textMuted)",
                }}
              >
                All profiles are complete! 🎉
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button className={styles.fabBtn}>
        <Plus size={24} />
      </button>
    </div>
  );
};

export default EmployeeDashboard;
