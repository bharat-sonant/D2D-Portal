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
  helperDeviceId,
  city
) => {
  return new Promise(async (resolve) => {
    try {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const formatDeviceName = (id) => {
  const formattedId = id.toString().padStart(2, '0'); // ensures 9 → "09"
  return `DEV-${formattedId}`;
};

      const vehiclePath = `Vehicles/${selectedVehicle}`;
      const driverPath = `WorkAssignment/${driverId}`;
      const helperPath = `WorkAssignment/${helperId}`;
      const devicesPath = `Devices/${city}`

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

      const devicesResult = await db.getData(devicesPath);

      if (!devicesResult) {
        return resolve(common.setResponse(fail, "Could not fetch devices list", []));
      }

      const devicesData = devicesResult;

      const driverDeviceKey = Object.keys(devicesData).find(
        (key) => devicesData[key]?.name === formatDeviceName(driverDeviceId)
      )

      const helperDeviceKey = Object.keys(devicesData).find(
        (key) => devicesData[key]?.name === formatDeviceName(helperDeviceId)
      );

      if (!driverDeviceKey || !helperDeviceKey) {
        return resolve(
          common.setResponse(
            fail,
            "Device record not found for driver or helper. Please verify Device IDs.",
            []
          )
        );
      }
      console.log('format', formattedDate)
      const deviceUpdatePayload = {
        status: "2",
        lastActive: formattedDate,
      };

      const driverDevicePath = `${devicesPath}/${driverDeviceKey}`;
      const helperDevicePath = `${devicesPath}/${helperDeviceKey}`;

      

      const [vehicleResult, driverResult, helperResult, driverDeviceResult, helperDeviceResult] = await Promise.all([
        db.saveData(vehiclePath, vehiclePayload),
        db.saveData(driverPath, driverPayload),
        db.saveData(helperPath, helperPayload),
        db.saveData(driverDevicePath, deviceUpdatePayload),
        db.saveData(helperDevicePath, deviceUpdatePayload)
      ]);
      console.log('driverdevice', driverDeviceResult)

      const allSuccess =
        vehicleResult?.success && driverResult?.success && helperResult?.success &&
        driverDeviceResult?.success &&
        helperDeviceResult?.success;


        const result = {
vehicle: vehicleResult,
          driver: driverResult,
          helper: helperResult,
          driverDevice: driverDeviceResult,
        helperDevice: helperDeviceResult,
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
