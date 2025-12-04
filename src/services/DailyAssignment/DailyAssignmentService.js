import * as db from '../dbServices';
import * as common from '../../common/common';
import moment from 'moment';

const failStatus = "Fail";
const successStatus = "Success";
const failMessage = "No Data Found.";
const successMessage = "Data Found.";


export const getDutyOnOffImagesByDate = async (zone, date) => {
    if (!zone || !date) {
        return common.setResponse("Fail", "Invalid Params !!", { zone, date });
    }

    try {
        const year = date.split("-")[0];
        const month = await common.getCurrentMonthName(Number(date.split("-")[1]));
        const path = `/AssignmentData/DailyWorkAssignmentDetails/${year}/${month}/${date}/${zone}`;

        const data = await db.getData(path);

        if (!data) {
            return common.setResponse("Fail", "No Data Found.", {});
        }

        // 🔥 Only numeric keys (1,2,3…) — ignore lastKey
        const dutyKeys = Object.keys(data).filter(key => key !== "lastKey");

        const makeImageUrls = (imgField, folderName, dutyKey) => {
            if (!imgField) return [];

            const imgList = imgField.split(",");

            return imgList.map(imgName =>
                `https://firebasestorage.googleapis.com/v0/b/devtest-62768.firebasestorage.app/o/DevTest%2F${folderName}%2F${zone}%2F${year}%2F${month}%2F${date}%2F${imgName}?alt=media`
            );
        };

        const dutyImgList = dutyKeys.map((key) => {
            const entry = data[key];
            return {
                assignId: key,
                dutyInImages: makeImageUrls(entry.dutyOnImg, "DutyOnImages", key),
                dutyOutImages: makeImageUrls(entry.dutyOffImg, "DutyOutImages", key),
                dutyInMeterImages: makeImageUrls(entry.dutyOnMeterImg, "DutyOnMeterReadingImages", key),
                dutyOutMeterImages: makeImageUrls(entry.dutyOffMeterImg, "DutyOutMeterReadingImages", key)
            };
        });

        return common.setResponse("Success", "Data Found.", {
            zone,
            date,
            dutyImgList
        });

    } catch (error) {
        console.error("Error in getDutyOnOffImagesByDate:", error);
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

            // 🔥 Remove lastKey before mapping
            const filteredKeys = Object.keys(dateData).filter(k => k !== "lastKey");

            // Convert object {1:{},2:{}} → array
            const dutyList = filteredKeys.map((key, index) => {
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

            // Fetch images
            const imageResponse = await getDutyOnOffImagesByDate(zone, date);
            const imageData =
                imageResponse?.status === "Success" ? imageResponse.data : {};

            // 🔥 Merge images based on assignId
            const mergedDutyList = dutyList.map(item => {
                const imgData = imageData.dutyImgList?.find(
                    img => img.assignId === item.assignId
                ) || {};

                return {
                    ...item,
                    dutyInImages: imgData.dutyInImages || [],
                    dutyOutImages: imgData.dutyOutImages || [],
                    dutyInMeterImages: imgData.dutyInMeterImages || [],
                    dutyOutMeterImages: imgData.dutyOutMeterImages || []
                };
            });

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
        if (!ward || !date) {
            return common.setResponse("Fail", "Invalid Params !!", { ward, date });
        }

        // 🔥 Skip if date == today
        const today = moment().format("YYYY-MM-DD");
        if (date === today) {
            return common.setResponse(
                "Success",
                "Today's data is not allowed to save.",
                {}
            );
        }

        const year = date.split("-")[0];
        const monthNumber = Number(date.split("-")[1]);
        const month = await common.getCurrentMonthName(monthNumber);

        const assignmentPath =
            `AssignmentData/DailyWorkAssignmentDetails/${year}/${month}/${date}/${ward}`;

        const wastePath =
            `WasteCollectionInfo/${ward}/${year}/${month}/${date}`;

        // Fetch existing assignment
        const existingData = await db.getData(assignmentPath);

        // Full Duplicate Protection
        const existingKeys = Object.keys(existingData || {}).filter(k => !isNaN(k));

        if (existingKeys.length > 0) {
            return common.setResponse(
                "Success",
                "Already saved earlier. No new entries added.",
                existingData
            );
        }

        // Fetch waste collection summary
        const wasteData = await db.getData(wastePath);
        if (!wasteData || !wasteData.Summary) {
            return common.setResponse("Fail", "No data found in WasteCollectionInfo", {});
        }

        const summary = wasteData.Summary;
        const worker = wasteData.WorkerDetails || {};

        // Convert comma-separated values to arrays
        const dutyOnArr = summary.dutyInTime?.split(",") || [""];
        const dutyOffArr = summary.dutyOutTime?.split(",") || [""];
        const driverArr = worker.driverName?.split(",") || [""];
        const helperArr = worker.helperName?.split(",") || [""];
        const vehicleArr = worker.vehicle?.split(",") || [""];
        const dutyOnImgArr = summary.dutyOnImage?.split(",") || [""];
        const dutyOffImgArr = summary.dutyOutImage?.split(",") || [""];
        const dutyOnMeterImgArr = summary.dutyOnMeterImage?.split(",") || [""];
        const dutyOffMeterImgArr = summary.dutyOutMeterImage?.split(",") || [""];

        // Count number of entries
        const entryCount = Math.max(
            dutyOnArr.length,
            dutyOffArr.length,
            driverArr.length,
            helperArr.length,
            vehicleArr.length,
            dutyOnImgArr.length,
            dutyOffImgArr.length,
            dutyOnMeterImgArr.length,
            dutyOffMeterImgArr.length
        );

        // Prepare object
        let updatedData = {};
        let startKey = 1;

        for (let i = 0; i < entryCount; i++) {
            const key = startKey + i;
            updatedData[key] = {
                driver: driverArr[i] || driverArr[0] || "",
                helper: helperArr[i] || helperArr[0] || "",
                vehicle: vehicleArr[i] || vehicleArr[0] || "",
                "duty-on-by": driverArr[i] || driverArr[0] || "",
                "duty-on-time": dutyOnArr[i] || dutyOnArr[0] || "",
                dutyOnImg: dutyOnImgArr[i] || dutyOnImgArr[0] || "",
                dutyOnMeterImg: dutyOnMeterImgArr[i] || dutyOnMeterImgArr[0] || "",
                "duty-off-by": driverArr[i] || driverArr[0] || "",
                "duty-off-time": dutyOffArr[i] || dutyOffArr[0] || "",
                dutyOffImg: dutyOffImgArr[i] || dutyOffImgArr[0] || "",
                dutyOffMeterImg: dutyOffMeterImgArr[i] || dutyOffMeterImgArr[0] || ""
            };
        }

        updatedData.lastKey = entryCount;

        await db.saveData(assignmentPath, updatedData);

        return common.setResponse(
            "Success",
            `${entryCount} entries saved successfully.`,
            updatedData
        );

    } catch (error) {
        console.error("Error:", error);
        return common.setResponse("Fail", "Error occurred", { error });
    }
};