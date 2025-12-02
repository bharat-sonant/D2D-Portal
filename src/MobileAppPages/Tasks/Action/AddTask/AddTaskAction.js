import { saveTaskData } from "../../Service/Tasks/TaskService";

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


export const handleSaveTasks = (displayName, setError, setLoader, setDisplayName) => {
    if (displayName.trim() === "") {
        setError("Please provide display name of task.");
        return;
    };
    setLoader(true);
    saveTaskData(displayName).then((res) => {
        if (res.status === 'success') {
            handleClearFields(setError, setDisplayName, setLoader);
            setLoader(false);
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