import * as db from '../../../../../services/dbServices';
import * as common from '../../../../../common/common';
import dayjs from 'dayjs';

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