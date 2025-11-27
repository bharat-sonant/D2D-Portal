import * as db from '../dbServices';
import * as common from '../../common/common';
import dayjs from 'dayjs';

const failStatus = "Fail";
const successStatus = "Success";
const failMessage = "No Data Found.";
const successMessage = "Data Found.";

const getDriverHelperData = (zone, date, list, month) => {
    return new Promise(async (resolve) => {
        if (zone && date && list && list.length > 0) {
            const year = date.split('-')[0];

            const response = await db.getData(`WasteCollectionInfo/${zone}/${year}/${month}/${date}/WorkerDetails`);


            if (response) {
                const driverName = response.driverName || '---';
                const helperName = response.helperName || '---';
                const vehicle = response.vehicle || '---';

                const updatedList = list.map(item => ({
                    ...item,
                    driver: driverName,
                    helper: helperName,
                    vehicle: vehicle
                }));
                resolve(updatedList);
            } else {
                resolve(list);
            }
        } else {
            resolve(list || []);
        }
    });
};

export const getDutyOnOffImagesByDate = async (zone, date) => {
    if (!zone || !date) {
        return common.setResponse("Fail", "Invalid Params !!", { zone, date });
    }

    try {
        const year = date.split('-')[0];
        const month = await common.getCurrentMonthName(Number(date.split('-')[1]));

        const summaryPath = `/WasteCollectionInfo/${zone}/${year}/${month}/${date}/Summary`;

        const summaryData = await db.getData(summaryPath);

        if (!summaryData) {
            return common.setResponse("Fail", "No Data Found.", {});
        }

        const {
            dutyOnImage,
            dutyOnMeterImage,
            dutyOutImage,
            dutyOutMeterImage
        } = summaryData;

        const makeImageUrls = (imgField, folderName) => {
            if (!imgField) return [];
            const imgList = imgField.split(',');
            return imgList.map(
                (imgName) =>
                    `https://firebasestorage.googleapis.com/v0/b/devtest-62768.firebasestorage.app/o/DevTest%2F${folderName}%2F${zone}%2F${year}%2F${month}%2F${date}%2F${imgName}?alt=media`
                // `https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/DevTest%2FDutyOnImages%2F${zone}%2F${year}%2F${month}%2F${date}%2F${imgName}?alt=media`
            );
        };

        const dutyInImages = makeImageUrls(dutyOnImage, 'DutyOnImages');
        const dutyOutImages = makeImageUrls(dutyOutImage, 'DutyOutImages');
        const dutyInMeterImages = makeImageUrls(dutyOnMeterImage, 'DutyOnMeterReadingImages');
        const dutyOutMeterImages = makeImageUrls(dutyOutMeterImage, 'DutyOutMeterReadingImages');

        return common.setResponse("Success", "Data Found.", {
            zone,
            date,
            dutyInImages,
            dutyOutImages,
            dutyInMeterImages,
            dutyOutMeterImages
        });

    } catch (error) {
        console.error("Error in getDutyOnOffImagesByDate: - DailyAssignmentService.js:87", error);
        return common.setResponse("Fail", "Error fetching data", { error });
    }
};


export const getDutyOnOffList = (zone, date) => {
    return new Promise(async (resolve) => {
        if (!zone || !date) {
            return resolve(common.setResponse(failStatus, 'Invalid Params !!', { zone, date }));
        }

        try {
            const year = date.split('-')[0];
            const month = await common.getCurrentMonthName(Number(date.split('-')[1]));
            const datePath = `/AssignmentData/DailyWorkAssignmentDetails/${year}/${month}/${date}/${zone}`;
            const dateData = await db.getData(datePath);

            if (!dateData) {
                return resolve(common.setResponse(failStatus, failMessage, {}));
            }

            // 🔥 FIXED → Convert Firebase {1:{}, 2:{}} into array
            const dutyList = Object.keys(dateData).map((key, index) => {
                const d = dateData[key];

                return {
                    assignId: key,
                    assign: `Duty Assign ${index + 1}`,
                    date,

                    dutyInTime: d["duty-on-time"] || "",
                    dutyOutTime: d["duty-off-time"] || "",

                    driver: d.driver || "",
                    helper: d.helper || "",
                    vehicle: d.vehicle || ""
                };
            });

            // Fetch driver/helper details
            const driverData = await getDriverHelperData(zone, date, dutyList, month);

            // Fetch images
            const imageResponse = await getDutyOnOffImagesByDate(zone, date);
            const imageData = imageResponse?.status === "Success" ? imageResponse.data : {};

            const mergedDutyList = driverData.map(item => ({
                ...item,
                dutyInImages: imageData.dutyInImages || [],
                dutyOutImages: imageData.dutyOutImages || [],
                dutyInMeterImages: imageData.dutyInMeterImages || [],
                dutyOutMeterImages: imageData.dutyOutMeterImages || []
            }));

            resolve(
                common.setResponse(successStatus, successMessage, {
                    zoneNo: zone,
                    isDutyOn: mergedDutyList.length > 0 ? 1 : 0,
                    dutyImgList: mergedDutyList
                })
            );

        } catch (error) {
            console.error("Error in getDutyOnOffList():", error);
            resolve(common.setResponse(failStatus, 'Error fetching data', { error }));
        }
    });
};


export const getOrPushDailyAssignmentData = async (ward, date) => {
    try {
        const year = date.split("-")[0];
        const monthNumber = Number(date.split("-")[1]);
        const month = await common.getCurrentMonthName(monthNumber);

        const assignmentPath = `AssignmentData/DailyWorkAssignmentDetails/${year}/${month}/${date}/${ward}`;
        const wastePath = `WasteCollectionInfo/${ward}/${year}/${month}/${date}`;

        // STEP 1: CHECK IF ALREADY EXISTS
        const existingData = await db.getData(assignmentPath);
        if (existingData) {
            return common.setResponse(
                "Success",
                "Data found in DailyWorkAssignmentDetails",
                existingData
            );
        }

        // STEP 2: FETCH FROM WasteCollectionInfo
        const wasteData = await db.getData(wastePath);

        if (!wasteData || !wasteData.Summary) {
            return common.setResponse("Fail", "No data found in WasteCollectionInfo", {});
        }

        const summary = wasteData.Summary;
        const worker = wasteData.WorkerDetails || {};

        // STEP 3: FORMAT LIKE YOUR REQUIRED STRUCTURE
        const dataToSave = {
            1: {
                driver: worker.driverName,
                helper: worker.helperName,
                vehicle: worker.vehicle,

                "duty-on-by": worker.driverName,
                "duty-on-time": summary.dutyInTime,
                dutyOnImg: summary.dutyOnImage,
                dutyOnMeterImg: summary.dutyOnMeterImage,

                "duty-off-by": worker.driverName,
                "duty-off-time": summary.dutyOutTime,
                dutyOffImg: summary.dutyOutImage,
                dutyOffMeterImg: summary.dutyOutMeterImage
            },
        };

        // STEP 4: SAVE in correct format
        await db.setData(assignmentPath, dataToSave);

        return common.setResponse(
            "Success",
            "Data saved in DailyWorkAssignmentDetails",
            dataToSave
        );

    } catch (error) {
        console.error("Error:", error);
        return common.setResponse("Fail", "Error occurred", { error });
    }
};

