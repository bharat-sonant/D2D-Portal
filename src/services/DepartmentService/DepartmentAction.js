import * as DepartmentService from "./DepartmentService";

/**
 * Action to fetch departments and update state
 */
export const getDepartmentsAction = async (setDepartments, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        const response = await DepartmentService.getDepartments();
        if (response && response.status === 'success') {
            setDepartments(response.data || []);
        } else {
            console.error('Error fetching departments:', response?.message || 'Unknown error');
            setDepartments([]);
        }
    } catch (error) {
        console.error('Exception in getDepartmentsAction:', error);
        setDepartments([]);
    } finally {
        if (setLoading) setLoading(false);
    }
};

/**
 * Action to save a department (add or edit)
 */
export const saveDepartmentAction = async (deptData, onSuccess, onError) => {
    try {
        const response = await DepartmentService.saveDepartment(deptData);
        if (response && response.status === 'success') {
            if (onSuccess) onSuccess(response.message);
        } else {
            const msg = response?.message || 'Failed to save department (No details)';
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || 'An unexpected error occurred during save');
    }
};

/**
 * Action to delete a department
 */
export const deleteDepartmentAction = async (deptId, onSuccess, onError) => {
    try {
        const response = await DepartmentService.deleteDepartment(deptId);
        if (response && response.status === 'success') {
            if (onSuccess) onSuccess(response.message);
        } else {
            const msg = response?.message || 'Failed to delete department';
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || 'An unexpected error occurred during delete');
    }
};

/**
 * Validate department details before saving
 */
export const validateDepartmentDetail = ({
    form,
    setNameError,
    setCodeError,
    setBranchError,
    setLoading,
    onSuccess,
    onError,
}) => {
    let isValid = true;
    setNameError('');
    setCodeError('');

    if (!form.name || !form.name.toString().trim()) {
        setNameError('Department name is required');
        isValid = false;
    } else if (!/^[a-zA-Z0-9\s&]+$/.test(form.name)) {
        setNameError("Name can only contain letters, numbers, and spaces");
        isValid = false;
    }

    if (!form.branch_id) {
        setBranchError('Please select a branch');
        isValid = false;
    }

    if (!form.code || !form.code.toString().trim()) {
        setCodeError('Department code is required');
        isValid = false;
    } else if (!/^[A-Z0-9-]+$/.test(form.code)) {
        setCodeError("Code must be uppercase letters, numbers, or hyphens");
        isValid = false;
    }

    if (isValid) {
        setLoading(true);
        saveDepartmentAction(
            form,
            (msg) => {
                setLoading(false);
                if (onSuccess) onSuccess(msg);
            },
            (err) => {
                setLoading(false);
                if (onError) onError(err);
            }
        );
    }
};
