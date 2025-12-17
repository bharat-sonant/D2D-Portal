import * as common from "../../../../common/common";
import *  as db from '../../../../services/dbServices';
import dayjs from "dayjs";

export const saveVehicleData = (vehicleName, chassisNumber, vehicleId) => {
    return new Promise(async (resolve) => {
        try {
            if (!vehicleName && !chassisNumber) {
                return resolve(common.setResponse('fail', 'Invalid params !!!', { vehicleName, chassisNumber }));
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
                chassisNumber: chassisNumber,
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
                    resolve(common.setResponse('fail', 'Issue while saving vehicle or details.', {}));
                }
            });
        } catch (error) {
            resolve(common.setResponse('fail', "Error while saving vehicle data.", { error }));
            console.log('Error while saving vehicle data', error);
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
        console.error("Error while saving vehicle history:", error);
    }
};

export const getAllVehicleData = () => {
    return new Promise((resolve) => {
        let path = `VehiclesData/Vehicles`;

        db.getData(path).then((response) => {
            if (response !== null) {
                let vehicleList = [];

                for (let key in response) {
                    const vehicleId = key;
                    const name = response[key].name || "";
                    const status = response[key].status || "";

                    vehicleList.push({
                        vehicleId,
                        name,
                        status
                    });
                }
                vehicleList.sort((a, b) => a.name.localeCompare(b.name));

                resolve(common.setResponse("success", "Vehicle data fetched.", vehicleList));
            } else {
                resolve(common.setResponse("fail", "No vehicle found.", []));
            }
        }).catch((error) => {
            resolve(common.setResponse("fail", "Error while fetching vehicle data.", { error }));
        });
    });
};

export const getVehicleDetails = (vehicleId) => {
    return new Promise((resolve) => {
        try {
            if (vehicleId) {
                let path = `VehiclesData/VehicleDetails/${vehicleId}`;
                db.getData(path).then((response) => {
                    if (response !== null) {
                        const finalData = {
                            ...response,
                            vehicleId: vehicleId
                        };
                        resolve(common.setResponse('success', 'Vehicle Details fetched successfully', { details: finalData }));
                    } else {
                        resolve(common.setResponse('fail', 'Issue in fetching vehicle data.', {}));
                    };
                });
            } else {
                resolve(common.setResponse('fail', 'Issue in fetching vehicle data.', {}));
            };
        } catch (error) {
            resolve(common.setResponse('fail', 'Issue in fetching vehicle data.', error));
            console.log('Error while fetching vehicle details', error);
        };
    });
};

export const activeInactiveVehicles = (vehicleId, status) => {
    return new Promise(async (resolve) => {
        if (!vehicleId) {
            return resolve(common.setResponse("fail", "Invalid taskId", { vehicleId }));
        }

        let VehiclePath = `VehiclesData/Vehicles/${vehicleId}`;
        let detailsPath = `VehiclesData/VehicleDetails/${vehicleId}`;

        const oldData = await db.getData(detailsPath);
        const oldStatus = oldData?.status || "active";

        Promise.all([
            db.saveData(VehiclePath, { status }),
            db.saveData(detailsPath, { status })
        ]).then(async ([taskRes, detailsRes]) => {

            if (taskRes.success === true && detailsRes.success === true) {
                await saveVehicleHistory(detailsPath, vehicleId, dayjs().format("YYYY-MM-DD HH:mm:ss"), null, null, status, oldStatus);
                resolve(common.setResponse("success", "Vehicle status updated successfully.", { vehicleId, status }));
            } else {
                resolve(common.setResponse("fail", "Error updating vehicle status.", {}));
            }
        }).catch((error) => {
            resolve(common.setResponse("fail", "Exception while updating vehicle.", { error }));
        });
    });
};

export const deleteInactiveVehicle = (vehicleId) => {
    return new Promise(async (resolve) => {
        try {
            if (!vehicleId) {
                resolve(common.setResponse('fail', "Invalid Params !!!", { vehicleId }));
                return;
            };

            let vehiclePath = `VehiclesData/Vehicles/${vehicleId}`;
            let detailPath = `VehiclesData/VehicleDetails/${vehicleId}`;

            await saveVehicleHistory(detailPath, vehicleId, dayjs().format("YYYY-MM-DD HH:mm:ss"), null, null, null, null, 'deleted');

            await Promise.all([
                db.removeData(vehiclePath),
                db.removeData(detailPath)
            ]).then(async ([taskRes, detailRes]) => {
                if (taskRes.success === true && detailRes.success === true) {
                    resolve(common.setResponse('success', "Vehicle and Vehicle detail deleted successfully", { vehicleId }));
                } else {
                    resolve(common.setResponse('fail', 'Error deleting vehicle and vehicle details.', {}));
                };
            });
        } catch (error) {
            resolve(common.setResponse('fail', 'Error deleting vehicle and vehicle details.', error));
            console.log('Error while delete the vehicle and vehicle details', error);
        };
    });
};

export const getVehicleUpdateHistory = async (vehicleId) => {
    return new Promise(async (resolve) => {
        try {
            if (vehicleId) {
                const path = `VehiclesData/VehicleUpdateHistory/${vehicleId}`;
                const resData = await db.getData(path);

                if (!resData) {
                    return resolve(
                        common.setResponse('fail', "No history available", {})
                    );
                }

                const historyArray = Object.entries(resData).filter(([key]) => key !== "lastKey").map(([key, value]) => ({
                    index: key,
                    event: value.event,
                    at: value._at,
                    by: value._by,
                }));

                resolve(common.setResponse('success', "History data available", historyArray));
            } else {
                resolve(common.setResponse('fail', "Invalid Params", { vehicleId }));
            }
        } catch (error) {
            resolve(common.setResponse("Error", `Error while getting vehicle update history`, { error }));
            console.log('Error while fetching vehicle update history', error);
        };
    });
};