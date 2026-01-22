import * as sbs from "../supabaseServices";

/**
 * Fetch all departments from Supabase
 */
export const getDepartments = async () => {
    const result = await sbs.getData('Departments');
    if (result.success) {
        // Sort by name alphabetically
        const sortedData = [...result.data].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        return { status: 'success', message: 'Departments fetched successfully', data: sortedData };
    } else {
        return { status: 'error', message: result.error };
    }
};

/**
 * Save (insert or update) a department.
 */
export const saveDepartment = async (deptData) => {
    const userId = localStorage.getItem('userId');
    const createdBy = deptData.id ? deptData.created_by : userId;
    const nowIso = new Date().toISOString();

    const dataToSave = {
        ...deptData,
        branch_id: deptData.branch_id ? parseInt(deptData.branch_id, 10) : null,
        created_by: createdBy ? parseInt(createdBy, 10) : null,
        updated_by: userId ? parseInt(userId, 10) : null,
        status: deptData.status ?? true,
        created_at: deptData.id ? deptData.created_at : nowIso,
        updated_at: nowIso
    };

    let result;
    if (deptData.id) {
        // Update existing department
        result = await sbs.updateData('Departments', 'id', deptData.id, dataToSave);
    } else {
        // Insert new department
        result = await sbs.saveData('Departments', dataToSave);
    }

    if (result.success) {
        return { status: 'success', message: 'Department saved successfully', data: result.data };
    } else {
        console.error("DepartmentService save error:", result.error);
        const errorMsg = typeof result.error === 'object' ? (result.error.message || JSON.stringify(result.error)) : result.error;
        return { status: 'error', message: errorMsg || 'Failed to save department' };
    }
};

/**
 * Delete a department by its id.
 */
export const deleteDepartment = async (id) => {
    const result = await sbs.deleteData('Departments', id);
    if (result.success) {
        return { status: 'success', message: 'Department deleted successfully' };
    } else {
        return { status: 'error', message: result.error };
    }
};
