// import React from "react";
// import styles from "../../pages/Reports/Reports.module.css";

// const EmployeeDashboard = () => {
//   const stats = [
//     { label: "Total Employees", value: "124", color: "#354db9" },
//     { label: "Total Branches", value: "12", color: "#b84dc5" },
//     { label: "Total Departments", value: "8", color: "#3481c6" },
//   ];

//   return (
//     <div className={styles.reportsContainer}>
//       <div className={styles.background}>
//         <div className={`${styles.gradientOrb} ${styles.orb1}`} />
//         <div className={`${styles.gradientOrb} ${styles.orb2}`} />
//         <div className={`${styles.gradientOrb} ${styles.orb3}`} />
//         <div className={styles.gridOverlay} />
//       </div>

//       <div style={{ position: "relative", zIndex: 1, padding: "30px" }}>
//         <h2
//           style={{ fontFamily: "var(--fontGraphikBold)", marginBottom: "25px" }}
//         >
//           Employee Dashboard
//         </h2>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               style={{
//                 background: "var(--white)",
//                 padding: "25px",
//                 borderRadius: "12px",
//                 boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
//                 borderLeft: `5px solid ${stat.color}`,
//               }}
//             >
//               <p
//                 style={{
//                   color: "var(--textMuted)",
//                   fontSize: "14px",
//                   marginBottom: "10px",
//                 }}
//               >
//                 {stat.label}
//               </p>
//               <h3 style={{ fontSize: "28px", color: "var(--black)" }}>
//                 {stat.value}
//               </h3>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDashboard;

