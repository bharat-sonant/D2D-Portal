import { useState } from 'react';
import styles from '../../Styles/AssignmentSummary/AssignmentSummaryBox.module.css';
import WardList from './WardList';

const AssignmentSummaryBox = ({wardsList, loading}) => {
 const { notAssigned = [], inProgress = [], completed = [] } = wardsList || {};

  // 👇 selected tab: 'notAssigned', 'inProgress', 'completed'
  const [activeTab, setActiveTab] = useState("notAssigned");

  // 👇 select correct array
  const selectedWards =
    activeTab === "notAssigned"
      ? notAssigned
      : activeTab === "inProgress"
      ? inProgress
      : completed;



  const statusData = [
    {
      id: notAssigned,
      title: 'Not Started',
      count: notAssigned.length,
      colorClass: 'notStarted'
    },
    {
      id: inProgress,
      title: 'In Progress',
      count: inProgress.length,
      colorClass: 'inProgress'
    },
    {
      id: completed,
      title: 'Completed',
      count: completed.length,
      colorClass: 'completed'
    }
  ];
  console.log('status data',statusData)

  return (
    <div className={styles.container}>
      {statusData.map((status) => (
        <div
          key={status.id}
          onClick={() => setActiveTab(status.id)}
          className={`${styles.card} ${styles[status.class + "Card"]} ${
            activeTab === status.id ? styles.activeCard : ""
          }`}
          role="button"
          tabIndex={0}
        >
          <div className={styles.number}>{status.count}</div>
          <div className={styles.label}>
            {status.title}
          </div>
        </div>
      ))}
      <WardList
        wards={selectedWards}
        loading={loading}
      />
    </div>
  );
};

export default AssignmentSummaryBox;