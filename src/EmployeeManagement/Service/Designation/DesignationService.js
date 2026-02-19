import api from "../../../api/api";
import * as common from "../../../common/common";

export const getDepartments = () => {
    return new Promise(async (resolve) => {
        try {
            const response = await api.get("/department");
            if (response.success) {
                resolve(common.setResponse('success', 'Department data fetched successfully.', response.data));
            } else {
                resolve(common.setResponse('success', 'Department data fetched successfully.', response.message));
            };
        } catch (error) {
            console.error("Error fetching departments:", error);
            resolve(common.setResponse('success', 'Department data fetched successfully.', error.message));
        };
    });
};

export const updateDepartment = (departmentId, departmentData) => {
    return new Promise(async (resolve) => {
        try {
            if (departmentId && departmentData) {
                const response = await api.patch(`/department/${departmentId}`, departmentData);
                if (response.success) {
                    resolve(common.setResponse('success', "Department update successfully.", response.data));
                } else {
                    resolve(common.setResponse('fail', response.message))
                };
            } else {
                resolve(common.setResponse('fail', 'Invalid Params !!!', { departmentData, departmentId }));
            };
        } catch (error) {
            console.error("Error updating department:", error);
            resolve(common.setResponse('fail', error.message));
        };
    });
};

export const deleteDepartment = async (departmentId) => {
    return new Promise(async (resolve) => {
        try {
            if (departmentId) {
                const response = await api.delete(`/department/${departmentId}`);
                if (response.success) {
                    resolve(common.setResponse('success', "Department deleted successfully.", response.data));
                } else {
                    resolve(common.setResponse('fail', response.message));
                };
            } else {
                resolve(common.setResponse('fail', "Invalid Params!!!", { departmentId }));
            };
        } catch (error) {
            console.error("Error deleting department:", error);
            resolve(common.setResponse('fail', error.message));
        };
    });
};

export const saveDepartment = async (departmentData) => {
    return new Promise(async (resolve) => {
        try {
            if (departmentData) {
                const response = await api.post("/department", departmentData);
                if (response.success) {
                    resolve(common.setResponse('success', "Department data saved successfully.", response.data));
                } else {
                    resolve(common.setResponse('fail', response.message));
                };
            } else {
                resolve(common.setResponse('fail', "Invalid Params !!!", { departmentData }));
            };
        } catch (error) {
            console.error("Error adding department:", error);
            resolve(common.setResponse('fail', error.message));
        };
    });
};