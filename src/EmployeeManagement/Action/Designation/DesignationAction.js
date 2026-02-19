import * as service from '../../Service/Department/DepartmentService';

export const validateDesignationDetail = (form, designationId, setNameError, setLoading, departmentId, setForm, setShowCanvas) => {
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
                    setForm({ name: '' });
                    setLoading(false);
                    setShowCanvas(false);
                } else {
                    setLoading(false);
                    setNameError(response.messsage);
                };
            });
        } else {
            service.saveDesignationAction(payload, departmentId, setNameError).then((response) => {
                if (response.status === 'success') {
                    setForm({ name: '' });
                    setLoading(false);
                    setShowCanvas(false);
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

export const handleDesignationDelete = (selectedDesignation, departmentId, setIsDeleting, setShowDeleteDesignation) => {
    setIsDeleting(true);

    service.deleteDesignationAction(selectedDesignation?.id, departmentId).then((resp) => {
        if (resp.status === 'success') {
            setIsDeleting(false);
            setShowDeleteDesignation(false);
        } else {
            setIsDeleting(false);
        }
    })
};
