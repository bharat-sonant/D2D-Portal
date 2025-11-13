import * as db from "../../../../../services/dbServices";
import * as common from "../../../../../common/common";
const success = "success";
const fail = "fail";

// 🕒 Utility for date/time formatting
const getDateTimeDetails = () => {
  const now = new Date();
  const year = now.getFullYear();
  const monthName = now.toLocaleString("default", { month: "long" });
  const date = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${year} ${time}`;

  return { now, year, monthName, date, time, formattedDate };
};

// 🧭 Helper for device name formatting
const formatDeviceName = (id) => {
  const formattedId = id.toString().padStart(2, "0");
  return `DEV-${formattedId}`;
};


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
  user
) => {
  return new Promise(async (resolve) => {
    try {
      const { year, monthName, date, time, formattedDate } = getDateTimeDetails();

      const devicesPath = `Devices/${city}`;
      const whoAssignWorkPath = `WhoAssignWork/${year}/${monthName}/${date}/${user}`;

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
          common.setResponse(fail, "Failed to fetch devices", [])
        );
      }

      const driverDeviceKey = Object.keys(devicesResult).find(
        (key) => devicesResult[key]?.name === formatDeviceName(driverDeviceId)
      );

      const helperDeviceKey = Object.keys(devicesResult).find(
        (key) => devicesResult[key]?.name === formatDeviceName(helperDeviceId)
      );

      if (!driverDeviceKey || !helperDeviceKey) {
        const msg = !driverDeviceKey
          ? "Device record not found for driver."
          : "Device record not found for helper.";
        return resolve(common.setResponse(fail, msg, []));
      }

      const deviceUpdatePayload = {
        status: "2",
        lastActive: formattedDate,
      };

      const whoAssignData = await db.getData(whoAssignWorkPath);

      //filter null or empty entries 
      const validEntries = whoAssignData && whoAssignData.length > 0 ? whoAssignData?.filter((item) =>item) : [];

      const nextIndex = validEntries.length + 1;

      const whoAssignPayload = {
        task: ward,
        time: time,
      };

      const wasteInfoPayload = {
        Summary : {
          dutyInTime : time,
        },
        WorkerDetails : {
          driver: driverId,
          helper: helperId,
          vehicle: selectedVehicle,
        }
      }

      const [
        vehicleResult,
        driverResult,
        helperResult,
        driverDeviceResult,
        helperDeviceResult,
        whoAssignResult,
        wasteInfoResult,
      ] = await Promise.all([
        db.saveData(`Vehicles/${selectedVehicle}`, vehiclePayload),
        db.saveData(`WorkAssignment/${driverId}`, driverPayload),
        db.saveData(`WorkAssignment/${helperId}`, helperPayload),
        db.saveData(`${devicesPath}/${driverDeviceKey}`, deviceUpdatePayload),
        db.saveData(`${devicesPath}/${helperDeviceKey}`, deviceUpdatePayload),
        db.saveData(`${whoAssignWorkPath}/${nextIndex}`, whoAssignPayload),
        db.saveData(`WasteCollectionInfo/${ward}/${year}/${monthName}/${date}`, wasteInfoPayload)
      ]);

      const allSuccess =
        vehicleResult?.success &&
        driverResult?.success &&
        helperResult?.success &&
        driverDeviceResult?.success &&
        helperDeviceResult?.success &&
        whoAssignResult?.success &&
        wasteInfoResult?.success;

      const result = {
        vehicle: vehicleResult,
        driver: driverResult,
        helper: helperResult,
        driverDevice: driverDeviceResult,
        helperDevice: helperDeviceResult,
        whoAssignWork: whoAssignResult,
        wasteInfo : wasteInfoResult,
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
