import React, { useState } from 'react'
import styles from '../../Styles/TaskDetails/TaskDetails.module.css';
import dayjs from 'dayjs';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { ActiveInactiveTask, deleteTask } from '../../Action/Task/TaskAction';
import DeleteConfirmation from '../DeleteConfirmation/DeleteConfirmation';

const TaskDetails = (props) => {
    const [toggle, setToggle] = useState(props.selectedTask?.status === "active");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    React.useEffect(() => {
        if (props.selectedTask) {
            setToggle(props.selectedTask.status === "active");
        }
    }, [props.selectedTask]);

    if (!props.selectedTask) {
        return <div className={styles.emptyState}></div>;
    }

    const { name, _by, _at } = props.selectedTask;

    const handleToggle = () => {
        ActiveInactiveTask(props, setToggle, toggle)
    };

    const handleEdit = (item) => {
        props.onEditClick(item);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        deleteTask(
            props.selectedTask?.taskId,
            props.setTaskList,
            setShowDeleteModal,
            props.setSelectedTaskId,
            props.setSelectedTask
        );
    };

    return (
        <>
            <div className={styles.card}>
                <div className={styles.taskIdBadge}>
                    {props.selectedTask.taskId}
                </div>
                {/* <div className={styles.header}> */}
                    <div className={styles.headerLeft}>
                        <h2 className={styles.name}>{name || 'N/A'}</h2>
                        {/* <p className={styles.createdBy}>Created by: {_by || 'Unknown'}</p>
                        <p className={styles.createdAt}>
                            Created at: {_at ? dayjs(_at).format('DD-MMM-YYYY') : 'N/A'}
                        </p> */}
                    </div>

                    {/* <div className={styles.actions}>
                        {toggle && (
                            <button
                                className={`${styles.iconButton} ${styles.editIcon}`}
                                onClick={() => handleEdit(props.selectedTask)}
                                title="Edit"
                            >
                                <FaEdit />
                            </button>
                        )}
                        {!toggle && (
                            <button
                                className={`${styles.iconButton} ${styles.deleteIcon}`}
                                onClick={handleDelete}
                                title="Delete"
                            >
                                <RiDeleteBin6Fill />
                            </button>
                        )}
                    </div> */}
                {/* </div> */}

                {/* <div className={styles.statusSection}>
                    <span
                        className={`${styles.statusLabel} ${toggle ? styles.activeText : styles.inactiveText}`}
                    >
                        {toggle ? "Active" : "Inactive"}
                    </span>

                    <div
                        className={`${styles.toggleSwitch} ${toggle ? styles.active : styles.inactive}`}
                        onClick={handleToggle}
                    >
                        <div className={styles.toggleSlider}></div>
                    </div>
                </div> */}
            </div>

            <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={name || "this task"}
            />
        </>
    );
};

export default TaskDetails;