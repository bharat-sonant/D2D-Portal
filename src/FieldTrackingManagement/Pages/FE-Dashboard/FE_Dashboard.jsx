import { useState } from "react";
import styles from "./FE_Dashboard.module.css";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const FE_Dashboard = () => {
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" | "monthly"
  const taskStats = { total:25, active: 18, inactive: 7 };

  const userStats = { total: 32, active: 26, inactive: 6 };

  const siteUserStats = [
    { site: "Sector 21 – Noida", users: 4 },
    { site: "DLF Phase 3 – Gurgaon", users: 3 },
    { site: "Indira Nagar – Lucknow", users: 2 },
    { site: "Andheri East – Mumbai", users: 5 },
    { site: "Whitefield – Bengaluru", users: 4 },
    { site: "HSR Layout – Bengaluru", users: 3 },
    { site: "Salt Lake – Kolkata", users: 2 },
    { site: "Banjara Hills – Hyderabad", users: 3 },
    { site: "Powai – Mumbai", users: 1 },
    { site: "Viman Nagar – Pune", users: 2 },
    { site: "Navrangpura – Ahmedabad", users: 2 },
    { site: "Alkapuri – Vadodara", users: 1 },
  ];

  const workingSitesCount = 4;

  const unassignedUsers = ["Rohit Sharma", "Amit Verma", "Neha Singh"];

  const totalAssignedHours = 186;

  const taskDistribution = [
    { name: "Active", value: taskStats.active, fill: "#06b6d4" },
    { name: "Inactive", value: taskStats.inactive, fill: "#64748b" },
  ];

  const userDistribution = [
    {name: 'Active', value: userStats.active, fill: '#06b6d4'},
    { name: "Inactive", value: userStats.inactive, fill: "#64748b" },
  ]

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
            <span className={styles.tooltipDot} style={{ background: p.color }} />
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      {/* TOP GRID */}
      <div className={styles.topGrid}>
        {/* Users */}
        <div className={styles.card}>
          <h3>Users Overview</h3>

          <div className={styles.taskDistributionWrapper}>
            {/* Pie Chart */}
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  <Label
                    value={userStats.total}
                    position="center"
                    className={styles.pieCenterValue}
                  />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Side Counts */}
            <div className={styles.taskLegend}>
              {userDistribution.map((item) => (
                <div key={item.name} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: item.fill }}
                  />
                  <div>
                    <p className={styles.legendLabel}>{item.name}</p>
                    <strong className={styles.legendValue}>{item.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className={styles.card}>
          <h3>Task Distribution</h3>
          <div className={styles.taskDistributionWrapper}>
            {/* Pie Chart */}
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  <Label
                    value={taskStats.total}
                    position="center"
                    className={styles.pieCenterValue}
                  />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Side Counts */}
            <div className={styles.taskLegend}>
              {taskDistribution.map((item) => (
                <div key={item.name} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: item.fill }}
                  />
                  <div>
                    <p className={styles.legendLabel}>{item.name}</p>
                    <strong className={styles.legendValue}>{item.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Working Sites KPI */}
      <div className={styles.highlightCard}>
        <div className={styles.highlightValue}>{workingSitesCount}</div>
        <div className={styles.highlightLabel}>Working Sites</div>
      </div>

      {/* Accessible Sites */}
      <div className={styles.card}>
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

                  <div className={styles.siteUsers}
                   data-tooltip={`${item.users} Users`}
                  >
                    {item.users}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

      {/* MIDDLE */}
     <div className={styles.midGrid}>
        <div className={styles.card}>
          {/* Header with Toggle */}
          <div className={styles.cardHeader}>
            <h3>
              {viewMode === "weekly" ? "Weekly Progress" : "Monthly Trend"}
            </h3>

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
          <ResponsiveContainer width="100%" height={250}>
            {viewMode === "weekly" ? (
              <AreaChart data={weeklyProgress}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area dataKey="completed" />
                <Area dataKey="assigned" />
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


      {/* BOTTOM */}
      <div className={styles.card}>
        <h3>Unassigned Users & Workload</h3>
        <div className={styles.bottomGrid}>
          <ul className={styles.userList}>
            {unassignedUsers.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>

          <div className={styles.highlightCard}>
            <div className={styles.highlightLabel}>Total Assigned Work :</div>
            <div className={styles.highlightValue}>{totalAssignedHours} hrs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FE_Dashboard;
