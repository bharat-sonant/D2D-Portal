import * as db from '../../../../../services/dbServices';
import * as common from '../../../../../common/common';
import dayjs from 'dayjs';
import { getDateTimeDetails } from '../../../../services/UtilServices/DateTImeUtil';

export const getAllWards = async () => {
    return new Promise(async (resolve) => {
        try {
            const year = dayjs().format('YYYY');
            const month = dayjs().format('MMMM');
            const date = dayjs().format('YYYY-MM-DD');

            let path = `AssignmentData/AssignmentSummary/${year}/${month}/${date}/Task`;

            const promises = [db.getData(path)];
            const responses = await Promise.all(promises);
            const data = responses[0];

            if (data !== null) {
                const wardKeys = Object.keys(data);
                resolve(common.setResponse("success", "Ward list fetched successfully", { wardKeys }));
            } else {
                resolve(common.setResponse("fail", "No data found !!!", {}));
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
            resolve(common.setResponse('fail', "Something went wrong!", { error: error.message }));
        }
    });
};

export const checkNotAssignedKey = async () => {
    const year = dayjs().format('YYYY');
    const month = dayjs().format('MMMM');
    const date = dayjs().format('YYYY-MM-DD');

    const path = `AssignmentData/AssignmentSummary/${year}/${month}/${date}/NotAssigned`;
    try {
        const response = await db.getData(path);

        if (response !== null && response !== undefined) {
            return { success: true, data: response };
        } else {
            pushDataInAssignmentSummary();
            const wardsResponse = await getAllWards();
            return { success: false, data: wardsResponse };
        };
    } catch (error) {
        return { success: false, error: error.message };
    };
};

const pushDataInAssignmentSummary = () => {
    return new Promise((resolve) => {
        db.getData(`TaskData/Task`)
            .then(async (resp) => {
                if (resp !== null) {

                    const year = dayjs().format("YYYY");
                    const month = dayjs().format("MMMM");
                    const date = dayjs().format("YYYY-MM-DD");

                    const summaryTaskPath = `AssignmentData/AssignmentSummary/${year}/${month}/${date}/Task`;
                    const summaryNotAssignedPath = `AssignmentData/AssignmentSummary/${year}/${month}/${date}`;

                    const updatedObject = {};
                    const keys = Object.keys(resp);

                    let notAssignedCount = 0;

                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        const name = resp[key];

                        updatedObject[name] = "NotAssigned";
                        notAssignedCount++;
                    }

                    await db.saveData(summaryTaskPath, updatedObject);

                    await db.saveData(summaryNotAssignedPath, { NotAssigned: notAssignedCount });

                    resolve(common.setResponse("success", "TaskData & NotAssigned count saved successfully in AssignmentSummary", {}));
                } else {
                    resolve(common.setResponse("fail", "No TaskData found !!!", {}));
                }
            })
            .catch((err) => {
                console.log("Error occuring while saving/fetching: ", err);
                resolve(common.setResponse("fail", "No TaskData found !!!", {}));
            });
    });
};

export const getTaskStatus = async(ward) => {
    const { year, monthName, date, time, formattedDate } = getDateTimeDetails();
    return new Promise(async(resolve) => {
        try{    
            const path = `AssignmentData/AssignmentSummary/${year}/${monthName}/${date}/Task/${ward}`
            const result = await db.getData(path);

            resolve(common.setResponse("success", "task status fetched successfully", result))

        }catch(error){
            resolve(common.setResponse("fail", "failed to fetch task status"))
        }
    })
}

export const checkDailyAssignmentSummaryData = async() => {
    return new Promise(async(resolve)=> {
        try{
            const { year, monthName, date, time, formattedDate } = getDateTimeDetails();
            const path = `AssignmentData/DailyAssignmentSummary/${year}/${monthName}/${date}/Task`

            const response = await db.getData(path);
            if (response !== null && response !== undefined) {
            return { success: true, data: response };
        } else {
            await pushDataInDailyAssignmentSummary();
            
            return { success: false };
        };
    } catch (error) {
        return { success: false, error: error.message };
    };
    })
}

const pushDataInDailyAssignmentSummary = () => {
    return new Promise(async(resolve) => {
        await db.getData(`TaskData/Task`)
            .then(async (resp) => {
                if (resp !== null) {
                    const year = dayjs().format("YYYY");
                    const month = dayjs().format("MMMM");
                    const date = dayjs().format("YYYY-MM-DD");
                    const summaryTaskPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Task/NotAssigned`;
                    console.log(summaryTaskPath)
                    const converted = {};
                    resp.forEach((item, index) => {
                        converted[index] = item;
                    });

                    const result = await db.saveData(summaryTaskPath, converted);

                    resolve(common.setResponse("success", "TaskData saved successfully in DailyAssignmentSummary", result));
                } else {
                    resolve(common.setResponse("fail", "No TaskData found !!!", {}));
                }
            })
            .catch((err) => {
                console.log("Error occuring while saving/fetching: ", err);
                resolve(common.setResponse("fail", "No TaskData found !!!", {}));
            });
    });
};

export const checkDailyAssignmentVehicleData = async() => {
    return new Promise(async(resolve)=> {
        try{
            const { year, monthName, date, time, formattedDate } = getDateTimeDetails();
            const path = `AssignmentData/DailyAssignmentSummary/${year}/${monthName}/${date}/Vehicles`

            const response = await db.getData(path);
            if (response !== null && response !== undefined) {
            return { success: true, data: response };
        } else {
            await pushDataInDailyAssignmentVehicleSummary();
            
            return { success: false };
        };
    } catch (error) {
        return { success: false, error: error.message };
    };
    })
}

const pushDataInDailyAssignmentVehicleSummary = () => {
    return new Promise(async(resolve) => {
        await db.getData(`Vehicles`)
            .then(async (resp) => {
                if (resp !== null) {
                    const year = dayjs().format("YYYY");
                    const month = dayjs().format("MMMM");
                    const date = dayjs().format("YYYY-MM-DD");
                    const summaryTaskPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/NotAssigned`;

                    const activeKeys = Object.keys(resp).filter((key)=> resp[key].status === '1')
                    const converted = {};
                    activeKeys.forEach((key, index) => {
                        converted[index+1] = key;   
                    });

                    const result = await db.saveData(summaryTaskPath, converted);

                    resolve(common.setResponse("success", "Vehicle Data successfully in DailyAssignmentSummary", result));
                } else {
                    resolve(common.setResponse("fail", "No TaskData found !!!", {}));
                }
            })
            .catch((err) => {
                console.log("Error occuring while saving/fetching: ", err);
                resolve(common.setResponse("fail", "No TaskData found !!!", {}));
            });
    });
};



