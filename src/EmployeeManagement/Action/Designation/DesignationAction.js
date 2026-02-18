import api from "../../../api/api";
import * as common from "../../../common/common";

export const saveDesignationAction = async (designationData, departmentId = '12', onSuccess, onError) => {
    try {
        const response = await api.post(`/designation/department/${departmentId}`, designationData);
        if (response && response.success) {
            if (onSuccess) onSuccess(response.message || "Designation saved successfully");
        } else {
            const msg = response?.message || "Failed to save designation";
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || "An unexpected error occurred during save");
    }
};

export const updateDesignationAction = async (designationId, designationData, departmentId = '12', onSuccess, onError) => {
    try {
        const response = await api.patch(`/designation/department/${departmentId}/${designationId}`, designationData);
        if (response && response.success) {
            if (onSuccess) onSuccess(response.message || "Designation updated successfully");
        } else {
            const msg = response?.message || "Failed to update designation";
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || "An unexpected error occurred during update");
    }
};

export const deleteDesignationAction = async (designationId, departmentId = '12', onSuccess, onError) => {
    try {
        const response = await api.delete(`/designation/department/${departmentId}/${designationId}`);
        if (response && response.success) {
            if (onSuccess) onSuccess(response.message || "Designation deleted successfully");
        } else {
            const msg = response?.message || "Failed to delete designation";
            if (onError) onError(msg);
        }
    } catch (error) {
        if (onError) onError(error.message || "An unexpected error occurred during delete");
    }
};

export const validateDesignationDetail = ({ form, designationId, setNameError, setLoading, departmentId = 12, onSuccess, onError }) => {
    let isValid = true;
    setNameError("");

    const trimmedName = form?.name?.trim() || "";

    if (!trimmedName) {
        setNameError("Designation name is required");
        isValid = false;
    } else if (trimmedName.length < 2) {
        setNameError("Designation name must be at least 2 characters");
        isValid = false;
    } else if (trimmedName.length > 100) {
        setNameError("Designation name must be less than 100 characters");
        isValid = false;
    }

    if (isValid) {
        setLoading(true);
        const payload = { name: trimmedName };
        const successHandler = (msg) => {
            setLoading(false);
            if (onSuccess) onSuccess(msg);
        };
        const errorHandler = (err) => {
            setLoading(false);
            if (onError) onError(err);
            else setNameError(err);
        };

        if (designationId) {
            updateDesignationAction(designationId, payload, departmentId, successHandler, errorHandler);
        } else {
            saveDesignationAction(payload, departmentId, successHandler, errorHandler);
        }
    };
};

export const getDesignationByDepartmentAction = async (departmentId = 12, setDesignationList, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        const response = await api.get(`/designation/department/${departmentId}`);
        const list = Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.designations) ? response.data.designations : [];
        setDesignationList(list);
    } catch (error) {
        setDesignationList([]);
    } finally {
        if (setLoading) setLoading(false);
    }
};

export const handleDesignationDelete = ({ selectedDesignation, departmentId = 12, setIsDeleting, setShowDeleteDesignation, onSuccessRefresh }) => {
    const designationId = selectedDesignation?.id || null

    if (!designationId) {
        common.setAlertMessage("error", "Designation ID not found");
        return;
    }

    setIsDeleting(true);
    deleteDesignationAction(
        designationId,
        departmentId,
        (msg) => {
            setIsDeleting(false);
            setShowDeleteDesignation(false);
            common.setAlertMessage("success", msg || "Designation deleted successfully");
            if (typeof onSuccessRefresh === "function") onSuccessRefresh();
        },
        (err) => {
            setIsDeleting(false);
            common.setAlertMessage("error", err || "Failed to delete designation");
        }
    );
};
