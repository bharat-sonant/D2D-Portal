import { useEffect, useState } from 'react';
import styles from '../../Styles/AssignmentSummary/AssignmentSummaryBox.module.css';
import { getWards } from '../../Action/AssignmentSummary/AssignmentSummaryAction';
import WardList from './WardList';

const AssignmentSummaryBox = () => {
  const [wardsList, setWardsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWards, setShowWards] = useState(false);

  useEffect(() => {
    getWards(setWardsList, setLoading);
  }, [])

  const handleBoxClick = (status) => {
    if (status.id === 1) {
      setShowWards(true);
    };
  };

  const statusData = [
    {
      id: 1,
      title: 'Not Started',
      count: wardsList ? wardsList.length : '0',
      colorClass: 'notStarted'
    },
    {
      id: 2,
      title: 'In Progress',
      count: 0,
      colorClass: 'inProgress'
    },
    {
      id: 3,
      title: 'Completed',
      count: 0,
      colorClass: 'completed'
    }
  ];

  return (
    <div className={styles.container}>
      {statusData.map((status) => (
        <div
          key={status.id}
          className={`${styles.card} ${styles[status.colorClass + 'Card']}`}
          role="button"
          tabIndex={0}
          onClick={() => handleBoxClick(status)}
        >
          <div className={styles.number}>{status.count}</div>
          <div className={styles.label}>
            {status.title}
          </div>
        </div>
      ))}
      {showWards && (
        <WardList wards={wardsList} loading={loading} />
      )}
    </div>
  );
};

export default AssignmentSummaryBox;