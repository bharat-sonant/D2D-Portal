import React, { useState, useEffect } from "react";
import styles from "./EmployeeDashboard.module.css";
import * as EmployeeAction from "../Service/EmployeeAction";
import { getDepartmentsAction } from "../../services/DepartmentService/DepartmentAction";
import { getBranchesAction } from "../../services/BranchService/BranchAction";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Building2,
  Clock,
  Calendar,
  AlertCircle,
  Briefcase,
  Search,
  Bell,
  Settings,
  Filter,
  Plus,
  Download,
  BarChart3,
  Award,
  Target,
  FileText,
  MapPin,
  TrendingUp,
  CreditCard,
  Cake,
  Gift
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static Data for Missing Features (Mock)
  const [attendanceData] = useState([
    { name: "Present", value: 142, color: "#10b981" }, // Emerald 500
    { name: "Absent", value: 8, color: "#ef4444" },   // Red 500
    { name: "Half Day", value: 5, color: "#f59e0b" }, // Amber 500
    { name: "Leave", value: 12, color: "#3b82f6" },   // Blue 500
  ]);

  const [hiringTrend] = useState([
    { month: "Jan", hires: 4 },
    { month: "Feb", hires: 7 },
    { month: "Mar", hires: 5 },
    { month: "Apr", hires: 12 },
    { month: "May", hires: 8 },
    { month: "Jun", hires: 15 },
  ]);

  const [pendingApprovals] = useState([
    { id: 1, type: "Leave", user: "Rajesh Kumar", details: "Sick Leave (2 Days)", time: "2 hrs ago", icon: FileText, color: "#10b981" },
    { id: 2, type: "Expense", user: "Sneha Gupta", details: "Travel Reimbursement", time: "5 hrs ago", icon: CreditCard, color: "#f59e0b" },
    { id: 3, type: "Profile", user: "Amit Singh", details: "Update Address", time: "1 day ago", icon: Users, color: "#3b82f6" },
  ]);

  const [birthdays] = useState([
    { id: 1, name: "Priya Sharma", date: "Today", role: "HR Manager" },
    { id: 2, name: "Rahul Verma", date: "Tomorrow", role: "Developer" },
  ]);


  useEffect(() => {
    EmployeeAction.getEmployeeListAction(setEmployees, setLoading);
    getDepartmentsAction(setDepartments);
    getBranchesAction(setBranches);
  }, []);

  const calculateStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp) => emp.status !== false).length;
    const inactiveEmployees = employees.filter((emp) => emp.status === false).length;

    // Logic for "Recent Joiners" (This Month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthJoiners = employees.filter((emp) => {
      const joinDate = new Date(emp.created_at || emp.date_of_joining); // Fallback to doj if created_at missing
      return (
        joinDate.getMonth() === currentMonth &&
        joinDate.getFullYear() === currentYear
      );
    }).length;

    // Incomplete Profiles Logic
    const incompleteCount = employees.filter((emp) => {
      return !emp.employee_code || !emp.phone_number || !emp.email || !emp.branch_id;
    }).length;


    return [
      { title: "Total Employees", value: totalEmployees, icon: Users, color: "#6366f1", change: "+5%" },
      { title: "Active Employees", value: activeEmployees, icon: UserCheck, color: "#10b981", change: "+2%" },
      { title: "Recent Joiners", value: thisMonthJoiners, icon: UserPlus, color: "#f59e0b", change: "+12%" },
      { title: "Present Today", value: "142", icon: UserCheck, color: "#10b981", change: "95%" }, // Static
      { title: "Absent Today", value: "8", icon: UserX, color: "#ef4444", change: "5%" }, // Static
      { title: "On Leave", value: "12", icon: Calendar, color: "#3b82f6", change: "8%" }, // Static
      { title: "Pending Approvals", value: "6", icon: Clock, color: "#8b5cf6", change: "-2" }, // Static
      { title: "Incomplete Profiles", value: incompleteCount, icon: AlertCircle, color: "#ef4444", change: "Action Req" },
    ];
  };

  // Static Data for Branch Distribution (as requested for better presentation)
  const branchData = [
    { name: "Jaipur", Employees: 15 },
    { name: "Nokha", Employees: 23 },
    { name: "Sikar", Employees: 10 },
    { name: "Chirawa", Employees: 8 },
    { name: "Sagar", Employees: 12 },
  ];

  const getDeptData = () => {
    return departments.map(dept => {
      // Match against dept name or id, using correct key 'dept_id'
      const count = employees.filter(e => e.dept_id === dept.name || e.dept_id == dept.id).length;
      return { name: dept.name, value: count };
    });
  };

  const stats = calculateStats();
  // const branchData = getBranchData(); // Removed strictly to avoid duplication error with static data above
  const deptData = getDeptData();

  // Color Palette for Charts
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className={styles.dashboardContainer}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          Dashboard
        </div>
        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <Search size={18} color="#9ca3af" />
            <input placeholder="Search by name, ID, department..." />
          </div>
          <button className={styles.iconBtn}><Bell size={20} /></button>
          <button className={styles.iconBtn}><Settings size={20} /></button>

          <div className={styles.profileSection}>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>Ansh Lahari</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>Admin</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              AL
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              {/* Tiny Sparkline or Trend Decoration could go here */}
              <div style={{ fontSize: '10px', color: stat.change.includes('+') ? '#10b981' : '#ef4444', fontWeight: '700', background: stat.change.includes('+') ? '#d1fae5' : '#fee2e2', padding: '2px 6px', borderRadius: '10px' }}>
                {stat.change}
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className={styles.mainLayout}>

        {/* Left Column - Quick Actions */}
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Quick Actions</div>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.actionBtn}>
                <UserPlus size={18} /> Add Employee
              </button>
              <button className={`${styles.actionBtn} ${styles.secondary}`}>
                <Building2 size={18} /> Add Branch
              </button>
              <button className={`${styles.actionBtn} ${styles.secondary}`}>
                <Briefcase size={18} /> Add Department
              </button>
              <button className={`${styles.actionBtn} ${styles.secondary}`}>
                <Download size={18} /> Upload Bulk
              </button>
              <button className={`${styles.actionBtn} ${styles.secondary}`}>
                <BarChart3 size={18} /> Generate Reports
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Today's Attendance</div>
            </div>
            <div className={styles.attendanceSummary}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>92%</div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>Present</div>
              </div>
            </div>
            <div className={styles.attendanceLegend}>
              {attendanceData.map((item, idx) => (
                <div key={idx} className={styles.legendItem}>
                  <div className={styles.legendValue} style={{ color: item.color }}>{item.value}</div>
                  <div className={styles.legendLabel}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Charts */}
        <div className={styles.centerColumn}>

          {/* Branch Distribution */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Branch Distribution</div>
              <TrendingUp size={20} color="#9ca3af" />
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="Employees" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department + Hiring (Split Row) */}
          <div className={styles.chartRow}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Department Split</div>
              </div>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Hiring Trend</div>
              </div>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hiringTrend}>
                    <defs>
                      <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="hires" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHires)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activities (Timeline style placeholder) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Recent Activities</div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.itemIcon} style={{ background: '#d1fae5', color: '#059669' }}><UserPlus size={16} /></div>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>Govind joined as Sales Exec</div>
                <div className={styles.itemSubtitle}>Jaipur Branch</div>
              </div>
              <div className={styles.itemSubtitle}>2 hrs ago</div>
            </div>
            <div className={styles.listItem}>
              <div className={styles.itemIcon} style={{ background: '#e0e7ff', color: '#4f46e5' }}><DollarSignIcon size={16} /></div>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>Nishant salary updated</div>
                <div className={styles.itemSubtitle}>By HR Dept</div>
              </div>
              <div className={styles.itemSubtitle}>5 hrs ago</div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Pending Approvals</div>
              <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>8</span>
            </div>
            {pendingApprovals.map(item => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.itemIcon} style={{ background: `${item.color}20`, color: item.color }}>
                  <item.icon size={16} />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{item.type}</div>
                  <div className={styles.itemSubtitle}>{item.user}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.time}</div>
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Birthdays & Anniversaries</div>
              <Cake size={18} color="#f59e0b" />
            </div>
            {birthdays.map(item => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.itemIcon} style={{ borderRadius: '50%' }}>
                  <img src={`https://ui-avatars.com/api/?name=${item.name}&background=random`} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{item.name}</div>
                  <div className={styles.itemSubtitle}>{item.role}</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f46e5' }}>{item.date}</div>
              </div>
            ))}
            <div className={styles.listItem} style={{ marginTop: '10px', background: '#fef3c7', borderRadius: '8px', padding: '12px' }}>
              <Gift size={20} color="#d97706" />
              <div className={styles.itemContent}>
                <div className={styles.itemTitle} style={{ color: '#92400e' }}>Send Wishes</div>
                <div className={styles.itemSubtitle} style={{ color: '#b45309' }}>Tap to send default wishes</div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Live Location</div>
              <MapPin size={18} color="#ef4444" />
            </div>
            <div className={styles.mapCard}>
              Map View (Static)
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

// Helper Icon for Static Data
const DollarSignIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);


export default EmployeeDashboard;
