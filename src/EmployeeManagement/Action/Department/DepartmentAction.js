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