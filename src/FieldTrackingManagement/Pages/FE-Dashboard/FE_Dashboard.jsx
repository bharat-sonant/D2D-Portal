// import { useState } from "react";
// import styles from "./FE_Dashboard.module.css";
// import GlobalStyles from "../../../assets/css/globalStyles.module.css";
//
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Label,
// } from "recharts";
// import { ClipboardList, MapPin, Users, CheckCircle } from "lucide-react";
// import DonutChart from "./DonutChart";
// const FE_Dashboard = () => {
//   const [viewMode, setViewMode] = useState("weekly"); // "weekly" | "monthly"
//   const taskStats = { total: 25, active: 18, inactive: 7 };
//
//   const userStats = [
//     { label: "Active", value: 26, color: "var(--themeColor" },
//     { label: "Inactive", value: 6, color: "var(--whitefa)" },
//   ];
//   const stats = [
//     { label: "Total Users", value: "32", color: "purple", icon: "users" },
//     { label: "Active Tasks", value: "25", color: "cyan", icon: "tasks" },
//     { label: "Completed Task", value: "186", color: "green", icon: "check" },
//     { label: "Active Sites", value: "12", color: "purple", icon: "location" },
//     { label: "Inactive Sites", value: "02", color: "orange", icon: "location" },
//   ];
//   const getIcon = (type) => {
//     switch (type) {
//       case "users":
//         return <Users size={28} strokeWidth={2} />;
//       case "tasks":
//         return <ClipboardList size={28} strokeWidth={2} />;
//       case "check":
//         return <CheckCircle size={28} strokeWidth={2} />;
//       case "location":
//         return <MapPin size={28} strokeWidth={2} />;
//       default:
//         return null;
//     }
//   };
//
//   const siteUserStats = [
//     { site: "Sector 21 – Noida", users: 4 },
//     { site: "DLF Phase 3 – Gurgaon", users: 3 },
//     { site: "Indira Nagar – Lucknow", users: 2 },
//     { site: "Andheri East – Mumbai", users: 5 },
//     { site: "Whitefield – Bengaluru", users: 4 },
//     { site: "HSR Layout – Bengaluru", users: 3 },
//     { site: "Salt Lake – Kolkata", users: 2 },
//     { site: "Banjara Hills – Hyderabad", users: 3 },
//     { site: "Powai – Mumbai", users: 1 },
//     { site: "Viman Nagar – Pune", users: 2 },
    { site: "Navrangpura – Ahmedabad", users: 2 },
    { site: "Alkapuri – Vadodara", users: 1 },
  ];

  const workingSitesCount = 4;

  const workload = [
    { name: "Rohit Sharma", hours: 52, initials: "RS" },
    { name: "Amit Verma", hours: 48, initials: "AV" },
    { name: "Neha Singh", hours: 45, initials: "NS" },
  ];

  const unassignedUsers = ["Rohit Sharma", "Amit Verma", "Neha Singh"];

  const totalAssignedHours = 186;

  const taskDistribution = [
    { name: "Active", value: taskStats.active, fill: "#06b6d4" },
    { name: "Inactive", value: taskStats.inactive, fill: "#64748b" },
  ];

  const userDistribution = [
    { name: "Active", value: userStats.active, fill: "#06b6d4" },
    { name: "Inactive", value: userStats.inactive, fill: "#64748b" },
  ];

  const weeklyProgress = [
    { day: "Mon", completed: 12, assigned: 18 },
    { day: "Tue", completed: 15, assigned: 20 },
    { day: "Wed", completed: 18, assigned: 22 },
    { day: "Thu", completed: 14, assigned: 19 },
    { day: "Fri", completed: 21, assigned: 25 },
    { day: "Sat", completed: 8, assigned: 12 },
    { day: "Sun", completed: 5, assigned: 8 },
  ];

  const monthlyTrend = [
    { month: "Jan", tasks: 45 },
    { month: "Feb", tasks: 52 },
    { month: "Mar", tasks: 48 },
    { month: "Apr", tasks: 61 },
    { month: "May", tasks: 55 },
    { month: "Jun", tasks: 67 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipTitle}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} className={styles.tooltipItem} style={{ color: p.color }}>
            <span
              className={styles.tooltipDot}
              style={{ background: p.color }}
            />
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  };
  const totalWorkloadHours = workload.reduce(
    (sum, person) => sum + person.hours,
    0,
  );
  return (
    <>
          {/* Background */}
      <div className={GlobalStyles.background}>
        <div className={`${GlobalStyles.gradientOrb} ${GlobalStyles.orb1}`} />
        <div className={`${GlobalStyles.gradientOrb} ${GlobalStyles.orb2}`} />
        <div className={`${GlobalStyles.gradientOrb} ${GlobalStyles.orb3}`} />
        <div className={GlobalStyles.gridOverlay} />
      </div>

      {/* Particles */}
      <div className={GlobalStyles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={GlobalStyles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    <div className={styles.dashboard}>

      {/* Stat Cards */}
      <div className={styles.statRow}>
        {stats.map((stat, index) => (
          <div key={index} className={` ${styles.statCard}`}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <div className={styles.value}>{stat.value}</div>
                <p>{stat.label}</p>
              </div>

              <div
                className={`${styles.statIcon} ${
                  styles[
                    `statIcon${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`
                  ]
                }`}
              >
                {getIcon(stat.icon)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* chart GRID */}
      <div className={styles.chartGrid}>
        <div className={styles.chartGridLeft}>
          {/* Users */}
          <div className={`${styles.card} ${styles.donutCard}`}>
            <div className={`${styles.cardHeader}`}>
              <h2 className={styles.cardTitle}>Users Overview</h2>
            </div>
            <div className={styles.donutContainer}>
              <DonutChart data={userStats} total={32} />
              <div className={styles.donutLegend}>
                {userStats.map((item, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span
                        className={styles.legendColor}
                        style={{ background: item.color }}
                      />
                      <span className={styles.legendLabel}>{item.label}</span>
                    </div>

                    <span className={styles.legendValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Distribution */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Task Distribution</div>
            </div>
            <div className={styles.donutContainer}>
              <DonutChart data={userStats} total={25} />
              <div className={styles.donutLegend}>
                {taskDistribution.map((item) => (
                  <div key={item.name} className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span
                        className={styles.legendColor}
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className={styles.legendLabel}>{item.name}</span>
                    </div>

                    <span className={styles.legendValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartGridRight}>
          <div className={styles.graphBG}>
            {/* Header with Toggle */}
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                {viewMode === "weekly" ? "Weekly Progress" : "Monthly Trend"}
              </div>

              <div className={styles.toggle}>
                <button
                  className={`${styles.toggleBtn} ${
                    viewMode === "weekly" ? styles.activeToggle : ""
                  }`}
                  onClick={() => setViewMode("weekly")}
                >
                  Weekly
                </button>

                <button
                  className={`${styles.toggleBtn} ${
                    viewMode === "monthly" ? styles.activeToggle : ""
                  }`}
                  onClick={() => setViewMode("monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className={`${styles.graphBody}`}>
              <ResponsiveContainer width="100%" height={250}>
                {viewMode === "weekly" ? (
                  <AreaChart data={weeklyProgress}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      dataKey="completed"
                      stroke="var(--themeColor)"
                      fill="var(--themeColor)"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Area
                      dataKey="assigned"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={monthlyTrend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line dataKey="tasks" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          <div className={styles.chartGridInner}>
            {/* Accessible Sites */}
            <div className={`${styles.card} ${styles.sitesListCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Total Sites</div>
                <p>{siteUserStats.length}</p>
              </div>
              <div className={styles.sitesList}>
                {siteUserStats.map((site, index) => (
                  <div key={index} className={styles.siteItem}>
                    <div className={styles.siteItemLeft}>
                      <span className={styles.siteDot} />
                      <span className={styles.siteName}>{site.site}</span>
                    </div>

                    <span className={styles.siteCount}>{site.users}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Unassigned Users & Workload */}
            <div className={`${styles.card} ${styles.workloadCard}`}>
              <div className={`${styles.cardHeader} `}>
                <h2 className={styles.cardTitle}>
                  Unassigned Users & Workload
                </h2>
                <p>
                  {" "}
                  {totalWorkloadHours} <span className={styles.unit}>hrs</span>
                </p>
              </div>

              <div className={styles.workloadList}>
                {workload.map((person, index) => (
                  <div key={index} className={styles.workloadItem}>
                    <div className={styles.workloadLeft}>
                      <div className={styles.workloadAvatar}>
                        {person.initials}
                      </div>
                      <span className={styles.workloadName}>{person.name}</span>
                    </div>

                    <div className={styles.workloadHours}>
                      {person.hours} <span> hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE */}
      <div className={styles.midGrid}>
        {/* Accessible Sites */}
        {/* <div className={styles.card}>
          <h3>Total Sites : {siteUserStats.length}</h3>

          <div className={styles.siteListBox}>
            {siteUserStats.length === 0 ? (
              <p className={styles.emptyText}>No sites assigned</p>
            ) : (
              <ul className={styles.siteList}>
                {siteUserStats.map((item, index) => (
                  <li key={index} className={styles.siteItem}>
                    <div className={styles.siteLeft}>
                      <span className={styles.siteDot} />
                      <span>{item.site}</span>
                    </div>

                    <div
                      className={styles.siteUsers}
                      data-tooltip={`${item.users} Users`}
                    >
                      {item.users}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default FE_Dashboard;
