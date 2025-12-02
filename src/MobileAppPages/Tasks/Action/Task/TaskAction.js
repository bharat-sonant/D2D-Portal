import { getTaskData, saveTaskData } from "../../Service/Tasks/TaskService";

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

export const handleSaveTasks = (displayName, setError, setLoader, setDisplayName, setTaskList) => {
    if (displayName.trim() === "") {
        setError("Please provide display name of task.");
        return;
    };
    setLoader(true);
    saveTaskData(displayName).then((res) => {
        if (res.status === 'success') {
            console.log(res)
            handleClearFields(setError, setDisplayName, setLoader);
            setLoader(false);
            const newTask = {
                taskId: res.data.taskId,
                name: displayName,
                status: "Active"
            };

            setTaskList((prev) => [newTask, ...prev]);
        } else {
            setLoader(false);
        };
    });
};

export const handleClearFields = (setError, setDisplayName, setLoader) => {
    setDisplayName('');
    setError('');
    setLoader(false);
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