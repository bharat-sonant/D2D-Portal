import * as sbs from "../supabaseServices";

/**
 * Fetch all branches from Supabase
 */
export const getBranches = async () => {
    const result = await sbs.getData('Branches');
    if (result.success) {
        // Sort by name alphabetically
        const sortedData = [...result.data].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        return { status: 'success', message: 'Branches fetched successfully', data: sortedData };
    } else {
        return { status: 'error', message: result.error };
    }
};

/**
 * Save (insert or update) a branch. Uses upsert on the "code" column which is unique.
 */
export const saveBranch = async (branchData) => {
    // get user id from local storage
    const userId = localStorage.getItem('userId');
    const createdBy = branchData.id ? branchData.created_by : userId;
    const nowIso = new Date().toISOString();
    const timePart = nowIso.split('T')[1];

    const dataToSave = {
        name: branchData.name,
        code: branchData.code,
        address: branchData.address,
        created_by: createdBy ? parseInt(createdBy, 10) : null,
        updated_by: userId ? parseInt(userId, 10) : null,
        created_at: branchData.id ? branchData.created_at : nowIso,
        updated_at: timePart
    };

    let result;
    if (branchData.id) {
        // Update existing branch
        result = await sbs.updateData('Branches', 'id', branchData.id, dataToSave);
    } else {
        // Insert new branch
        result = await sbs.saveData('Branches', dataToSave);
    }

    if (result.success) {
        return { status: 'success', message: 'Branch saved successfully', data: result.data };
    } else {
        console.error("BranchService save error:", result.error);
        const errorMsg = typeof result.error === 'object' ? (result.error.message || JSON.stringify(result.error)) : result.error;
        return { status: 'error', message: errorMsg || 'Failed to save branch' };
    }
};

/**
 * Delete a branch by its id.
 */
export const deleteBranch = async (id) => {
    const result = await sbs.deleteData('Branches', id);
    if (result.success) {
        return { status: 'success', message: 'Branch deleted successfully' };
    } else {
        return { status: 'error', message: result.error };
    }
};
