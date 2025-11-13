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
  city,
  loginId
) => {
  return new Promise(async (resolve) => {
    try {
      const now = new Date();
      // 🔹 Format components
      const year = now.getFullYear();
      const monthName = now.toLocaleString("default", { month: "long" }); // e.g. November
      const date = `${year}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`; // YYYY-MM-DD
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`; // 24-hour format

      // 🔹 For backward compatibility with your formattedDate
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()} ${time}`;

      const formatDeviceName = (id) => {
        const formattedId = id.toString().padStart(2, "0"); // ensures 9 → "09"
        return `DEV-${formattedId}`;
      };

      const vehiclePath = `Vehicles/${selectedVehicle}`;
      const driverPath = `WorkAssignment/${driverId}`;
      const helperPath = `WorkAssignment/${helperId}`;
      const devicesPath = `Devices/${city}`;
      const whoAssignWorkPath = `WhoAssignWork/${year}/${monthName}/${date}/${loginId}`;

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
        return resolve(
          common.setResponse(fail, "Could not fetch devices list", [])
        );
      }

      const devicesData = devicesResult;

      const driverDeviceKey = Object.keys(devicesData).find(
        (key) => devicesData[key]?.name === formatDeviceName(driverDeviceId)
      );

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
      console.log("format", formattedDate);
      const deviceUpdatePayload = {
        status: "2",
        lastActive: formattedDate,
      };

      const driverDevicePath = `${devicesPath}/${driverDeviceKey}`;
      const helperDevicePath = `${devicesPath}/${helperDeviceKey}`;

      const whoAssignData = await db.getData(whoAssignWorkPath);
      console.log("dddd", whoAssignData);

      const nextIndex = whoAssignData
        ? Object.keys(whoAssignData).length + 1
        : 1;

      const whoAssignPayload = {
        task: ward,
        time: time,
      };

      const whoAssignPath = `${whoAssignWorkPath}/${nextIndex}`;

      const [
        vehicleResult,
        driverResult,
        helperResult,
        driverDeviceResult,
        helperDeviceResult,
        whoAssignResult,
      ] = await Promise.all([
        db.saveData(vehiclePath, vehiclePayload),
        db.saveData(driverPath, driverPayload),
        db.saveData(helperPath, helperPayload),
        db.saveData(driverDevicePath, deviceUpdatePayload),
        db.saveData(helperDevicePath, deviceUpdatePayload),
        db.saveData(whoAssignPath, whoAssignPayload),
      ]);
      console.log("whoassign", whoAssignResult);

      const allSuccess =
        vehicleResult?.success &&
        driverResult?.success &&
        helperResult?.success &&
        driverDeviceResult?.success &&
        helperDeviceResult?.success &&
        whoAssignResult?.success;

      const result = {
        vehicle: vehicleResult,
        driver: driverResult,
        helper: helperResult,
        driverDevice: driverDeviceResult,
        helperDevice: helperDeviceResult,
        whoAssignWork: whoAssignResult,
      };
      if (allSuccess) {
        resolve(
          common.setResponse(success, "Assignment started successfully", result)
        );
      } else {
        resolve(common.setResponse(fail, "Failed to  start assignment", []));
      }
    } catch (error) {
      resolve(
        common.setResponse(
          fail,
          "error occurred while starting assignment. Please try again.",
          []
        )
      );
    }
  });
};
