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

export const saveTaskData = (displayName, taskId) => {
    return new Promise(async (resolve) => {
        try {
            if (!displayName) {
                return resolve(common.setResponse('fail', 'Invalid params !!!', { displayName }));
            }

            let finalTaskId = taskId || generateTaskId();
            let taskPath = `TaskData/Tasks/${finalTaskId}`;
            let detailsPath = `TaskData/TaskDetails/${finalTaskId}`;
            let oldName = null;

            if (taskId) {
                const previousDetails = await db.getData(detailsPath);
                oldName = previousDetails?.name || null;
            }

            let taskData = {
                name: displayName,
                status: 'active'
            };

            let detailsData = {
                name: displayName,
                _at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                _by: "Admin",
                status: 'active'
            };

            Promise.all([
                db.saveData(taskPath, taskData),
                db.saveData(detailsPath, detailsData)
            ]).then(async ([taskRes, detailRes]) => {

                if (taskRes.success === true && detailRes.success === true) {

                    await saveTaskHistory(
                        detailsPath,
                        finalTaskId,
                        dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        displayName,
                        oldName
                    );
                    resolve(common.setResponse('success', taskId ? 'Task updated successfully.' : 'Task data & details saved successfully.', { taskId: finalTaskId }));
                } else {
                    resolve(common.setResponse('fail', 'Issue while saving task or details.', {}));
                }
            });
        } catch (error) {
            resolve(common.setResponse('fail', "Error while saving task data.", { error }));
            console.log('Error while saving task data', error);
        }
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
                        const finalData = {
                            ...response,
                            taskId: taskId
                        };
                        resolve(common.setResponse('success', 'Task Details fetched successfully', { details: finalData }));
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
    newName,
    oldName,
    newStatus = null,
    oldStatus = null
) => {
    try {
        if (!taskId || !dateAndTime || !taskDetailsPath) {
            return common.setResponse("fail", "Invalid Params !!", {
                taskId,
                dateAndTime,
                taskDetailsPath
            });
        }

        const historyPath = `${taskDetailsPath}/UpdateHistory`;

        const resData = (await db.getData(historyPath)) || { lastKey: 0 };
        const lastKey = resData.lastKey || 0;

        let entry = null;
        let newKey = lastKey + 1;

        // 🔥 CASE 1: FIRST ENTRY
        if (!lastKey) {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: `Task created with name '${newName}`
            };
        }

        // 🔥 CASE 2: NAME CHANGE
        else if (oldName && newName && oldName !== newName) {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: `Task name changed from '${oldName}' to '${newName}'`
            };
        }

        // 🔥 CASE 3: STATUS CHANGE
        else if (oldStatus && newStatus && oldStatus !== newStatus) {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: `Task status changed from '${oldStatus}' to '${newStatus}'`
            };
        }

        // ❗ No change = no entry
        if (!entry) {
            console.log("No change. History not updated.");
            return;
        }

        await Promise.all([
            db.saveData(`${historyPath}/${newKey}`, entry),
            db.saveData(historyPath, { lastKey: newKey })
        ]);

        return common.setResponse("success", "Task history saved.", { taskId, entry });

    } catch (error) {
        console.error("Error while saving task history:", error);
    }
};

export const activeInactiveTask = (taskId, status) => {
    return new Promise(async (resolve) => {
        if (!taskId) {
            return resolve(common.setResponse("fail", "Invalid taskId", { taskId }));
        }

        let taskPath = `TaskData/Tasks/${taskId}`;
        let detailsPath = `TaskData/TaskDetails/${taskId}`;

        const oldData = await db.getData(detailsPath);
        const oldStatus = oldData?.status || "active";

        Promise.all([
            db.saveData(taskPath, { status }),
            db.saveData(detailsPath, { status })
        ]).then(async ([taskRes, detailsRes]) => {

            if (taskRes.success === true && detailsRes.success === true) {
                await saveTaskHistory(detailsPath, taskId, dayjs().format("YYYY-MM-DD HH:mm:ss"), null, null, status, oldStatus);
                resolve(common.setResponse("success", "Task status updated successfully.", { taskId, status }));
            } else {
                resolve(common.setResponse("fail", "Error updating task status.", {}));
            }
        }).catch((error) => {
            resolve(common.setResponse("fail", "Exception while updating task.", { error }));
        });
    });
};