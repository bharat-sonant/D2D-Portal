import { setResponse } from '../../../common/common';
import * as db from '../../../services/dbServices';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';

const FILE = 'D2DMonitoringDutyIn';

export const subscribeWorkerDetailsFromDB = (year, month, day, ward, onData) => {
    if (!year || !month || !day || !ward) return () => {};
    return db.subscribeData(
        `WasteCollectionInfo/${ward}/${year}/${month}/${day}/WorkerDetails`,
        (data) => {
            if (!data) return;
            saveRealtimeDbServiceHistory(FILE, 'subscribeWorkerDetailsFromDB');
            saveRealtimeDbServiceDataHistory(FILE, 'subscribeWorkerDetailsFromDB', data);
            onData(data);
        }
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
                    saveRealtimeDbServiceHistory(FILE, 'getWorkerDetailsFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getWorkerDetailsFromDB', resp);
                    resolve(setResponse("Success", "Worker Details Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Worker Details Found !!", {}));
                }
            });
        } catch (error) {
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
                    saveRealtimeDbServiceHistory(FILE, 'getEmployeeGeneralDetailsFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getEmployeeGeneralDetailsFromDB', resp);
                    resolve(setResponse("Success", "Employee General Details Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Employee Details Found !!", {}));
                }
            });
        } catch (error) {
            resolve(setResponse("Fail", "Error fetching Employee General Details !!", error.message));
        }
    });
};

export const getHelperDummyFlagFromDB = async (employeeId) => {
    return new Promise((resolve) => {
        try {
            if (!employeeId) { resolve(null); return; }
            db.getData(`EmployeeDetailData/${employeeId}/isDummyId`).then((resp) => {
                if (resp !== null) {
                    saveRealtimeDbServiceHistory(FILE, 'getHelperDummyFlagFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getHelperDummyFlagFromDB', resp);
                }
                resolve(resp !== null ? resp : null);
            });
        } catch (error) {
            resolve(null);
        }
    });
};

export const getEmployeeAllDetailsFromDB = async (employeeId) => {
    return new Promise((resolve) => {
        try {
            if (!employeeId) {
                resolve(setResponse("Fail", "Invalid Params !!", { employeeId }));
                return;
            }
            db.getData(`Employees/${employeeId}`).then((resp) => {
                if (resp !== null) {
                    saveRealtimeDbServiceHistory(FILE, 'getEmployeeAllDetailsFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getEmployeeAllDetailsFromDB', resp);
                    resolve(setResponse("Success", "Employee Details Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Employee Found !!", {}));
                }
            });
        } catch (error) {
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
            }
            db.getData(`WasteCollectionInfo/${Ward}/${year}/${month}/${day}/Summary/dutyInTime`).then((resp) => {
                if (resp !== null) {
                    saveRealtimeDbServiceHistory(FILE, 'getWardDutyOnTimeFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getWardDutyOnTimeFromDB', resp);
                    resolve(setResponse("Success", "Duty In Time Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Duty In Time Found !!", {}));
                }
            });
        } catch (error) {
            resolve(setResponse("Fail", "Error fetching Duty In Time !!", error.message));
        }
    });
};

export const getWardReachedTimeFromDB = async (year, month, day, ward) => {
    return new Promise((resolve) => {
        try {
            if (!year || !month || !day || !ward) {
                resolve(setResponse("Fail", "Invalid Params !!", { year, month, day, ward }));
                return;
            }
            db.getData(`WasteCollectionInfo/${ward}/${year}/${month}/${day}/Summary/wardReachedOn`).then((resp) => {
                if (resp !== null) {
                    saveRealtimeDbServiceHistory(FILE, 'getWardReachedTimeFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getWardReachedTimeFromDB', resp);
                    resolve(setResponse("Success", "Ward Reached Time Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Ward Reached Time Found !!", {}));
                }
            });
        } catch (error) {
            resolve(setResponse("Fail", "Error fetching Ward Reached Time !!", error.message));
        }
    });
};

export const getWardDutyOffTimeFromDB = async (year, month, day, ward) => {
    return new Promise((resolve) => {
        try {
            if (!year || !month || !day || !ward) {
                resolve(setResponse("Fail", "Invalid Params !!", { year, month, day, ward }));
                return;
            }
            db.getData(`WasteCollectionInfo/${ward}/${year}/${month}/${day}/Summary/dutyOutTime`).then((resp) => {
                if (resp !== null) {
                    saveRealtimeDbServiceHistory(FILE, 'getWardDutyOffTimeFromDB');
                    saveRealtimeDbServiceDataHistory(FILE, 'getWardDutyOffTimeFromDB', resp);
                    resolve(setResponse("Success", "Duty Off Time Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Duty Off Time Found !!", {}));
                }
            });
        } catch (error) {
            resolve(setResponse("Fail", "Error fetching Duty Off Time !!", error.message));
        }
    });
};

export const getDutyInImageFromStorage = async (city, wardId, year, month, date) => {
    try {
        if (!city || !wardId || !year || !month || !date) return null;
        const filePath = `${city}/DutyOnImages/${wardId}/${year}/${month}/${date}/1.png`;
        const url = await db.getDownloadURLFromStorage(filePath);
        saveRealtimeDbServiceHistory(FILE, 'DutyInTimeImage');
        saveRealtimeDbServiceDataHistory(FILE, 'DutyInTimeImage', url);
        return url;
    } catch (error) {
        return null;
    }
};

export const getDutyOffImageFromStorage = async (city, wardId, year, month, date) => {
    try {
        if (!city || !wardId || !year || !month || !date) return null;
        const filePath = `${city}/DutyOutImages/${wardId}/${year}/${month}/${date}/1.png`;
        const url = await db.getDownloadURLFromStorage(filePath);
        saveRealtimeDbServiceHistory(FILE, 'DutyOffTimeImage');
        saveRealtimeDbServiceDataHistory(FILE, 'DutyOffTimeImage', url);
        return url;
    } catch (error) {
        return null;
    }
};
