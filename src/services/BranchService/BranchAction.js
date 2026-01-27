import api from "../../api/api";
// import * as BranchService from "./BranchService"; // Old service, no longer needed
// import * as common from "../../common/common"; // Old utilities, commented out

/**
 * Action to fetch branches and update state
 */
export const getBranchesAction = async (setBranches, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        // Old code:
        // const response = await BranchService.getBranches();
        const response = await api.get('branches'); // Updated for new NestJS backend
        console.log('response', response);
        if (response.success) {
            setBranches(response.data || []);
        } else {
            console.error('Error fetching branches:', response?.message || 'Unknown error');
            setBranches([]); // Ensure branches state is valid even on error
        }
    } catch (error) {
        console.error('Exception in getBranchesAction:', error);
        setBranches([]);
    } finally {
        if (setLoading) setLoading(false);
    }
};

/**
 * Action to save a branch (add or edit)
 */
export const saveBranchAction = async (branchData, onSuccess, onError) => {
    try {
        let response;
        if (branchData.id) {
            // Update existing branch
            response = await api.patch(`branches/${branchData.id}`, branchData);
        } else {
            // Create new branch
            response = await api.post('branches/create', branchData);
        }

        if (response && response.success) {
            if (onSuccess) onSuccess(response.message);
        } else {
            const msg = response?.message || 'Failed to save branch';
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || 'An unexpected error occurred during save');
    }
};

/**
 * Action to delete a branch
 */
export const deleteBranchAction = async (branchId, onSuccess, onError) => {
    try {
        // Old code:
        // const response = await BranchService.deleteBranch(branchId);
        const response = await api.delete(`branches/${branchId}`);
        if (response && response.success) {
            if (onSuccess) onSuccess(response.message);
        } else {
            const msg = response?.message || 'Failed to delete branch';
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || 'An unexpected error occurred during delete');
    }
};

/**
 * Validate branch details before saving
 */
export const validateBranchDetail = ({
    form,
    setNameError,
    setCodeError,
    setAddressError,
    setLoading,
    onSuccess,
    onError,
}) => {
    let isValid = true;
    setNameError('');
    setCodeError('');
    setAddressError('');

    if (!form.name || !form.name.toString().trim()) {
        setNameError('Branch name is required');
        isValid = false;
    }
    if (!form.code || !form.code.toString().trim()) {
        setCodeError('Branch code is required');
        isValid = false;
    }
    if (!form.address || !form.address.toString().trim()) {
        setAddressError('Address is required');
        isValid = false;
    }

    if (isValid) {
        setLoading(true);
        saveBranchAction(
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
