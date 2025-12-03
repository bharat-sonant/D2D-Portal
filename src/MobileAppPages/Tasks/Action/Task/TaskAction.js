import { AppAlert, setAlertMessage } from "../../../../common/common";
import { activeInactiveTask, getTaskData, getTaskDetails, saveTaskData } from "../../Service/Tasks/TaskService";

export const handleChange = (type, value, setDisplayName, setError) => {
    if (type === "name") {
        setDisplayName(value);

        if (value.trim() === "") {
            setError("Please provide display name of task.");
        } else {
            setError("");
        };
    };
};

export const handleSaveTasks = (displayName, setError, setLoader, setDisplayName, setTaskList, taskId, setTaskId, setShowCanvas, setSelectedTask) => {
    if (displayName.trim() === "") {
        setError("Please provide display name of task.");
        return;
    };
    setLoader(true);
    saveTaskData(displayName, taskId).then((res) => {
        if (res.status === 'success') {
            console.log(res)
            handleClearFields(setError, setDisplayName, setLoader, setTaskId);
            setLoader(false);
            const newTask = {
                taskId: res.data.taskId,
                name: displayName,
                status: "active"
            };
            setTaskList((prev) => {
                if (taskId) {
                    return prev.map((task) =>
                        task.taskId === taskId
                            ? { ...task, name: displayName }
                            : task
                    );
                }
                return [newTask, ...prev];
            });
            if (taskId) {
                setSelectedTask((prev) => ({
                    ...prev,
                    name: displayName
                }));
            }
            setShowCanvas(false);
        } else {
            setLoader(false);
        };
    });
};

export const handleClearFields = (setError, setDisplayName, setLoader, setTaskId) => {
    setDisplayName('');
    setError('');
    setLoader(false);
    setTaskId('');
}

export const getTasks = (setTaskList, setLoading) => {
    getTaskData().then((response) => {
        if (response.status === 'success') {
            let taskList = [...response.data];
            taskList.sort((a, b) => {
                if (a.status === "active" && b.status === "inactive") return -1;
                if (a.status === "inactive" && b.status === "active") return 1;
                return 0;
            });
            setTaskList(taskList);
        } else {
            setTaskList([]);
        }

        setLoading(false);
    });
};


export const getTaskDetail = (setSelectedTask, selectedTaskId) => {
    getTaskDetails(selectedTaskId).then((response) => {
        if (response.status === 'success') {
            setSelectedTask(response.data.details);
        } else {
            setSelectedTask(null);
        }
    });
};

export const ActiveInactiveTask = (props, setToggle, toggle) => {
    const newStatus = toggle ? "inactive" : "active";
    setToggle(!toggle);
    activeInactiveTask(props.selectedTask.taskId, newStatus).then(() => {
        props.setSelectedTask(prev => ({
            ...prev,
            status: newStatus
        }));
        props.setTaskList(prev => {
            const updatedList = prev.map(task =>
                task.taskId === props.selectedTask.taskId
                    ? { ...task, status: newStatus }
                    : task
            );
            return updatedList.sort((a, b) => {
                if (a.status === "active" && b.status === "inactive") return -1;
                if (a.status === "inactive" && b.status === "active") return 1;
                return 0;
            });
        });
        setAlertMessage('success', toggle ? 'Task inactive successfully' : 'Task active successfully');
    }).catch((err) => {
        console.log("Error updating status", err);
    });
}