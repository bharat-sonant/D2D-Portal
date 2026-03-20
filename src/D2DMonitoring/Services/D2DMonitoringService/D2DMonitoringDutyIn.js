import { setResponse } from '../../../common/common';
import * as db from '../../../services/dbServices';

export const subscribeWorkerDetailsFromDB = (year, month, day, ward, onData) => {
    if (!year || !month || !day || !ward) return () => {};
    return db.subscribeData(
        `WasteCollectionInfo/${ward}/${year}/${month}/${day}/WorkerDetails`,
        (data) => { if (data) onData(data); }
    );
};

export const getWorkerDetailsFromDB = async (year, month, day, ward) => {
    return new Promise((resolve) => {
        try {
            if (!year || !month || !day || !ward) {
                resolve(setResponse("Fail", "Invalid Params !!", { year, month, day, ward }));
                return;
            }
            db.getData(`WasteCollectionInfo/${ward}/${year}/${month}/${day}/WorkerDetails`).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Worker Details Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Worker Details Found !!", {}));
                }
            });
        } catch (error) {
            console.error("Error fetching Worker Details: ", error);
            resolve(setResponse("Fail", "Error fetching Worker Details !!", error.message));
        }
    });
};

export const getEmployeeGeneralDetailsFromDB = async (employeeId) => {
    return new Promise((resolve) => {
        try {
            if (!employeeId) {
                resolve(setResponse("Fail", "Invalid Params !!", { employeeId }));
                return;
            }
            db.getData(`Employees/${employeeId}/GeneralDetails`).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Employee General Details Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Employee Details Found !!", {}));
                }
            });
        } catch (error) {
            console.error("Error fetching Employee General Details: ", error);
            resolve(setResponse("Fail", "Error fetching Employee General Details !!", error.message));
        }
    });
};

/**
 * Fetches the full Employees/{id} parent node so DOJ can be found
 * in any sub-node (GeneralDetails, OfficialDetails, PersonalDetails, etc.)
 */
export const getEmployeeAllDetailsFromDB = async (employeeId) => {
    return new Promise((resolve) => {
        try {
            if (!employeeId) {
                resolve(setResponse("Fail", "Invalid Params !!", { employeeId }));
                return;
            }
            db.getData(`Employees/${employeeId}`).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Employee Details Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Employee Found !!", {}));
                }
            });
        } catch (error) {
            console.error("Error fetching Employee Details: ", error);
            resolve(setResponse("Fail", "Error fetching Employee Details !!", error.message));
        }
    });
};

export const getWardDutyOnTimeFromDB = async (year, month, day, Ward) => {
    return new Promise((resolve) => {
        try {
            if (!year || !month || !day || !Ward) {
                resolve(setResponse("Fail", "Invalid Params !!", { year, month, day, Ward }));
                return;
            };

            db.getData(`WasteCollectionInfo/${Ward}/${year}/${month}/${day}/Summary/dutyInTime`).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Duty In Time Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Duty In Time Found !!", {}));
                }
            })
        } catch (error) {
            console.error("Error fetching Duty In Time: ", error);
            resolve(setResponse("Fail", "Error fetching Duty In Time !!", error.message));
        };
    });
};