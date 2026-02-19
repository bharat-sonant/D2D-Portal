import api from "../../../api/api";
import { setResponse } from "../../../common/common";

export const saveDesignationAction = (designationData, departmentId) => {
    return new Promise(async (resolve) => {
        try {
            if (designationData && departmentId) {
                const response = await api.post(`/designation/department/${departmentId}`, designationData);
                if (response.success) {
                    resolve(setResponse('success', "Designation data saved successfully.", response.data));
                } else {
                    resolve(setResponse('fail', response.message, {}));
                };
            } else {
                resolve(setResponse('fail', "Invalid Params !!!", { designationData, departmentId }));
            };
        } catch (error) {
            console.log('Error while saving designation.', error.message);
            resolve(setResponse('fail', error.message, {}));
        };
    });
};

export const updateDesignationAction = (designationId, designationData, departmentId) => {
    return new Promise(async (resolve) => {
        try {
            if (designationId && designationData && departmentId) {
                const response = await api.patch(`/designation/department/${departmentId}/${designationId}`, designationData);
                if (response.success) {
                    resolve(setResponse('success', "Designation data update successfully.", response.data));
                } else {
                    resolve(setResponse('fail', response.message, {}));
                }
            } else {
                resolve(setResponse('fail', "Invalid Params !!!", { designationData, departmentId, designationId }));
            };
        } catch (error) {
            console.log('Error while saving designation.', error.message);
            resolve(setResponse('fail', error.message, {}));
        };
    });
};

export const deleteDesignationAction = (designationId, departmentId) => {
    return new Promise(async (resolve) => {
        try {
            if (designationId && departmentId) {
                const response = await api.delete(`/designation/department/${departmentId}/${designationId}`);
                if (response.success) {
                    resolve(setResponse('success', "Designation deleted successfully.", response.data));
                } else {
                    resolve(setResponse('fail', response.message, {}));
                };
            } else {
                resolve(setResponse('fail', "Invalid Params !!!", { designationId, departmentId }));
            };
        } catch (error) {
            console.log('Error while saving designation.', error.message);
            resolve(setResponse('fail', error.message, {}));
        };
    });
};

export const getDesignationByDepartmentAction = async (departmentId) => {
    return new Promise(async (resolve) => {
        try {
            if (departmentId) {
                const response = await api.get(`/designation/department/${departmentId}`);
                if (response.success) {
                    resolve(setResponse('success', "Designation fetched successfully.", response.data));
                } else {
                    resolve(setResponse('fail', response.message, {}));
                };
            } else {
                resolve(setResponse('fail', "Invalid Params !!!", { departmentId }));
            };
        } catch (error) {
            console.log('Error while saving designation.', error.message);
            resolve(setResponse('fail', error.message, {}));
        };
    });
};