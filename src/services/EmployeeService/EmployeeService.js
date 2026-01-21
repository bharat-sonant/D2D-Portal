import * as sbs from "../supabaseServices";

/**
 * Fetch all employees from Supabase
 */
export const getEmployees = async () => {
    const result = await sbs.getData('Employees');
    if (result.success) {
        // Sort by employee_name alphabetically
        const sortedData = [...result.data].sort((a, b) =>
            (a.employee_name || "").localeCompare(b.employee_name || "")
        );
        return { status: 'success', message: 'Employee data fetched successfully', data: sortedData };
    } else {
        return { status: 'error', message: result.error };
    }
};

export const saveEmployee = async (employeeData) => {
    // Add created_at if it's a new record, and ensure status is present
    const dataToSave = {
        ...employeeData,
        status: employeeData.status ?? true,
        created_at: employeeData.created_at || new Date().toISOString()
    };

    // Using upsert by employee_code as it's the primary/unique key according to schema
    const result = await sbs.upsertByConflictKeys('Employees', dataToSave, 'employee_code');
    if (result.success) {
        return { status: 'success', message: 'Employee saved successfully', data: result.data };
    } else {
        return { status: 'error', message: result.message || 'Failed to save employee' };
    }
};

/**
 * Delete an employee by Employee Code
 */
/**
 * Delete an employee by id
 */
export const deleteEmployee = async (id) => {
    // Using the common deleteData which uses the 'id' column
    const result = await sbs.deleteData('Employees', id);
    if (result.success) {
        return { status: 'success', message: 'Employee deleted successfully' };
    } else {
        return { status: 'error', message: result.error };
    }
};

/**
 * Fetch branches for dropdown
 */
export const getBranches = async () => {
    const result = await sbs.getData('Branches');
    if (result.success) {
        const sortedData = [...result.data].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
        );
        return { status: 'success', message: 'Branches fetched successfully', data: sortedData };
    } else {
        // Fallback or error
        return { status: 'error', message: result.error };
    }
};
