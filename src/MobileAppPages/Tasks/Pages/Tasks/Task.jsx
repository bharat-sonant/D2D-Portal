import TaskList from "../../Components/Task/TaskList"
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import TaskStyles from '../../Styles/TaskList/TaskList.module.css';
import AddTask from "../../Components/Task/AddTask";
import { useEffect, useState } from "react";
import TaskDetails from "../../Components/Task/TaskDetails";
import * as firebaseService from '../../../../firebase/firebaseService';
import * as dbConfig from '../../../../configurations/cityDBConfig';
import { getTaskDetail, getTasks } from "../../Action/Task/TaskAction";

const Task = () => {
    const [showCanvas, setShowCanvas] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskId, setTaskId] = useState('');
    const [displayName, setDisplayName] = useState('');
    const city = localStorage.getItem('city') || "DevTest";

    useEffect(() => {
        const config = dbConfig.getCityFirebaseConfig(city);
        firebaseService.connectFirebase(config, city);
    }, []);

    useEffect(() => {
        getTasks(setTaskList, setLoading)
    }, [])

    useEffect(() => {
        if (taskList.length > 0 && !selectedTaskId) {
            setSelectedTaskId(taskList[0].taskId);
        }
    }, [taskList]);

    useEffect(() => {
        if (selectedTaskId) {
            getTaskDetail(setSelectedTask, selectedTaskId);
        }
    }, [selectedTaskId])

    const handleOpenModal = () => {
        setShowCanvas(true);
    }

    const handleTaskSelection = (task) => {
        setSelectedTaskId(task.taskId);
    };

    const handleClickEdit = (item) => {
        setShowCanvas(true);
        setTaskId(item.taskId);
        setDisplayName(item.name);
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
                    <TaskList
                        taskList={taskList}
                        loading={loading}
                        selectedTaskId={selectedTaskId}
                        onSelectTask={handleTaskSelection}
                    />
                </div>

                <div className={`${TaskStyles.employeeRight}`}>
                    <div className={`row g-0`}>
                        <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
                            <TaskDetails
                                selectedTaskId={selectedTaskId}
                                selectedTask={selectedTask}
                                onEditClick={handleClickEdit}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={GlobalStyles.mainSections}>
                <AddTask
                    showCanvas={showCanvas}
                    setShowCanvas={setShowCanvas}
                    setTaskList={setTaskList}
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    taskId={taskId}
                    setTaskId={setTaskId}
                    setSelectedTask={setSelectedTask}
                />
            </div>
        </>
    )
}

export default Task