import React, { useState } from "react";
import styles from "./EmployeeDashboard.module.css";
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

  const branches = [
    { name: "Jaipur", employees: 156, color: "#667eea" },
    { name: "Sikar", employees: 134, color: "#f093fb" },
    { name: "Reengus", employees: 198, color: "#4facfe" },
    { name: "Jodhpur", employees: 89, color: "#43e97b" },
    { name: "Jaisalmer", employees: 112, color: "#fa709a" },
  ];

  const departments = [
    { name: "Engineering", count: 245, color: "#667eea", icon: "💻" },
    { name: "Sales", count: 156, color: "#f093fb", icon: "💼" },
    { name: "Marketing", count: 89, color: "#4facfe", icon: "📢" },
    { name: "HR", count: 45, color: "#43e97b", icon: "👥" },
    { name: "Finance", count: 67, color: "#fa709a", icon: "💰" },
    { name: "Operations", count: 87, color: "#feca57", icon: "⚙️" },
  ];

  const stats = [
    {
      title: "Total Employees",
      value: "689",
      change: "+12%",
      icon: <Users size={24} />,
      //   gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      //   gradient: "var(--gradientTheme)",
    },
    {
      title: "This Month Joiners",
      value: "24",
      change: "+12%",
      icon: <UserCheck size={24} />,
      //   gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      //   gradient: "var(--gradientTheme)",
    },
    {
      title: "Recent Joiners",
      value: "12",
      change: "+8%",
      icon: <UserPlus size={24} />,
      //   gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      //   gradient: "var(--gradientTheme)",
    },
    {
      title: "Ex-Employees",
      value: "15",
      change: "-3%",
      icon: <UserMinus size={24} />,
      //   gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      //   gradient: "var(--gradientTheme)",
    },
    {
      title: "On Leave Today",
      value: "07",
      change: "+5%",
      icon: <Calendar size={24} />,
      //   gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      //   gradient: "var(--gradientTheme)",
    },
    // {
    //   title: "Incomplete Profiles",
    //   value: "43",
    //   change: "-15%",
    //   icon: <AlertCircle size={24} />,
    //   //   gradient: "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)",
    //   //   gradient: "var(--gradientTheme)",
    // },
  ];

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

  const recentActivities = [
    {
      name: "Rahul Sharma",
      action: "joined Engineering dept",
      time: "2 hours ago",
      avatar: "👨‍💼",
    },
    {
      name: "Priya Patel",
      action: "updated profile",
      time: "4 hours ago",
      avatar: "👩‍💼",
    },
    {
      name: "Amit Kumar",
      action: "completed onboarding",
      time: "6 hours ago",
      avatar: "👨‍💻",
    },
    {
      name: "Sneha Reddy",
      action: "applied for leave",
      time: "8 hours ago",
      avatar: "👩‍🔬",
    },
  ];

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
        {/* <div className={`${styles.card} ${styles.fadeInDelay1}`}>
    <div className={styles.cardHeader}>
      <div>
        <h3 className={styles.cardTitle}>Branch Distribution</h3>
        <p className={styles.cardSubtitle}>{branches.length} total branches</p>
      </div>
      <Building2 size={24} color="#667eea" />
    </div>

    <div className={styles.branchList}>
      {branches.map((branch, idx) => (
        <div key={idx} className={styles.branchItem}>
          <div className={styles.branchInfo}>
            <div
              className={styles.branchDot}
              style={{ background: branch.color }}
            />
            <span className={styles.branchName}>{branch.name}</span>
          </div>

          <div className={styles.branchStats}>
            <span className={styles.branchCount}>{branch.employees}</span>
            <div className={styles.branchBar}>
              <div
                className={styles.branchBarFill}
                style={{
                  width: `${(branch.employees / 200) * 100}%`,
                  background: branch.color,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div> */}
        {/* Branch Distribution */}
        <div className={`${styles.card} ${styles.fadeInDelay1}`}>
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
            <div
              className={styles.pieChart}
              style={{
                background: `conic-gradient(
          ${branches
            .map((b, i) => {
              const total = branches.reduce((sum, x) => sum + x.employees, 0);
              const start =
                (branches.slice(0, i).reduce((sum, x) => sum + x.employees, 0) /
                  total) *
                100;
              const end = start + (b.employees / total) * 100;
              return `${b.color} ${start}% ${end}%`;
            })
            .join(",")}
        )`,
              }}
            >
              <div className={styles.pieCenter}>
                <span>Total</span>
                <strong>
                  {branches.reduce((sum, x) => sum + x.employees, 0)}
                </strong>
              </div>
            </div>

            <div className={styles.pieLegend}>
              {branches.map((branch, idx) => (
                <div key={idx} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: branch.color }}
                  ></span>
                  <span>{branch.name}</span>
                  <strong>{branch.employees}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Graph */}
        <div className={`${styles.card} ${styles.fadeInDelay2}`}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Department Overview</h3>
              <p className={styles.cardSubtitle}>Employee distribution</p>
            </div>
            <PieChart size={24} color="#f093fb" />
          </div>

          <div className={styles.deptGrid}>
            {departments.map((dept, idx) => (
              <div key={idx} className={styles.deptCard}>
                <div className={styles.deptIcon}>{dept.icon}</div>

                <div className={styles.deptInfo}>
                  <div className={styles.deptName}>{dept.name}</div>
                  <div className={styles.deptCount}>{dept.count}</div>
                </div>

                <div
                  className={styles.deptBar}
                  style={{ background: `${dept.color}20` }}
                >
                  <div
                    className={styles.deptBarFill}
                    style={{
                      width: `${(dept.count / 250) * 100}%`,
                      background: dept.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles.card} ${styles.fadeInDelay3}`}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Incomplete Profile</h3>
              <p className={styles.cardSubtitle}>Total <b> 43</b> Incomple Profile</p>
            </div>
            <AlertCircle size={24} color="var(--themeColor)" />
          </div>

          <div className={styles.activityList}>
            {recentActivities.map((activity, idx) => (
              <div key={idx} className={styles.activityItem}>
                <div className={styles.activityAvatar}>{activity.avatar}</div>

                <div className={styles.activityContent}>
                  <div className={styles.activityName}>{activity.name}</div>
                  {/* <div className={styles.activityAction}>{activity.action}</div> */}
                </div>

                <div className={styles.activityTime}>
                    {/* {activity.time} */}
                    6 missing details
                    </div>
              </div>
            ))}
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
