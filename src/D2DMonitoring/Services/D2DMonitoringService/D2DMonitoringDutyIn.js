import { setResponse } from '../../../common/common';
import * as db from '../../../services/dbServices';
import dayjs from 'dayjs';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';

const FILE = 'D2DMonitoringDutyIn';

export const subscribeWorkerDetailsFromDB = (year, month, day, ward, onData) => {
    if (!year || !month || !day || !ward) return () => {};
    return db.subscribeData( `WasteCollectionInfo/${ward}/${year}/${month}/${day}/WorkerDetails`, (data) => {
            onData(data ?? null);
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
                    saveRealtimeDbServiceHistory('EmployeeDetailServices', 'getWorkerDetails');
                    saveRealtimeDbServiceDataHistory('EmployeeDetailServices', 'getWorkerDetails', resp);
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
                    saveRealtimeDbServiceHistory('EmployeeDetailServices', 'getEmployeeGeneralDetailsFromDB');
                    saveRealtimeDbServiceDataHistory('EmployeeDetailServices', 'getEmployeeGeneralDetailsFromDB', resp);
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

export const getEmployeeProfilePhotoFromDB = async (employeeId) => {
    if (!employeeId) return null;
    const resp = await db.getData(`Employees/${employeeId}/GeneralDetails/profilePhotoURL`);
    if (resp) {
        saveRealtimeDbServiceHistory('EmployeeDetailServices', 'getEmployeeProfilePhotoFromDB');
        saveRealtimeDbServiceDataHistory('EmployeeDetailServices', 'getEmployeeProfilePhotoFromDB', resp);
    }
    return resp || null;
};

export const getEmployeeMobileFromDB = async (employeeId) => {
    if (!employeeId) return null;
    const resp = await db.getData(`Employees/${employeeId}/GeneralDetails/mobile`);
    if (resp) {
        saveRealtimeDbServiceHistory('EmployeeDetailServices', 'getEmployeeMobileFromDB');
        saveRealtimeDbServiceDataHistory('EmployeeDetailServices', 'getEmployeeMobileFromDB', resp);
    }
    return resp || null;
};

export const getHelperDummyFlagFromDB = async (employeeId) => {
    return new Promise((resolve) => {
        try {
            if (!employeeId) { resolve(null); return; }
            db.getData(`EmployeeDetailData/${employeeId}/isDummyId`).then((resp) => {
                if (resp !== null) {
                    saveRealtimeDbServiceHistory('EmployeeDetailServices', 'getHelperDummyFlagFromDB');
                    saveRealtimeDbServiceDataHistory('EmployeeDetailServices', 'getHelperDummyFlagFromDB', resp);
                }
                resolve(resp !== null ? resp : null);
            });
        } catch (error) {
            resolve(null);
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
                    saveRealtimeDbServiceHistory('WardServices', 'getWardDutyOnTimeFromDB');
                    saveRealtimeDbServiceDataHistory('WardServices', 'getWardDutyOnTimeFromDB', resp);
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
                    saveRealtimeDbServiceHistory('WardServices', 'getWardReachedTimeFromDB');
                    saveRealtimeDbServiceDataHistory('WardServices', 'getWardReachedTimeFromDB', resp);
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
                    saveRealtimeDbServiceHistory('WardServices', 'getWardDutyOffTimeFromDB');
                    saveRealtimeDbServiceDataHistory('WardServices', 'getWardDutyOffTimeFromDB', resp);
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
        saveRealtimeDbServiceHistory('WardServices', 'DutyInTimeImage');
        saveRealtimeDbServiceDataHistory('WardServices', 'DutyInTimeImage', url);
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
        saveRealtimeDbServiceHistory('WardServices', 'DutyOffTimeImage');
        saveRealtimeDbServiceDataHistory('WardServices', 'DutyOffTimeImage', url);
        return url;
    } catch (error) {
        return null;
    }
};

/**
 * Fetches remark categories from Firebase.
 * Handles both flat { id: "name" } and object { id: { name, image } } formats.
 * Returns an array of { id, name, image } objects.
 */
export const getRemarkCategoriesFromDB = async () => {
    try {
        const data = await db.getData('RemarkCategory');
        if (!data || typeof data !== 'object') return [];
        saveRealtimeDbServiceHistory('WardServices', 'getRemarkCategoriesFromDB');
        return Object.entries(data).map(([id, val]) => ({
            id,
            name: typeof val === 'string' ? val : (val?.name ?? val?.title ?? String(id)),
            image: typeof val === 'object' ? (val?.image ?? null) : null,
        }));
    } catch (error) {
        return [];
    }
};

// ── Remarks CRUD ─────────────────────────────────────────────────────────────

const getRemarkDateParts = () => ({
    year: dayjs().format('YYYY'),
    month: dayjs().format('MMMM'),
    date: dayjs().format('YYYY-MM-DD'),
});

const remarkPath = (wardId) => {
    const { year, month, date } = getRemarkDateParts();
    return `Remarks/${wardId}/${year}/${month}/${date}`;
};

export const subscribeRemarksFromDB = (wardId, onData) => {
    if (!wardId) return () => {};
    return db.subscribeData(remarkPath(wardId), (data) => {
        if (!data) { onData([]); return; }
        const list = Object.entries(data)
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        onData(list);
    });
};

export const saveRemarkToDB = async (wardId, remarkData) => {
    try {
        if (!wardId) return { success: false, message: 'No ward selected' };
        const payload = {
            ...remarkData,
            time: dayjs().format('h:mm:ss A'),
            createdAt: Date.now(),
        };
        const result = await db.pushData(remarkPath(wardId), payload);
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateRemarkInDB = async (wardId, remarkId, remarkData) => {
    try {
        if (!wardId || !remarkId) return { success: false, message: 'Invalid params' };
        const result = await db.saveData(`${remarkPath(wardId)}/${remarkId}`, remarkData);
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteRemarkFromDB = async (wardId, remarkId) => {
    try {
        if (!wardId || !remarkId) return { success: false, message: 'Invalid params' };
        const result = await db.removeData(`${remarkPath(wardId)}/${remarkId}`);
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
};
