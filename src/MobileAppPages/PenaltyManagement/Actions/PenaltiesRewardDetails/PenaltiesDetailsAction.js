export const validateField = (name, value, entryType, setErrors) => {
    let error = '';
    switch (name) {
        case 'employee':
            if (!value) error = 'Employee is required.';
            break;
        case 'entryType':
            if (!value) error = 'Please select entry type.';
            break;
        case 'amount':
            if (!value) error = 'Amount is required.';
            else if (isNaN(value) || Number(value) <= 0) error = 'Enter a valid amount.';
            break;
        case 'category':
            if (entryType && !value) {
                error = entryType === 'Penalty'
                    ? 'Please select penalty type.'
                    : 'Please select reward type.';
            }
            break;
        case 'reason':
            if (!value) error = 'Reason is required.';
            else if (value.trim().length < 5) error = 'Reason must be at least 5 characters.';
            break;
        default:
            break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
};

export const handleChange = (
    field,
    value,
    setEmployee,
    setEntryType,
    setAmount,
    setCategory,
    setReason,
    entryType,
    setErrors
) => {
    switch (field) {
        case 'employee':
            setEmployee(value);
            break;
        case 'entryType':
            setEntryType(value);
            setCategory(''); // reset category when type changes
            break;
        case 'amount':
            setAmount(value);
            break;
        case 'category':
            setCategory(value);
            break;
        case 'reason':
            setReason(value);
            break;
        default:
            break;
    }
    validateField(field, value, entryType, setErrors);
};