import * as db from '../../../../services/dbServices';
import * as common from '../../../../common/common';

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
                console.error('Error fetching employees: - PenaltiesService.js:28', error);
                reject(error);
            });
    });
};
