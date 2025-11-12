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

export const startAssignment = async (
  selectedVehicle,
  ward,
  driverId,
  driverDeviceId,
  helperId,
  helperDeviceId
) => {
  return new Promise(async (resolve) => {
    try {
      const vehiclePath = `Vehicles/${selectedVehicle}`;
      const driverPath = `WorkAssignment/${driverId}`;
      const helperPath = `WorkAssignment/${helperId}`;

      const vehiclePayload = {
        "assigned-driver": driverId,
        "assigned-helper": helperId,
        "assigned-task": ward,
        status: "3",
      };

      const driverPayload = {
        "current-assignment": ward,
        device: driverDeviceId,
        vehicle: selectedVehicle,
      };

      const helperPayload = {
        "current-assignment": ward,
        device: helperDeviceId,
        vehicle: selectedVehicle,
      };

      const [vehicleResult, driverResult, helperResult] = await Promise.all([
        db.saveData(vehiclePath, vehiclePayload),
        db.saveData(driverPath, driverPayload),
        db.saveData(helperPath, helperPayload),
      ]);

      const allSuccess =
        vehicleResult?.success && driverResult?.success && helperResult?.success;

        const result = {
vehicle: vehicleResult,
          driver: driverResult,
          helper: helperResult,
        }
      if (allSuccess) {
         resolve(common.setResponse(success, "Assignment started successfully", result));
      } else {
        resolve(common.setResponse(fail, "Failed to  start assignment", []));
      }
    } catch (error) {
      resolve(common.setResponse(fail, "error occurred while starting assignment. Please try again.", []));
    }
  });
};
