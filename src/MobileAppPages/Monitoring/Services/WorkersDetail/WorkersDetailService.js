import * as db from '../../../../services/dbServices';
import * as common from '../../../../common/common';
import dayjs from 'dayjs';


export const getBasicWorkMonitoringData = async (selectedDate) => {
    return new Promise(async (resolve) => {
        if (!selectedDate) {
            resolve(common.setResponse("fail", "Invalid parameters!", {}));
            return;
        }

        try {
            // Format dates
            const year = dayjs(selectedDate).format("YYYY");
            const month = dayjs(selectedDate).format("MMMM");
            const date = dayjs(selectedDate).format("YYYY-MM-DD");

            // Main DB Path (Ward level)
            const mainPath = `WasteCollectionInfo`;

            // Fetch full data
        const wardData = await db.getData(mainPath);


            if (!wardData) {
                resolve(common.setResponse("fail", "No data found!", {}));
                return;
            }

            // Convert nested object data → array
            const finalArray = [];

            Object.entries(wardData).forEach(([wardName, wardValue]) => {
                const selectedDayData =
                    wardValue?.[year]?.[month]?.[date];

                if (selectedDayData) {
                    finalArray.push({
                        wardName,
                        summary: selectedDayData.Summary || {},
                        workerDetails: selectedDayData.WorkerDetails || {},
                    });
                }
            });

            resolve(common.setResponse("success", "Data fetched!", finalArray));

        } catch (error) {
            resolve(common.setResponse("fail", error.message, {}));
        }
    });
};
