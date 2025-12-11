import React, { useEffect, useState } from 'react'
import { supabase } from '../../createClient'
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import TaskStyles from '../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css';
import TaskList from '../../components/TaskData/TaskList';
import AddTaskData from '../../components/TaskData/AddTaskData';
import styles from '../../MobileAppPages/Tasks/Styles/TaskDetails/TaskDetails.module.css';

const TaskData = () => {

    const [taskData, setTaskData] = useState([])
    const [showCanvas, setShowCanvas] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selected, setSelected] = useState(null)

    // console.log(taskData);
    useEffect(() => {
        fetchTaskData()
    }, [])

    const handleOpenModal = () => {
        setShowCanvas(true);
    };
    const fetchTaskData = async () => {
        try {
            const { data, error } = await supabase
                .from('TaskData')
                .select('*')
                .order('id', { ascending: false }); // newest first

            if (error) {
                console.error('Error fetching task data:', error);
            } else {
                // console.log(data)
                setTaskData(data || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
        }
    };

    const onSelectTask = (item) => {
        setSelectedId(item.id)
        setSelected(item)
    }

    return (
        <>
            <div className={`${GlobalStyles.floatingDiv}`}>
                <button
                    className={`${GlobalStyles.floatingBtn}`}
                    onClick={handleOpenModal}
                >
                    +
                </button>
            </div>

            <div className={`${TaskStyles.employeePage}`}>
                <div className={`${TaskStyles.employeeLeft}`}>
                    <TaskList taskData={taskData} onSelectTask={onSelectTask} selectedId={selectedId} />
                </div>

                <div className={`${TaskStyles.employeeRight}`}>
                    <div className={`row g-0`}>
                        <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
                            <div className={styles.card}>
                                <div className={styles.headerRow}>
                                    <span className={styles.taskIdBadge}>
                                        {selectedId}
                                    </span>

                                    <h2 className={styles.name}>
                                        {selected?.taskName || 'N/A'}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={GlobalStyles.mainSections}>
                <AddTaskData
                    showCanvas={showCanvas}
                    setShowCanvas={setShowCanvas}
                />
            </div>
        </>
    )
}

export default TaskData
