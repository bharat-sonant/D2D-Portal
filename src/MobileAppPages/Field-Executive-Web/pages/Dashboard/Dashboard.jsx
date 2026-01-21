import React, { useState } from 'react';
import { Plus, CheckCircle2, ClipboardList, ChevronRight, Calendar, LayoutGrid, Activity, Clock, X, LogOut } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showAddOptions, setShowAddOptions] = useState(false);

  const tasks = [
    { id: 1, title: 'Network Maintenance - Zone A', priority: 'high', type: 'KPI', time: '09:30 AM' },
    { id: 2, title: 'Regular Site Audit', priority: 'low', type: 'Other', time: '11:45 AM' },
    { id: 3, title: 'Equipment Checkup', priority: 'low', type: 'KPI', time: '02:00 PM' },
    { id: 4, title: 'System Security Patch', priority: 'high', type: 'KPI', time: '04:15 PM' },
    { id: 5, title: 'Fiber Inspection', priority: 'low', type: 'KPI', time: '05:00 PM' },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.fixedTopSection}>
        <div className={styles.headerSection}>
          <div className={styles.topBar}>
            {/* User Info with Always Visible Logout */}
            <div className={styles.userInfo}>
              <div className={styles.avatar}>AD</div>
              <div className={styles.userMeta}>
                <div className={styles.textContainer}>
                  <p className={styles.greeting}>Good Morning,</p>
                  <h2 className={styles.userName}>Admin Professional</h2>
                </div>
                  <div className={styles.dateChip}>
              <Calendar size={14} />
              <span>21 Jan 2026</span>
            </div>
              </div>
            </div>

                <button className={styles.logoutInlineBtn}>
                   <LogOut size={12} /> Logout
                </button>
          
          </div>

          <div className={styles.tabSwitcher}>
            <button 
              className={activeTab === 'today' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab('today')}
            >
              <LayoutGrid size={16} /> Today's Task
            </button>
            <button 
              className={activeTab === 'monitoring' ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab('monitoring')}
            >
              <Activity size={16} /> Monitoring
            </button>
          </div>
        </div>

        <div className={styles.statsContainer}>
          {activeTab === 'today' && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.iconCircle}><CheckCircle2 size={18} color="#286c1b" /></div>
                <div>
                  <span className={styles.statLabel}>Completed</span>
                  <p className={styles.statValue}>12</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.iconCircleRed}><ClipboardList size={18} color="#ef4444" /></div>
                <div>
                  <span className={styles.statLabel}>Pending</span>
                  <p className={`${styles.statValue} ${styles.redText}`}>04</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {activeTab === 'today' ? (
          <div className={styles.tasksSection}>
            <div className={styles.sectionHeader}>
              <h3>Current Tasks</h3>
              <span className={styles.pillBadge}>{tasks.length} Assigned</span>
            </div>

            <div className={styles.taskItems}>
              {tasks.map((task) => (
                <div key={task.id} className={styles.modernCard}>
                  <div className={task.priority === 'high' ? styles.sideBarHigh : styles.sideBarNormal} />
                  <div className={styles.cardInfo}>
                    <div className={styles.cardTop}>
                      <span className={styles.tag}>{task.type}</span>
                      <div className={styles.timeInfo}><Clock size={12}/> {task.time}</div>
                    </div>
                    <div className={styles.priorityRow}>
                       <h4 className={styles.titleText}>{task.title}</h4>
                       <span className={task.priority === 'high' ? styles.priorityHigh : styles.priorityNormal}>
                         {task.priority.toUpperCase()}
                       </span>
                    </div>
                  </div>
                  <button className={styles.actionBtn}>Pick <ChevronRight size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyMonitoring}></div>
        )}
      </div>

      {showAddOptions && <div className={styles.overlay} onClick={() => setShowAddOptions(false)} />}
      <div className={styles.fabContainer}>
        {showAddOptions && (
          <div className={styles.optionsList}>
            <button className={styles.subFab}>
              <span className={styles.subFabText}>Add KPI Task</span>
              <div className={styles.subIcon} ><Plus size={14}/></div>
            </button>
            <button className={styles.subFab}>
              <span className={styles.subFabText}>Add Other Task</span>
              <div className={styles.subIcon} ><Plus size={14}/></div>
            </button>
          </div>
        )}
        <button 
          className={`${styles.masterFab} ${showAddOptions ? styles.fabClose : ''}`}
          onClick={() => setShowAddOptions(!showAddOptions)}
        >
          {showAddOptions ? <X size={24} /> : <Plus size={32} />}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;