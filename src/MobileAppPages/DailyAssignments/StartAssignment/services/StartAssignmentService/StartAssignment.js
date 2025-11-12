import * as db from "../../../../../services/dbServices";
import * as common from "../../../../../common/common";
const success = "success";
const fail = "fail";

export const getAllVehicles = async () => {
  return new Promise(async (resolve) => {
    try {
      const result = await db.getData(`Vehicles`);
      if (result) {
        resolve(common.setResponse(success, "Vehicles fetched successfully", result));
      } else {
        resolve(common.setResponse(fail, "No vehicles found", []));
      }
    } catch (error) {
      resolve(common.setResponse(fail, "Failed to fetch vehicles", []));
    }
  });
};

export const startAssignment = async(selectedVehicle, ward, driverId,driverDeviceId, helperId, helperDeviceId) => {
  return new Promise(async(resolve) => {
    try{
      const path = `Vehicles/${selectedVehicle}`;
      const payload = {
        "assigned-driver": driverId,
        "assigned-helper": helperId,
        "assigned-task": ward,
        "status": "3"
      }

      const vehicleResult = await db.saveData(path, payload );

      if (!vehicleResult.success) {
        return resolve(common.setResponse(fail, "Failed to update vehicle assignment", []));
      }

       const driverPath = `WorkAssignment/${driverId}`;
      const helperPath = `WorkAssignment/${helperId}`;

      const driverPayload = {
        "current-assignment": ward,
        "device": driverDeviceId,
        "vehicle": selectedVehicle,
      };

      const helperPayload = {
        "current-assignment": ward,
        "device": helperDeviceId,
        "vehicle": selectedVehicle,
      };

      const [driverResult, helperResult] = await Promise.all([
        db.saveData(driverPath, driverPayload),
        db.saveData(helperPath, helperPayload),
      ]);

      if (driverResult.success && helperResult.success) {
        resolve(common.setResponse(success, "Assignment started successfully", {}));
      } else {
        resolve(common.setResponse(fail, "Failed to update work assignment", []));
      }

    }catch(error){
      resolve(common.setResponse(fail, "Failed to fetch vehicles", []));
    }
  })
}
