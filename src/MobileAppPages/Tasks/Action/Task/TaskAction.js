import { getTaskData, getTaskDetails, saveTaskData } from "../../Service/Tasks/TaskService";

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
            setTaskList(response.data);
            setLoading(false);
        } else {
            setTaskList('');
            setLoading(false);
        };
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