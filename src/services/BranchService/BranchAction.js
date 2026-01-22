import * as BranchService from "./BranchService";
import * as common from "../../common/common";

/**
 * Action to fetch branches and update state
 */
export const getBranchesAction = async (setBranches, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        const response = await BranchService.getBranches();
        if (response && response.status === 'success') {
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
        const response = await BranchService.saveBranch(branchData);
        if (response && response.status === 'success') {
            if (onSuccess) onSuccess(response.message);
        } else {
            const msg = response?.message || 'Failed to save branch (No details)';
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
        const response = await BranchService.deleteBranch(branchId);
        if (response && response.status === 'success') {
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
    setManagerError,
    setCityError,
    setLoading,
    onSuccess,
    onError,
}) => {
    let isValid = true;
    setNameError('');
    setCodeError('');
    setAddressError('');
    setManagerError('');
    setCityError('');

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
    if (!form.manager_name || !form.manager_name.toString().trim()) {
        setManagerError('Manager name is required');
        isValid = false;
    }
    if (!form.city_id || !form.city_id.toString().trim()) {
        setCityError('City ID is required');
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
                // Simple error handling, could be expanded
                if (onError) onError(err);
            }
        );
    }
};
