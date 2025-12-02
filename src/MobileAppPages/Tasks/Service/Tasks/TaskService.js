import * as db from '../../../../services/dbServices';
import * as common from '../../../../common/common';
import dayjs from 'dayjs';

export const generateTaskId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let id = "";

    for (let i = 0; i < 3; i++) {
        id += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 3; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return id;
};

export const saveTaskData = (displayName) => {
    return new Promise((resolve) => {
        try {
            if (displayName) {
                let taskId = generateTaskId();

                let taskPath = `TaskData/Tasks/${taskId}`;
                let detailsPath = `TaskData/TaskDetails/${taskId}`;

                let taskData = {
                    name: displayName,
                    status: 'Active'
                };

                let detailsData = {
                    name: displayName,
                    _at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    _by: "Admin",
                    status: 'Active'
                };

                Promise.all([
                    db.saveData(taskPath, taskData),
                    db.saveData(detailsPath, detailsData)
                ]).then(([taskRes, detailRes]) => {
                    if (taskRes.success === true && detailRes.success === true) {
                        resolve(common.setResponse('success', 'Task data & details saved successfully.', { taskId }));
                    } else {
                        resolve(common.setResponse('fail', 'Issue while saving task or details.', {}));
                    }
                });
            } else {
                resolve(common.setResponse('fail', 'Invalid params !!!', { displayName }));
            }
        } catch (error) {
            resolve(common.setResponse('fail', "Error while saving task data.", { error }));
            console.log('Error while saving task data', error);
        };
    });
};
