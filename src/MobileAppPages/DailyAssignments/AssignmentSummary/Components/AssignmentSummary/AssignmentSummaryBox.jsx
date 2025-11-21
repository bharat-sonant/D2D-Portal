import styles from '../../Styles/AssignmentSummary/AssignmentSummaryBox.module.css';
import WardList from './WardList';

const AssignmentSummaryBox = (props) => {
  const statusData = [
    {
      id: 1,
      title: 'Not Started',
      count: props.wardsList ? props.wardsList.length : '0',
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
        >
          <div className={styles.number}>{status.count}</div>
          <div className={styles.label}>
            {status.title}
          </div>
        </div>
      ))}
      <WardList
        wards={props.wardsList}
        loading={props.loading}
      />
    </div>
  );
};

export default AssignmentSummaryBox;