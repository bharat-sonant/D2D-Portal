import * as common from "../../../../common/common";
import *  as db from '../../../../services/dbServices';
import dayjs from "dayjs";

export const saveVehicleData = (vehicleName, vehicleId) => {
    return new Promise(async (resolve) => {
        try {
            if (!vehicleName) {
                return resolve(common.setResponse('fail', 'Invalid params !!!', { vehicleName }));
            }

            let finalvehicleId = vehicleId || common.generateRandomCode();
            let vehiclePath = `VehiclesData/Vehicles/${finalvehicleId}`;
            let detailsPath = `VehiclesData/VehicleDetails/${finalvehicleId}`;
            let oldName = null;

            if (vehicleId) {
                const previousDetails = await db.getData(detailsPath);
                oldName = previousDetails?.name || null;
            }

            let vehicleData = {
                name: vehicleName,
                status: 'active'
            };

            let detailsData = {
                name: vehicleName,
                _at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                _by: "Admin",
                status: 'active'
            };

            Promise.all([
                db.saveData(vehiclePath, vehicleData),
                db.saveData(detailsPath, detailsData)
            ]).then(async ([vehicleRes, detailRes]) => {

                if (vehicleRes.success === true && detailRes.success === true) {

                    await saveVehicleHistory(
                        detailsPath,
                        finalvehicleId,
                        dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        vehicleName,
                        oldName
                    );
                    resolve(common.setResponse('success', vehicleId ? 'Vehicle updated successfully.' : 'Vehicle data & details saved successfully.', { vehicleId: finalvehicleId }));
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

export const saveVehicleHistory = async (
    VehicleDetailsPath,
    vehicleId,
    dateAndTime,
    newName,
    oldName,
    newStatus = null,
    oldStatus = null,
    isDeleted
) => {
    try {
        if (!vehicleId || !dateAndTime || !VehicleDetailsPath) {
            return common.setResponse("fail", "Invalid Params !!", {
                vehicleId,
                dateAndTime,
                VehicleDetailsPath
            });
        }

        const historyPath = `VehiclesData/VehicleUpdateHistory/${vehicleId}`;

        const resData = (await db.getData(historyPath)) || { lastKey: 0 };
        const lastKey = resData.lastKey || 0;

        let entry = null;
        let newKey = lastKey + 1;

        // 🔥 CASE 1: FIRST ENTRY
        if (!lastKey) {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: `Vehicle Created`
            };
        }

        // 🔥 CASE 2: NAME CHANGE
        else if (oldName && newName && oldName !== newName) {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: `Vehicle name changed from ${oldName} to ${newName}`
            };
        }

        // 🔥 CASE 3: STATUS CHANGE
        else if (oldStatus && newStatus && oldStatus !== newStatus) {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: `Vehicle status changed from ${oldStatus} to ${newStatus}`
            };
        }

        // 🔥 CASE 4: TASK DELETED
        else if (isDeleted === "deleted") {
            entry = {
                _at: dateAndTime,
                _by: "Admin",
                event: "Vehicle has been deleted"
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

        return common.setResponse("success", "Vehicle history saved.", { vehicleId, entry });

    } catch (error) {
        console.error("Error while saving task history:", error);
    }
};