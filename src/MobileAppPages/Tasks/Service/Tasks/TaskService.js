import * as db from '../../../../services/dbServices';
import * as common from '../../../../common/common';
import dayjs from 'dayjs';

const generateTaskId = () => {
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
                        saveTaskHistory(
                            detailsPath,
                            taskId,
                            dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            `Task created with name ${displayName}`
                        );
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

export const getTaskData = () => {
    return new Promise((resolve) => {
        let path = `TaskData/Tasks`;

        db.getData(path).then((response) => {
            if (response !== null) {
                let taskList = [];

                for (let key in response) {
                    const taskId = key;
                    const name = response[key].name || "";
                    const status = response[key].status || "";

                    taskList.push({
                        taskId,
                        name,
                        status
                    });
                }
                taskList.sort((a, b) => a.name.localeCompare(b.name));

                resolve(common.setResponse("success", "Task data fetched.", taskList));
            } else {
                resolve(common.setResponse("fail", "No tasks found.", []));
            }
        }).catch((error) => {
            resolve(common.setResponse("fail", "Error while fetching task data.", { error }));
        });
    });
};

export const getTaskDetails = (taskId) => {
    return new Promise((resolve) => {
        try {
            if (taskId) {
                let path = `TaskData/TaskDetails/${taskId}`;
                db.getData(path).then((response) => {
                    if (response !== null) {
                        resolve(common.setResponse('success', 'Task Details fetched successfully', { details: response }));
                    } else {
                        resolve(common.setResponse('fail', 'Issue in fetching task data.', {}));
                    };
                });
            } else {
                resolve(common.setResponse('fail', 'Issue in fetching task data.', {}));
            };
        } catch (error) {
            resolve(common.setResponse('fail', 'Issue in fetching task data.', error));
            console.log('Error while fetching task details', error);
        };
    });
};

export const saveTaskHistory = async (
    taskDetailsPath,
    taskId,
    dateAndTime,
    eventMessage
) => {
    try {
        if (!taskId || !dateAndTime || !taskDetailsPath || !eventMessage) {
            return common.setResponse("fail", "Invalid Params !!", {
                taskId,
                dateAndTime,
                taskDetailsPath,
                eventMessage
            });
        }
        const historyPath = `${taskDetailsPath}/${taskId}/UpdateHistory`;

        let historyData = (await db.getData(historyPath)) || { lastKey: 0 };

        const nextKey = (historyData.lastKey || 0) + 1;

        const entry = {
            _at: dateAndTime,
            _by: 'Admin',
            event: eventMessage,
        };

        await Promise.all([
            db.saveData(`${historyPath}/${nextKey}`, entry),
            db.saveData(historyPath, { lastKey: nextKey }),
        ]);

        return common.setResponse("success", "Task history saved.", { taskId, entry });

    } catch (error) {
        console.error("Error while saving task history:", error);
    }
};