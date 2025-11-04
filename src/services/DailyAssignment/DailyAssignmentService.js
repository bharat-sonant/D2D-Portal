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


export const getDutyOnOffList = (zone, date) => {
    return new Promise(async (resolve) => {
        if (zone && date) {
            try {
                const year = date.split('-')[0];
                const month = await common.getCurrentMonthName(Number(date.split('-')[1]));
                const monthPath = `/WasteCollectionInfo/${zone}/${year}/${month}`;
                const monthData = await db.getData(monthPath); // 🔹 Fetch entire month data

                if (!monthData || Object.keys(monthData).length === 0) {
                    return resolve(common.setResponse(failStatus, failMessage, {}));
                }

                let allDutyRecords = [];

                // 🔹 Loop through all date nodes (e.g., 2025-11-01, 2025-11-02...)
                for (const [dateKey, dateData] of Object.entries(monthData)) {
                    if (!dateData.Summary) continue; // skip if Summary not available

                    const {
                        dutyInTime,
                        dutyOutTime,
                        dutyOnImage,
                        dutyOutImage,
                        dutyOnMeterImage,
                        dutyOutMeterImage,
                        workPercentageRemark
                    } = dateData.Summary;

                    let remarkArray = workPercentageRemark ? workPercentageRemark.split(',') : [];
                    let dayList = [];

                    // 🔹 Create list for each duty entry of that date
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

                    // 🔹 Function to attach Firebase image URLs
                    const addImageList = (imgField, folderName, keyName) => {
                        if (!imgField) return;
                        const imgList = imgField.split(',');
                        imgList.forEach((imgName, i) => {
                            const imgUrl = `https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/DevTest%2F${folderName}%2F${zone}%2F${year}%2F${month}%2F${dateKey}%2F${imgName.trim()}?alt=media`;
                            if (dayList[i]) {
                                dayList[i][keyName] = imgUrl;
                            }
                        });
                    };

                    // 🔹 Add images for each entry
                    addImageList(dutyOnImage, 'DutyOnImages', 'dutyInImg');
                    addImageList(dutyOnMeterImage, 'DutyOnMeterReadingImages', 'dutyInMeterImage');
                    addImageList(dutyOutImage, 'DutyOutImages', 'dutyOutImg');
                    addImageList(dutyOutMeterImage, 'DutyOutMeterReadingImages', 'dutyOutMeterImage');

                    // 🔹 Get driver & helper info for the date
                    const driverData = await getDriverHelperData(zone, dateKey, dayList, month);

                    // 🔹 Append data to monthly array
                    allDutyRecords.push(...(Array.isArray(driverData) ? driverData : dayList));
                }

                // ✅ Final resolved response
                resolve(
                    common.setResponse(successStatus, successMessage, {
                        zoneNo: zone,
                        isDutyOn: allDutyRecords.length > 0 ? 1 : 0,
                        dutyImgList: allDutyRecords
                    })
                );

            } catch (error) {
                console.error('Error in getDutyOnOffList (): - DailyAssignmentService.js:136', error);
                resolve(common.setResponse(failStatus, 'Error fetching monthly data', { error }));
            }
        } else {
            resolve(common.setResponse(failStatus, 'Invalid Params !!', { service: 'getDutyOnOffList', params: { zone, date } }));
        }
    });
};
