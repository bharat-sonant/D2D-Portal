import * as db from '../../../../../services/dbServices';
import * as common from '../../../../../common/common';

export const getAllWards = async () => {
    return new Promise(async (resolve) => {
        try {
            let path = 'Tasks';
            await db.getData(path).then((response) => {
                if (response !== null) {
                    const wardKeys = Object.keys(response);
                    resolve(common.setResponse('success', "Ward list fetched successfully", { wardKeys }));
                } else {
                    resolve(common.setResponse('fail', "No data found !!!", {}));
                }
            });
        } catch (error) {
            console.error("Error fetching wards:", error);
            resolve(common.setResponse('fail', "Something went wrong!", { error: error.message }));
        }
    });
};
