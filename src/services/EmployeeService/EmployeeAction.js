import * as EmployeeService from "./EmployeeService";
import * as common from "../../common/common";

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
 * Validates employee details before saving
 */
export const validateEmployeeDetail = ({
    form,
    setNameError,
    setPhoneError,
    setEmpCodeError,
    setBranchError,
    setEmailError,
    setLoading,
    onSuccess,
    onError
}) => {
    let isValid = true;
    setNameError("");
    setPhoneError("");
    setEmpCodeError("");
    setBranchError("");
    setEmailError("");

    if (!form.employee_name || !form.employee_name.toString().trim()) {
        setNameError("Employee Name is required");
        isValid = false;
    }
    if (!form.employee_code || !form.employee_code.toString().trim()) {
        setEmpCodeError("Employee Code is required");
        isValid = false;
    }
    if (!form.phone_number || !form.phone_number.toString().trim()) {
        setPhoneError("Phone Number is required");
        isValid = false;
    } else if (form.phone_number.toString().trim().length < 10) {
        setPhoneError("Valid 10-digit Phone Number is required");
        isValid = false;
    }
    if (!form.branch_id) {
        setBranchError("Branch is required");
        isValid = false;
    }
    if (form.email && form.email.toString().trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.toString().trim())) {
        setEmailError("Please enter a valid email address");
        isValid = false;
    }

    if (isValid) {
        setLoading(true);
        saveEmployeeAction(
            form,
            (msg) => {
                setLoading(false);
                if (onSuccess) onSuccess(msg);
            },
            (err) => {
                setLoading(false);
                if (err.includes("employee_code")) {
                    setEmpCodeError("Employee Code already exists");
                } else if (err.includes("phone_number")) {
                    setPhoneError("Phone Number already exists");
                } else if (err.includes("email")) {
                    setEmailError("Email already exists");
                } else {
                    if (onError) onError(err);
                }
            }
        );
    }
};

/**
 * Handles form field changes and clears respective errors
 */
export const employeeFormValueChangeAction = (e, setForm, errorSetters) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear errors when user types
    if (errorSetters[name]) {
        errorSetters[name]("");
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
