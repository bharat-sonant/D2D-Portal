import * as common from "../../../common/common";
import * as service from "../../Service/Designation/DesignationService";

export const getInitialDepartmentForm = () => ({
    name: "",
    code: "",
});

export const getDepartmentFormFromData = (initialData) => {
    if (!initialData) return getInitialDepartmentForm();
    return {
        id: initialData.id,
        name: initialData.name || "",
        code: initialData.code || "",
        branch_id: initialData.branch_id ? String(initialData.branch_id) : "",
    };
};

export const handleDepartmentFormChange = (e, setForm, setErrors) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
};

export const handleDepartmentCodeInputChange = (value, setForm, setErrors) => {
    handleDepartmentFormChange({ target: { name: "code", value: value.toUpperCase() } }, setForm, setErrors);
};

export const initializeDepartmentForm = (showCanvas, initialData, setForm, setErrors, setLoader) => {
    if (!showCanvas) return;
    setForm(getDepartmentFormFromData(initialData));
    setErrors({});
    if (setLoader) setLoader(false);
};

export const getFilteredDepartments = (departmentData = [], searchQuery = "") => {
    const normalizedQuery = searchQuery.toLowerCase();
    return departmentData.filter((dept) =>
        dept.name.toLowerCase().includes(normalizedQuery) ||
        dept.code.toLowerCase().includes(normalizedQuery)
    );
};

export const openDepartmentAddModal = (setSelectedDepartment, setShowAddModal) => {
    setSelectedDepartment(null);
    setShowAddModal(true);
};

export const openDepartmentEditModal = (e, dept, setSelectedDepartment, setShowAddModal) => {
    e.stopPropagation();
    setSelectedDepartment(dept);
    setShowAddModal(true);
};

export const openDepartmentDeleteModal = (e, dept, setSelectedDepartment, setShowDeleteModal) => {
    e.stopPropagation();
    setSelectedDepartment(dept);
    setShowDeleteModal(true);
};

export const validateDepartmentForm = (form) => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Department name is required";
    else if (!/^[A-Za-z0-9 &]+$/.test(form.name)) newErrors.name = "Invalid characters in name";
    if (!form.code) newErrors.code = "Department code is required";
    else if (!/^[A-Z0-9-]+$/.test(form.code)) newErrors.code = "Code must be uppercase letters, numbers and hyphens";
    return newErrors;
};

export const submitDepartmentForm = async (form, initialData, setErrors, setForm, setShowCanvas, setLoader, onSuccess) => {
    const newErrors = validateDepartmentForm(form);
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const first = newErrors[Object.keys(newErrors)[0]];
        common.setAlertMessage("error", first);
        setLoader(false);
        return;
    }
    setLoader(true);

    const payload = {
        name: form.name,
        code: form.code,
    };

    try {
        if (initialData && initialData.id) {
            const result = await service.updateDepartment(initialData.id, payload);
            if (result?.status === "success") {
                const responseData = Array.isArray(result.data) ? result.data[0] : result.data;
                const updatedDepartment = {
                    ...(initialData || {}),
                    ...(responseData || {}),
                    id: responseData?.id || initialData.id,
                    name: responseData?.name || payload.name,
                    code: responseData?.code || payload.code,
                };
                setForm(getInitialDepartmentForm());
                setErrors({});
                setShowCanvas(false);
                common.setAlertMessage("success", "Department updated successfully");
                onSuccess && onSuccess(updatedDepartment, "edit");
            } else {
                setErrors((prev) => ({
                    ...prev,
                    name: result?.message || "Unable to update department. Try again.",
                }));
            }
        } else {
            const result = await service.saveDepartment(payload);
            if (result?.status === "success") {
                const responseData = Array.isArray(result.data) ? result.data[0] : result.data;
                const savedDepartment = {
                    ...(responseData || {}),
                    id: responseData?.id,
                    name: responseData?.name || payload.name,
                    code: responseData?.code || payload.code,
                };
                setForm(getInitialDepartmentForm());
                setErrors({});
                setShowCanvas(false);
                common.setAlertMessage("success", "Department added successfully");
                onSuccess && onSuccess(savedDepartment, "add");
            } else {
                setErrors((prev) => ({
                    ...prev,
                    name: result?.message || "Unable to add department. Try again.",
                }));
            }
        }
    } finally {
        setLoader(false);
    }
};

export const deleteDepartmentData = async (selectedDepartment, setShowDeleteModal, setSelectedDepartment, onSuccess) => {
    if (!selectedDepartment?.id) return;
    const response = await service.deleteDepartment(selectedDepartment.id);
    if (response.status === 'success') {
        common.setAlertMessage("success", "Department deleted successfully");
        onSuccess && onSuccess(selectedDepartment.id);
    } else {
        common.setAlertMessage("error", response.message);
    }
    setShowDeleteModal(false);
    setSelectedDepartment(null);
}

export const getAllDepartmentData = (setDepartmentData, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        service.getDepartments().then((resp) => {
            console.log(resp)
            if (resp.status === 'success') {
                setDepartmentData(resp.data)
            } else {
                setDepartmentData([])
            };
        }).finally(() => {
            if (setLoading) setLoading(false);
        });
    } catch (error) {
        console.log(error)
        if (setLoading) setLoading(false);
    };
};
