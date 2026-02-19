import * as service from '../../Service/Department/DepartmentService';

export const initializeDesignationForm = (showCanvas, initialData, setForm, setNameError, setLoading) => {
    if (!showCanvas) return;
    setForm({ name: initialData?.name || "" });
    setNameError("");
    if (setLoading) setLoading(false);
};

export const handleDesignationNameChange = (value, setForm, setNameError) => {
    setForm({ name: value });
    setNameError("");
};

export const getDesignationId = (item) => item?.id || item?.designation_id;

export const openDesignationEditModal = (item, setSelectedDesignation, setShowAddDesignation) => {
    setSelectedDesignation(item);
    setShowAddDesignation(true);
};

export const openDesignationDeleteModal = (item, setSelectedDesignation, setShowDeleteDesignation) => {
    setSelectedDesignation(item);
    setShowDeleteDesignation(true);
};

export const openDesignationAddModal = (setSelectedDesignation, setShowAddDesignation) => {
    setSelectedDesignation(null);
    setShowAddDesignation(true);
};

export const removeDesignationFromList = (designationItems, deletedId) => {
    return designationItems.filter((item) => String(getDesignationId(item)) !== String(deletedId));
};

export const upsertDesignationInList = (designationItems, designationItem, mode) => {
    const normalizedId = getDesignationId(designationItem);
    if (!normalizedId) return designationItems;

    if (mode === "edit") {
        return designationItems.map((item) =>
            String(getDesignationId(item)) === String(normalizedId)
                ? { ...item, ...designationItem }
                : item
        );
    }

    const exists = designationItems.some((item) => String(getDesignationId(item)) === String(normalizedId));
    if (exists) return designationItems;
    return [designationItem, ...designationItems];
};

export const validateDesignationDetail = (form, designationId, setNameError, setLoading, departmentId, setForm, setShowCanvas, onSuccess) => {
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
        const payload = { name: trimmedName }

        if (designationId) {
            service.updateDesignationAction(designationId, payload, departmentId, setNameError).then((response) => {
                if (response.status === 'success') {
                    const responseData = Array.isArray(response.data) ? response.data[0] : response.data;
                    const updatedItem = {
                        ...(responseData || {}),
                        id: responseData?.id || designationId,
                        designation_id: responseData?.designation_id || designationId,
                        name: responseData?.name || trimmedName,
                    };
                    setForm({ name: '' });
                    setLoading(false);
                    setShowCanvas(false);
                    import("../../../common/common").then(common => {
                        common.setAlertMessage("success", "Designation updated successfully");
                    });
                    onSuccess && onSuccess(updatedItem, "edit");
                } else {
                    setLoading(false);
                    setNameError(response.message);
                };
            });
        } else {
            service.saveDesignationAction(payload, departmentId, setNameError).then((response) => {
                if (response.status === 'success') {
                    const responseData = Array.isArray(response.data) ? response.data[0] : response.data;
                    const savedItem = {
                        ...(responseData || {}),
                        id: responseData?.id || responseData?.designation_id,
                        designation_id: responseData?.designation_id || responseData?.id,
                        name: responseData?.name || trimmedName,
                    };
                    setForm({ name: '' });
                    setLoading(false);
                    setShowCanvas(false);
                    import("../../../common/common").then(common => {
                        common.setAlertMessage("success", "Designation added successfully");
                    });
                    onSuccess && onSuccess(savedItem, "add");
                } else {
                    setLoading(false);
                    setNameError(response.message);
                };
            });
        };
    };
};

export const getDesignationByDepartment = (departmentId, setDesignationItems, setLoading) => {
    service.getDesignationByDepartmentAction(departmentId).then((response) => {
        if (response.status === 'success') {
            setDesignationItems(response.data);
            setLoading(false);
        } else {
            setDesignationItems([]);
            setLoading(false);
        };
    });
};

export const handleDesignationDelete = (selectedDesignation, departmentId, setIsDeleting, setShowDeleteDesignation, onSuccess) => {
    setIsDeleting(true);
    const designationId = selectedDesignation?.id || selectedDesignation?.designation_id;

    service.deleteDesignationAction(designationId, departmentId).then((resp) => {
        if (resp.status === 'success') {
            setIsDeleting(false);
            setShowDeleteDesignation(false);
            import("../../../common/common").then(common => {
                common.setAlertMessage("success", "Designation deleted successfully");
            });
            onSuccess && onSuccess(designationId);
        } else {
            setIsDeleting(false);
        }
    })
};
