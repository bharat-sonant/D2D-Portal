import * as db from '../dbServices';
import * as common from '../../common/common';

const failStatus = "Fail";
const successStatus = "Success";
const failMessage = "No Data Found.";
const successMessage = "Data Found.";

const getDriverHelperData = (zone, date, list, month) => {
    return new Promise(async (resolve) => {
        if (zone && date && list && list.length > 0) {
            const year = date.split('-')[0];

            // 🔹 Path matches your Firebase structure
            const response = await db.getData(`WasteCollectionInfo/${zone}/${year}/${month}/${date}/WorkerDetails`);


            if (response) {
                const driverName = response.driverName || '---';
                const helperName = response.helperName || '---';
                const vehicle = response.vehicle || '---';

                // 🔹 Assign same worker info to all items of that day
                const updatedList = list.map(item => ({
                    ...item,
                    driver: driverName,
                    helper: helperName,
                    vehicle: vehicle
                }));
                resolve(updatedList);
            } else {
                // 🔹 If no worker details, still return the list
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


        // Build all image URL lists
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
        console.error("Error in getDutyOnOffImagesByDate: - DailyAssignmentService.js:92", error);
        return common.setResponse("Fail", "Error fetching data", { error });
    }
};


export const getDutyOnOffList = (zone, date) => {
    return new Promise(async (resolve) => {
        if (zone && date) {
            try {
                const year = date.split('-')[0];
                const month = await common.getCurrentMonthName(Number(date.split('-')[1]));
                const monthPath = `/WasteCollectionInfo/${zone}/${year}/${month}`;
                const monthData = await db.getData(monthPath);

                if (!monthData || Object.keys(monthData).length === 0) {
                    return resolve(common.setResponse(failStatus, failMessage, {}));
                }

                let allDutyRecords = [];

                for (const [dateKey, dateData] of Object.entries(monthData)) {
                    if (!dateData.Summary) continue;

                    const { dutyInTime, dutyOutTime, workPercentageRemark } = dateData.Summary;

                    let remarkArray = workPercentageRemark ? workPercentageRemark.split(',') : [];
                    let dayList = [];

                    if (dutyInTime) {
                        const inTimeList = dutyInTime.split(',');
                        const outTimeList = dutyOutTime ? dutyOutTime.split(',') : [];

                        for (let i = 0; i < inTimeList.length; i++) {
                            const inTime = inTimeList[i];
                            const offTime = outTimeList[i] || '';
                            const assignId = `${i + 1}`;
                            const assign = `Duty Assign ${i + 1}`;
                            const workRemark = remarkArray[i] || '';

                            dayList.push({
                                assignId,
                                assign,
                                date: dateKey,
                                dutyInTime: inTime,
                                dutyOutTime: offTime,
                                workPercentageRemark: workRemark,
                                dutyInImg: '',
                                dutyOutImg: '',
                                dutyInMeterImage: '',
                                dutyOutMeterImage: ''
                            });
                        }
                    }

                    const driverData = await getDriverHelperData(zone, dateKey, dayList, month);
                    allDutyRecords.push(...(Array.isArray(driverData) ? driverData : dayList));
                }

                resolve(
                    common.setResponse(successStatus, successMessage, {
                        zoneNo: zone,
                        isDutyOn: allDutyRecords.length > 0 ? 1 : 0,
                        dutyImgList: allDutyRecords
                    })
                );

            } catch (error) {
                console.error('Error in getDutyOnOffList (): - DailyAssignmentService.js:160', error);
                resolve(common.setResponse(failStatus, 'Error fetching monthly data', { error }));
            }
        } else {
            resolve(common.setResponse(failStatus, 'Invalid Params !!', { service: 'getDutyOnOffList', params: { zone, date } }));
        }
    });
};
