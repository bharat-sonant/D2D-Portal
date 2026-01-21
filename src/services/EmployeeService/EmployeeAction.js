import * as EmployeeService from "./EmployeeService";

/**
 * Action to fetch employees and update state
 */
export const getEmployeesAction = async (setEmployees, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        const response = await EmployeeService.getEmployees();
        if (response.status === 'success') {
            setEmployees(response.data);
        } else {
            console.error("Error fetching employees:", response.message);
        }
    } catch (error) {
        console.error("Exception in getEmployeesAction:", error);
    } finally {
        if (setLoading) setLoading(false);
    }
};

/**
 * Action to save employee (Add or Edit)
 */
export const saveEmployeeAction = async (employeeData, onSuccess, onError) => {
    try {
        const response = await EmployeeService.saveEmployee(employeeData);
        if (response.status === 'success') {
            if (onSuccess) onSuccess(response.message);
        } else {
            if (onError) onError(response.message);
        }
    } catch (error) {
        if (onError) onError(error.message || "An unexpected error occurred");
    }
};

/**
 * Action to delete employee
 */
export const deleteEmployeeAction = async (employeeId, onSuccess, onError) => {
    try {
        const response = await EmployeeService.deleteEmployee(employeeId);
        if (response.status === 'success') {
            if (onSuccess) onSuccess(response.message);
        } else {
            if (onError) onError(response.message);
        }
    } catch (error) {
        if (onError) onError(error.message || "An unexpected error occurred");
    }
};

/**
 * Action to fetch branches for dropdown
 */
export const getBranchesAction = async (setBranches) => {
    try {
        const response = await EmployeeService.getBranches();
        if (response.status === 'success') {
            setBranches(response.data);
        }
    } catch (error) {
        console.error("Error in getBranchesAction:", error);
    }
};
