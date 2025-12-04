import TaskList from "../../Components/Task/TaskList"
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import TaskStyles from '../../Styles/TaskList/TaskList.module.css';
import AddTask from "../../Components/Task/AddTask";
import { useEffect, useState } from "react";
import TaskDetails from "../../Components/Task/TaskDetails";
import * as firebaseService from '../../../../firebase/firebaseService';
import * as dbConfig from '../../../../configurations/cityDBConfig';
import { deleteTask, getHistoryData, getTaskDetail, getTasks } from "../../Action/Task/TaskAction";
import { LucideSettings } from "lucide-react";
import HistoryData from "../../Components/Task/HistoryData";
import DeleteConfirmation from "../../Components/DeleteConfirmation/DeleteConfirmation";

const Task = () => {
    const [showCanvas, setShowCanvas] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskId, setTaskId] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [openCanvas, setOpenCanvas] = useState(false);
    const [taskHistory, setTaskHistory] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const city = localStorage.getItem('city') || "DevTest";

    useEffect(() => {
        const config = dbConfig.getCityFirebaseConfig(city);
        firebaseService.connectFirebase(config, city);
    }, []);

    useEffect(() => {
        getTasks(setTaskList, setLoading);
    }, []);

    useEffect(() => {
        if (taskList.length > 0 && !selectedTaskId) {
            setSelectedTaskId(taskList[0].taskId);
        };
    }, [taskList]);

    useEffect(() => {
        if (selectedTaskId) {
            getTaskDetail(setSelectedTask, selectedTaskId);
            getHistory()
        };
    }, [selectedTaskId]);

    const getHistory = () => {
        getHistoryData(selectedTaskId, setTaskHistory);
    }

    const handleOpenModal = () => {
        setShowCanvas(true);
    };

    const handleTaskSelection = (task) => {
        setSelectedTaskId(task.taskId);
    };

    const handleClickEdit = () => {
        setOpenCanvas(false);
        setShowCanvas(true);
        setTaskId(selectedTask.taskId);
        setDisplayName(selectedTask.name);
    };

    const openOffCanvasModal = () => {
        setOpenCanvas(true);
    }

    const onHideCanvas = () => {
        setOpenCanvas(false)
    }

    const handleDelete = () => {
        setOpenCanvas(false);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        deleteTask(
            selectedTask?.taskId,
            setTaskList,
            setShowDeleteModal,
            setSelectedTaskId,
            setSelectedTask
        );
    };

    return (
        <>
            {selectedTaskId && (
                <div className={`${GlobalStyles.floatingDiv}`} style={{ bottom: "90px" }}>
                    <button
                        className={`${GlobalStyles.floatingBtn}`}
                        onClick={openOffCanvasModal}
                    >
                        <LucideSettings style={{ position: 'relative', bottom: '3px' }} />
                    </button>
                </div>
            )}

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
                                setSelectedTask={setSelectedTask}
                                setTaskList={setTaskList}
                                setSelectedTaskId={setSelectedTaskId}
                                getHistory={getHistory}
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
                    getHistory={getHistory}
                />
            </div>
            <HistoryData
                openCanvas={openCanvas}
                onHide={onHideCanvas}
                taskHistory={taskHistory}
                onEditClick={handleClickEdit}
                handleDelete={handleDelete}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                setTaskList={setTaskList}
                setSelectedTaskId={setSelectedTaskId}
                getHistory={getHistory}

            />

            <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={selectedTask?.name || "this task"}
            />
        </>
    )
}

export default Task