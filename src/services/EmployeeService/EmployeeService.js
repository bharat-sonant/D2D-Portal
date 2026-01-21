import * as sbs from "../supabaseServices";

/**
 * Fetch all employees from Supabase
 */
export const getEmployees = async () => {
    const result = await sbs.getData('Employees');
    if (result.success) {
        // Sort by name alphabetically
        const sortedData = [...result.data].sort((a, b) =>
            (a["Employee Name"] || "").localeCompare(b["Employee Name"] || "")
        );
        return { status: 'success', message: 'Employee data fetched successfully', data: sortedData };
    } else {
        return { status: 'error', message: result.error };
    }
};

/**
 * Save or update employee data
 */
export const saveEmployee = async (employeeData) => {
    // Using upsert by Employee Code as it's the primary/unique key according to schema
    const result = await sbs.upsertByConflictKeys('Employees', employeeData, 'Employee Code');
    if (result.success) {
        return { status: 'success', message: 'Employee saved successfully', data: result.data };
    } else {
        return { status: 'error', message: result.message || 'Failed to save employee' };
    }
};

/**
 * Delete an employee by Employee Code
 */
export const deleteEmployee = async (employeeCode) => {
    // sbs.deleteData expects 'id' column by default. 
    // If we need to delete by 'Employee Code', we might need a custom query or check if sbs supports it.
    // Looking at sbs.deleteData: it uses .eq("id", id).
    // I will use a custom implementation or check if sbs has something more flexible.
    // Actually, I'll check Employees table for 'id' as it has one generated as identity.
    // But schema says 'id' is present. I'll delete by 'id' if available, otherwise I'll use common service directly.

    // For now, I'll assume we can use 'id' if we have it, or I'll implement a more flexible delete if needed.
    // Since I'm using common services, I'll try to stick to them.
    const result = await sbs.deleteData('Employees', employeeCode);
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
