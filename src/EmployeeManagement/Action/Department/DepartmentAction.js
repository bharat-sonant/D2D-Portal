import api from "../../../api/api";
import * as common from "../../../common/common";

export const getDepartments = async (setDepartmentData) => {
    try {
        const response = await api.get("/department");
        if (response.success) {
            setDepartmentData(response.data);
        } else {
            setDepartmentData([]);
        }

    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

export const addDepartment = async (departmentData, callback) => {
    try {
        const response = await api.post("/department", departmentData);
        console.log("Add Department Response:", response);
        if (response && response.success) {
            if (typeof callback === "function") callback(response.data);
            return response.data;
        } else {
            if (typeof callback === "function") callback(null);
            return null;
        }
    } catch (error) {
        console.error("Error adding department:", error);
        if (typeof callback === "function") callback(null);
        return null;
    }
};

export const updateDepartment = async (departmentId, departmentData, callback) => {
    try {
        const response = await api.patch(`/department/${departmentId}`, departmentData);
        console.log("Update Department Response:", response);
        if (response && response.success) {
            if (typeof callback === "function") callback(response.data);
            return response.data;
        } else {
            if (typeof callback === "function") callback(null);
            return null;
        }
    } catch (error) {
        console.error("Error updating department:", error);
        if (typeof callback === "function") callback(null);
        return null;
    }
};

export const getInitialDepartmentForm = () => ({
    name: "",
    code: "",
    branch_id: "",
});

export const getDepartmentFormFromData = (initialData) => {
    if (!initialData) return getInitialDepartmentForm();
    return {
        id: initialData.id,
        name: initialData.name || "",
        code: initialData.code || "",
        branch_id: initialData.branch_id || "",
    };
};

export const handleDepartmentFormChange = (e, setForm, setErrors) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
};

export const validateDepartmentForm = (form) => {
    const newErrors = {};
    if (!form.branch_id) newErrors.branch_id = "Branch is required";
    if (!form.name) newErrors.name = "Department name is required";
    else if (!/^[A-Za-z0-9 &]+$/.test(form.name)) newErrors.name = "Invalid characters in name";
    if (!form.code) newErrors.code = "Department code is required";
    else if (!/^[A-Z0-9-]+$/.test(form.code)) newErrors.code = "Code must be uppercase letters, numbers and hyphens";
    return newErrors;
};

export const submitDepartmentForm = async ({
    form,
    initialData,
    setErrors,
    setForm,
    setShowCanvas,
    onSuccess,
}) => {
    const newErrors = validateDepartmentForm(form);
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const first = newErrors[Object.keys(newErrors)[0]];
        common.setAlertMessage("error", first);
        return;
    }

    const payload = {
        name: form.name,
        code: form.code,
        branch_id: form.branch_id,
        icon: form.icon,
    };

    if (initialData && initialData.id) {
        const result = await updateDepartment(initialData.id, payload);
        if (result) {
            setForm(getInitialDepartmentForm());
            setErrors({});
            setShowCanvas(false);
            if (typeof onSuccess === "function") onSuccess(result);
            common.setAlertMessage("success", "Department updated successfully");
        } else {
            common.setAlertMessage("error", "Unable to update department. Try again.");
        }
    } else {
        const result = await addDepartment(payload);
        if (result) {
            setForm(getInitialDepartmentForm());
            setErrors({});
            setShowCanvas(false);
            if (typeof onSuccess === "function") onSuccess(result);
            common.setAlertMessage("success", "Department added successfully");
        } else {
            common.setAlertMessage("error", "Unable to save department. Try again.");
        }
    }
};
