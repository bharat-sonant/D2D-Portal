import api from "../../../api/api";

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
