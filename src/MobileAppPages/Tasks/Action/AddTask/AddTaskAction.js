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


export const handleSaveTasks = (displayName, setError) => {
    if (displayName.trim() === "") {
        setError("Please provide display name of task.");
        return;
    };

};

export const handleClearFields = (setError, setDisplayName) => {
    setDisplayName('');
    setError('');
}