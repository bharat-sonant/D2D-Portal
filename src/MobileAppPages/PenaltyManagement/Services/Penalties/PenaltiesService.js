import * as db from '../../../../services/dbServices';
import * as common from '../../../../common/common';
import axios from 'axios';
import dayjs from 'dayjs';

export const getEmployees = () => {
    return new Promise((resolve, reject) => {
        db.getData('Employees')
            .then((response) => {
                if (response !== null) {
                    const employees = [];

                    for (const key in response) {
                        if (response.hasOwnProperty(key)) {
                            const empData = response[key];
                            const details = empData?.GeneralDetails;

                            if (details?.status === "1" || details?.status === 1) {
                                const name = details?.name || 'Unknown';
                                employees.push({ id: key, name });
                            }
                        }
                    }
                    resolve(common.setResponse('success', 'Employee fetched sucessfully', { employees }));
                } else {
                    resolve(common.setResponse('fail', 'No data found', {}));
                }
            })
            .catch((error) => {
                console.error('Error fetching employees: - PenaltiesService.js:30', error);
                reject(error);
            });
    });
};

export const getPenaltyType = async () => {
    return new Promise(async (resolve) => {
        const url = 'https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/Common%2FPenaltyTypes.json?alt=media';

        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const validPenaltyTypes = response.data.filter(item => item !== null && item !== undefined && item !== "");
                resolve(common.setResponse('success', 'Penalty type received successfully', validPenaltyTypes));
            } else {
                console.error("Failed to fetch PenaltyTypes, status: - PenaltiesService.js:46", response.status);
                resolve(common.setResponse('fail', ' No Penalty type received', {}));
                return [];
            }
        } catch (error) {
            console.error("Error fetching PenaltyTypes: - PenaltiesService.js:51", error);
            resolve(common.setResponse('fail', ' No Penalty type received', {}));
            return [];
        }
    })
};

export const getRewardType = () => {
    return new Promise(async (resolve) => {
        const url = 'https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/Common%2FRewardTypes.json?alt=media';

        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const validRewardTypes = response.data.filter(item => item !== null && item !== undefined && item !== "");
                resolve(common.setResponse('success', 'Penalty type received successfully', validRewardTypes));
            } else {
                console.error("Failed to fetch PenaltyTypes, status: - PenaltiesService.js:68", response.status);
                resolve(common.setResponse('fail', ' No Penalty type received', {}));
                return [];
            }
        } catch (error) {
            console.error("Error fetching PenaltyTypes: - PenaltiesService.js:73", error);
            resolve(common.setResponse('fail', ' No Penalty type received', {}));
            return [];
        }
    })
};

export const savePaneltiesData = (
    loggedInUserId,
    entryType,
    selectedDate,
    employeeId,
    amount,
    typeValue,
    reason,
    penaltyId
) => {
    return new Promise(async (resolve) => {
        try {
            if (!loggedInUserId || !entryType || !selectedDate || !employeeId) {
                resolve(common.setResponse('fail', 'Invalid parameters!', {}));
                return;
            }

            const year = dayjs(selectedDate).format('YYYY');
            const month = dayjs(selectedDate).format('MMMM');
            const date = dayjs(selectedDate).format('YYYY-MM-DD');

            const typeKey = entryType === 'Penalty' ? 'penaltyType' : 'rewardType';

            const dataToSave = {
                entryType,
                [typeKey]: typeValue,
                amount: Number(amount) || 0,
                reason: reason || '',
                createdBy: loggedInUserId,
                createdOn: dayjs().format('YYYY-MM-DD HH:mm'),
            };

            const lastKey = await db.getLastKey(`Penalties/${year}/${month}/${date}/${employeeId}/lastKey`, penaltyId);

            const path = `Penalties/${year}/${month}/${date}/${employeeId}/${lastKey}`;
            const saveResponse = await db.saveData(path, dataToSave);
            await db.saveData(`Penalties/${year}/${month}/${date}/${employeeId}`, { lastKey: lastKey });

            if (saveResponse.success === true) {
                resolve(common.setResponse('success', 'Penalty/Reward saved successfully', { Id: lastKey }));
            } else {
                resolve(common.setResponse('fail', 'Error saving penalty/reward!', {}));
            }
        } catch (error) {
            console.error('Error saving penalties data: - PenaltiesService.js:124', error);
            resolve(common.setResponse('fail', 'Exception while saving penalty/reward!', { error }));
        }
    });
};

export const getPenaltiesData = (selectedDate) => {
    return new Promise(async (resolve) => {
        if (!selectedDate) {
            resolve(common.setResponse('fail', 'No selected date found', { selectedDate }));
            return;
        }

        const year = dayjs(selectedDate).format('YYYY');
        const month = dayjs(selectedDate).format('MMMM');
        const date = dayjs(selectedDate).format('YYYY-MM-DD');

        try {
            const response = await db.getData(`Penalties/${year}/${month}/${date}`);

            if (!response || Object.keys(response).length === 0) {
                resolve(common.setResponse('fail', 'No penalty/reward data found', {
                    list: [],
                    penaltyCount: 0,
                    rewardCount: 0,
                }));
                return;
            }

            const penaltiesReward = [];
            let penaltyCount = 0;
            let rewardCount = 0;

            await Promise.all(
                Object.keys(response).map(async (employeeId) => {
                    const innerObj = response[employeeId];

                    for (let key in innerObj) {
                        if (key !== 'lastKey') {
                            const entry = innerObj[key];
                            penaltiesReward.push({
                                employeeId,
                                entryKey: key,
                                ...entry,
                            });

                            if (entry.entryType === "Penalty") penaltyCount++;
                            if (entry.entryType === "Reward") rewardCount++;
                        }
                    }
                })
            );

            resolve(common.setResponse('success', 'Data fetched successfully', {
                list: penaltiesReward,
                penaltyCount,
                rewardCount,
            }));
        } catch (error) {
            console.error('Error fetching penalties data: - PenaltiesService.js:183', error);
            resolve(common.setResponse('fail', 'Exception while fetching penalty/reward data', {
                list: [],
                penaltyCount: 0,
                rewardCount: 0,
                error,
            }));
        }
    });
};


