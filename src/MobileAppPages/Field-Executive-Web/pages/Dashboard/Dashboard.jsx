import { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle2,
  ClipboardList,
  ChevronRight,
  LayoutGrid,
  Building2,
  ClipboardCheck,
  Clock,
  X,
  Power,
  MapPin,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import TaskMonitoring from "../../Components/Dashboard/TaskMonitoring/TaskMonitoring";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // LocalStorage se string data nikal kar parse karein
    const storedUser = localStorage.getItem("fe_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const tasks = [
    {
      id: 1,
      title: "Network Maintenance - Zone A",
      type: "Priority Task",
      time: "09:30 AM",
    },
    { id: 2, title: "Regular Site Audit", type: "Other", time: "11:45 AM" },
    { id: 3, title: "Equipment Checkup", type: "KPI", time: "02:00 PM" },
    {
      id: 4,
      title: "System Security Patch",
      type: "Priority Task",
      time: "04:15 PM",
    },
    { id: 5, title: "Fiber Inspection", type: "KPI", time: "05:00 PM" },
    { id: 6, title: "Network Optimization", type: "KPI", time: "06:30 PM" },
    { id: 7, title: "System Upgrade", type: "Other", time: "07:15 PM" },
    {
      id: 8,
      title: "Critical Alert Response",
      type: "Priority Task",
      time: "08:00 PM",
    },
  ];

  // Sort tasks - Priority Task always on top
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.type === "Priority Task" && b.type !== "Priority Task") return -1;
    if (a.type !== "Priority Task" && b.type === "Priority Task") return 1;
    return 0;
  });

  return (
    // <>
    // {/* <KpiTaskExecutionForm mode="Pick" /> */}
    // </>
    <div className={styles.dashboardWrapper}>
      <div className={styles.headerSection}>
        <div className={styles.topBar}>
          {/* <div className={styles.avatar}>
                {user?.employeeName ? user.employeeName.charAt(0).toUpperCase() : 'U'}
              </div> */}
          <div className={styles.userMeta}>
            <div className={styles.textContainer}>
              <p className={styles.greeting}>
                Welcome,{" "}
                <span className={styles.userName}>
                  {user?.employeeName || "Executive"}{" "}
                </span>
              </p>

              <div className={styles.dateChip}>
                <MapPin size={14} />

                <span>{user?.site?.siteName || "No Site"}</span>
              </div>
            </div>
          </div>
          <button
            className={styles.logoutInlineBtn}
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("fe_user");
              navigate("/fe-WebView/login");
            }}
          >
            <Power size={12} />
          </button>
        </div>

        {/* <div className={styles.tabSwitcher}>
          <button
            className={
              activeTab === "today" ? styles.tabActive : styles.tabInactive
            }
            onClick={() => setActiveTab("today")}
          >
            <LayoutGrid size={16} /> Today's Task
          </button>
          <button
            className={
              activeTab === "monitoring" ? styles.tabActive : styles.tabInactive
            }
            onClick={() => setActiveTab("monitoring")}
          >
            <ClipboardCheck size={16} /> Task Monitoring
          </button>
        </div> */}
        <div className={styles.tabSwitcher}>

          <button
            className={`${styles.tab} ${
              activeTab === "today" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("today")}
          >
            <LayoutGrid size={16} /> Today's Task
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "monitoring" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("monitoring")}
          >
            <ClipboardCheck size={16} /> Task Monitoring
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Stats Container: Only visible in 'today' tab */}
        {activeTab === "today" && (
          <div className={styles.statsContainer}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.iconCircle}>
                  <CheckCircle2 size={18} color="#286c1b" />
                </div>
                <div>
                  <span className={styles.statLabel}>Completed</span>
                  <p className={styles.statValue}>12</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.iconCircleRed}>
                  <ClipboardList size={18} color="#ef4444" />
                </div>
                <div>
                  <span className={styles.statLabel}>Pending</span>
                  <p className={`${styles.statValue} ${styles.redText}`}>04</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "today" ? (
          <div className={styles.tasksSection}>
            <div className={styles.sectionHeader}>
              Current Tasks
              <span className={styles.pillBadge}>{tasks.length}</span>
            </div>
            <div className={styles.taskItems}>
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${styles.modernCard} ${task.type === "Priority Task" ? styles.priorityCardHighlight : ""}`}
                >
                  <div
                    className={
                      task.type === "Priority Task"
                        ? styles.sideBarHigh
                        : styles.sideBarNormal
                    }
                  />
                  <div className={styles.cardInfo}>
                    <h4 className={styles.titleText}>{task.title}</h4>
                    <div className={styles.cardTop}>
                      <span
                        className={
                          task.type === "Priority Task"
                            ? styles.tagRed
                            : styles.tag
                        }
                      >
                        {task.type}
                      </span>
                      <div className={styles.timeInfo}>
                        <Clock size={12} /> {task.time}
                      </div>
                    </div>
                  </div>
                  <button className={styles.actionBtn}>
                    {/* Pick  */}
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Task Monitoring loads in available space without back button */
          <div className={styles.monitoringWrapperInner}>
            <TaskMonitoring />
          </div>
        )}
      </div>

      {/* FAB - Only for Today Tab */}
      {activeTab === "today" && (
        <div className={styles.fabContainer}>
          {showAddOptions && (
            <div className={styles.optionsList}>
              <button className={styles.subFab}>
                <span className={styles.subFabText}>Add KPI Task</span>
                <div className={styles.subIcon}>
                  <Plus size={14} />
                </div>
              </button>
              <button className={styles.subFab}>
                <span className={styles.subFabText}>Add Other Task</span>
                <div className={styles.subIcon}>
                  <Plus size={14} />
                </div>
              </button>
            </div>
          )}
          <button
            className={`${styles.masterFab} ${showAddOptions ? styles.fabClose : ""}`}
            onClick={() => setShowAddOptions(!showAddOptions)}
          >
            {showAddOptions ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>
      )}
      {showAddOptions && activeTab === "today" && (
        <div
          className={styles.overlay}
          onClick={() => setShowAddOptions(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
