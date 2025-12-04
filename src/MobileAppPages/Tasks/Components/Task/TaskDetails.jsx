import styles from '../../Styles/TaskDetails/TaskDetails.module.css';

const TaskDetails = (props) => {
    if (!props.selectedTask) {
        return <div className={styles.emptyState}></div>;
    }

    const { name } = props.selectedTask;
    return (
        <>
            <div className={styles.card}>
                <div className={styles.headerRow}>
                    <span className={styles.taskIdBadge}>
                        {props.selectedTask.taskId}
                    </span>

                    <h2 className={styles.name}>
                        {name || 'N/A'}
                    </h2>
                </div>
            </div>
        </>
    );

};

export default TaskDetails;