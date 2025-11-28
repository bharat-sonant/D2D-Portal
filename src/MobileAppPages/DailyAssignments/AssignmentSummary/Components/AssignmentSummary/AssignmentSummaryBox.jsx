import styles from '../../Styles/AssignmentSummary/AssignmentSummaryBox.module.css';
import WardList from './WardList';

const AssignmentSummaryBox = (props) => {
  const notAssigned = props.wardsList?.[0] || [];
  const inProgress = props.wardsList?.[1] || [];
  const completed = props.wardsList?.[2] || [];

  const flatWards = props.wardsList ? props?.wardsList?.flat() : [];


  const statusData = [
    {
      id: 1,
      title: 'Not Started',
      count: notAssigned.length,
      colorClass: 'notStarted'
    },
    {
      id: 2,
      title: 'In Progress',
      count: inProgress.length,
      colorClass: 'inProgress'
    },
    {
      id: 3,
      title: 'Completed',
      count: completed.length,
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
        wards={flatWards}
        loading={props.loading}
      />
    </div>
  );
};

export default AssignmentSummaryBox;