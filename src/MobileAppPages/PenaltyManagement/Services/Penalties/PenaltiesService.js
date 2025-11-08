import * as db from '../../../../services/dbServices';
import * as common from '../../../../common/common';
import axios from 'axios';

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
                console.error('Error fetching employees: - PenaltiesService.js:29', error);
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
                console.error("Failed to fetch PenaltyTypes, status: - PenaltiesService.js:45", response.status);
                resolve(common.setResponse('fail', ' No Penalty type received', {}));
                return [];
            }
        } catch (error) {
            console.error("Error fetching PenaltyTypes: - PenaltiesService.js:50", error);
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
                console.error("Failed to fetch PenaltyTypes, status: - PenaltiesService.js:67", response.status);
                resolve(common.setResponse('fail', ' No Penalty type received', {}));
                return [];
            }
        } catch (error) {
            console.error("Error fetching PenaltyTypes: - PenaltiesService.js:72", error);
            resolve(common.setResponse('fail', ' No Penalty type received', {}));
            return [];
        }
    })
}