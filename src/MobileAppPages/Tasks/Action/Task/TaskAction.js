import { ArrowRight } from "lucide-react";
import * as common from "../../../../common/common";
import * as service from "../../Service/Tasks/TaskService";

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

export const handleSaveTasks = (displayName, setError, setLoader, setDisplayName, setTaskList, taskId, setTaskId, setShowCanvas, setSelectedTask, getHistory) => {
    if (displayName.trim() === "") {
        setError("Please provide display name of task.");
        return;
    };
    setLoader(true);
    service.saveTaskData(displayName, taskId).then((res) => {
        if (res.status === 'success') {
            handleClearFields(setError, setDisplayName, setLoader, setTaskId);
            setLoader(false);
            setTaskList((prev) => {
                let updatedList;

                if (taskId) {
                    updatedList = prev.map((task) =>
                        task.taskId === taskId
                            ? { ...task, name: displayName }
                            : task
                    );
                } else {
                    updatedList = [
                        {
                            taskId: res.data.taskId,
                            name: displayName,
                            status: "active"
                        },
                        ...prev
                    ];
                }
                return updatedList.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            });

            if (taskId) {
                setSelectedTask((prev) => ({
                    ...prev,
                    name: displayName
                }));
            }
            setShowCanvas(false);
            getHistory();
            common.setAlertMessage('success', taskId ? 'Task updated successfully' : 'Task saved successfully')
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
    service.getTaskData().then((response) => {
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
    service.getTaskDetails(selectedTaskId).then((response) => {
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

    service.activeInactiveTask(props.selectedTask.taskId, newStatus).then(() => {

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
                if (a.status !== b.status) {
                    return a.status === "active" ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
        });

        common.setAlertMessage('success', toggle ? 'Task inactive successfully' : 'Task active successfully');
        props.getHistory();
    }).catch((err) => {
        console.log("Error updating status", err);
    });
};

export const deleteTask = (taskId, setTaskList, setShowDeleteModal, setSelectedTaskId, setSelectedTask) => {

    setTaskList(prevList => {
        const index = prevList.findIndex(t => t.taskId === taskId);
        const updatedList = prevList.filter(t => t.taskId !== taskId);
        if (updatedList.length > 0) {
            const nextIndex = index >= updatedList.length ? updatedList.length - 1 : index;
            setSelectedTaskId(updatedList[nextIndex].taskId);
        } else {
            setSelectedTaskId(null);
            setSelectedTask(null);
        }
        return updatedList;
    });
    service.deleteInactiveTask(taskId).then((response) => {
        if (response.status === 'success') {
            common.setAlertMessage('success', 'Task deleted successfully');
            setShowDeleteModal(false);
        } else {
            common.setAlertMessage('warn', "Something went wrong !!!");
        };
    });
};

export const getHistoryData = (taskId, setTaskHistory) => {
    service.getTaskUpdateHistory(taskId).then((response) => {
        if (response.status === 'success') {
            setTaskHistory(response.data)
        } else {
            setTaskHistory([]);
        };
    });
};

export const formatEvent = (eventText) => {
    const getStatusColor = (status) => {
        if (!status) return "#333";
        return status.toLowerCase() === "active" ? "#10b981" : "#e11d48"; // green / red
    };

    // --- Task Created Case ---
    const createdRegex = /Task created(.*)/i;
    const createdMatch = eventText.match(createdRegex);

    if (createdMatch) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: "600", textTransform: "capitalize" }}>
                    Task Created
                </span>
            </div>
        );
    }

    // --- Task Name Change ---
    const nameRegex = /Task name changed from (.*?) to (.*)/i;
    const nameMatch = eventText.match(nameRegex);

    if (nameMatch) {
        const oldValue = nameMatch[1];
        const newValue = nameMatch[2];

        return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "capitalize" }}>
                <span>Task Update</span>
                <span style={{ color: '#666363ff' }}>{oldValue}</span>
                <ArrowRight size={18} />
                <span style={{ fontWeight: "600" }}>{newValue}</span>
            </div>
        );
    }

    // --- Status Change ---
    const statusRegex = /Status changed from (.*?) to (.*)/i;
    const statusMatch = eventText.match(statusRegex);

    if (statusMatch) {
        const oldStatus = statusMatch[1];
        const newStatus = statusMatch[2];

        return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "capitalize" }}>
                <span>Task status</span>

                <span style={{ fontWeight: "500", color: getStatusColor(oldStatus) }}>
                    {oldStatus}
                </span>

                <ArrowRight size={18} />

                <span style={{ fontWeight: "600", color: getStatusColor(newStatus) }}>
                    {newStatus}
                </span>
            </div>
        );
    }

    return eventText;
};