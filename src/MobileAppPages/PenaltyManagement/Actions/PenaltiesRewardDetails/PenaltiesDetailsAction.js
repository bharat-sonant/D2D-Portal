import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getEmployees, getPenaltyType, getRewardType, savePaneltiesData } from "../../Services/Penalties/PenaltiesService";

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
            else if (isNaN(value) || Number(value) <= 0)
                error = 'Enter a valid amount.';
            break;
        case 'category':
            if (entryType && !value) {
                error =
                    entryType === 'Penalty'
                        ? 'Please select penalty type.'
                        : 'Please select reward type.';
            }
            break;
        case 'reason':
            if (!value) error = 'Reason is required.';
            else if (value.trim().length < 5)
                error = 'Reason must be at least 5 characters.';
            break;
        default:
            break;
    }

    // update error state
    setErrors((prev) => ({ ...prev, [name]: error }));

    // ✅ return boolean
    return error === ''; // true = valid, false = invalid
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

export const getEmployeesData = (setEmployees) => {
    getEmployees().then((response) => {
        if (response.status === 'success') {
            setEmployees(response.data.employees);
        } else {
            setEmployees([]);
        }
    })
}

export const getPenaltiesType = (setPenaltyType) => {
    getPenaltyType().then((respon) => {
        if (respon.status === 'success') {
            setPenaltyType(respon.data);
        } else {
            setPenaltyType([]);
        };
    });
};

export const getRewardTypes = (setRewardType) => {
    getRewardType().then((response) => {
        if (response.status === 'success') {
            setRewardType(response.data);
        } else {
            setRewardType([]);
        };
    });
};

export const handleSavePenaltiesData = async (props, employeeId, entryType, amount, category, reason, setErrors, handleClear, onBack) => {
    const fields = { entryType, amount, category, reason };

    let hasError = false;

    Object.entries(fields).forEach(([key, value]) => {
        const isValid = validateField(key, value, entryType, setErrors);
        if (!isValid) hasError = true;
    });

    if (hasError) {
        alert('❌ Please fill all required fields before saving.');
        return;
    }

    const penaltyId = ''

    const result = await savePaneltiesData(
        props.loggedInUserId,
        entryType,
        props.selectedDate,
        employeeId,
        amount,
        category,
        reason,
        penaltyId
    );

    if (result.status === 'success') {
        handleClear();
        onBack();
        toast.success('Successfully Created');
        setTimeout(() => {
            onBack();
        }, 8000);
    } else {

    }
}

export const handleClear = (
    setEmployee,
    setEntryType,
    setAmount,
    setCategory,
    setReason,
    setErrors
) => {
    setEmployee('');
    setEntryType('');
    setAmount('');
    setCategory('');
    setReason('');
    setErrors('');
};