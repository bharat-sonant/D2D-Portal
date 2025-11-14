import * as db from "../../../services/dbServices";
import * as common from "../../../common/common";
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

const isFail = (res) => res?.status === "fail";


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

const saveVehicleAssignment = async(selectedVehicle, driverId, helperId, ward) => {
  const payload = {
    "assigned-driver": driverId,
    "assigned-helper": helperId,
    "assigned-task": ward,
    status: "3",
  };
  const result = await db.saveData(`Vehicles/${selectedVehicle}`, payload);

    if (!result?.success)
      return common.setResponse(fail, "Vehicle assignment failed", result);

    return result;
  }

const saveWorkAssignments = async(driverId, driverDeviceId, helperId, helperDeviceId, selectedVehicle, ward)=> {
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

  const [driverResult, helperResult] = await Promise.all([
     db.saveData(`WorkAssignment/${driverId}`, driverPayload),
    db.saveData(`WorkAssignment/${helperId}`, helperPayload),
  ])

  if (!driverResult?.success)
      return common.setResponse(fail, "Driver work assignment failed", driverResult);

    if (!helperResult?.success)
      return common.setResponse(fail, "Helper work assignment failed", helperResult);

    return { driverResult, helperResult };
  };

const updateDeviceStatus = async (devicesPath, driverDeviceKey, helperDeviceKey, formattedDate) => {
  const deviceUpdatePayload = { status: "2", lastActive: formattedDate };
  const [driverDeviceResult, helperDeviceResult] = await Promise.all([
    db.saveData(`${devicesPath}/${driverDeviceKey}`, deviceUpdatePayload),
    db.saveData(`${devicesPath}/${helperDeviceKey}`, deviceUpdatePayload),
  ]);
  if (!driverDeviceResult?.success)
      return common.setResponse(fail, "Driver device update failed", driverDeviceResult);

    if (!helperDeviceResult?.success)
      return common.setResponse(fail, "Helper device update failed", helperDeviceResult);

    return { driverDeviceResult, helperDeviceResult };
  };

    const saveWhoAssignWork = async (path, ward, time) => {
      const whoAssignData = await db.getData(path);
      const validEntries =
        whoAssignData && whoAssignData.length > 0
          ? whoAssignData.filter((item) => item)
          : [];
      const nextIndex = validEntries.length + 1;

      const whoAssignPayload = { task: ward, time };
      const whoAssignPath = `${path}/${nextIndex}`;
      const res = await db.saveData(whoAssignPath, whoAssignPayload);

      if (!res?.success)
        return common.setResponse(fail, "Saving whoAssignWork failed", res);

      return res;
    };

// ✅ Save WasteCollectionInfo
const saveWasteCollectionInfo = async (
  ward,
  year,
  monthName,
  date,
  time,
  driverId,
  helperId,
  selectedVehicle
) => {
  const path = `WasteCollectionInfo/${ward}/${year}/${monthName}/${date}`;
  const payload = {
    Summary: { dutyInTime: time },
    WorkerDetails: {
      driver: driverId,
      helper: helperId,
      vehicle: selectedVehicle,
    },
  };
  const res = await db.saveData(path, payload);

  if (!res?.success)
    return common.setResponse(fail, "WasteCollectionInfo saving failed", res);

  return res;
};

const updateTaskStatus = async (ward) => {
  const path = `Tasks`;
  const res = await db.saveData(path, {[ward] : "Assigned"});

  if (!res?.success)
    return common.setResponse(fail, "Failed to update task status", res);

  return res;
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

      const [
        vehicleResult, 
        workAssignRes,
        deviceStatusRes,
        whoAssignResult,
        wasteInfoResult,
      ] = await Promise.all([
        saveVehicleAssignment(selectedVehicle,driverId, helperId, ward),
        saveWorkAssignments(driverId, driverDeviceId, helperId, helperDeviceId, selectedVehicle, ward),
        updateDeviceStatus(devicesPath, driverDeviceKey, helperDeviceKey, formattedDate),
        saveWhoAssignWork(whoAssignWorkPath, ward, time),
        saveWasteCollectionInfo(ward, year, monthName, date, time, driverId, helperId, selectedVehicle),
      ]);
      console.log(vehicleResult)
      console.log(workAssignRes)
      console.log(deviceStatusRes)
      console.log(whoAssignResult)
      console.log(wasteInfoResult)

      if (isFail(vehicleResult)) return resolve(vehicleResult);
      if (isFail(workAssignRes)) return resolve(workAssignRes);
      if (isFail(deviceStatusRes)) return resolve(deviceStatusRes);
      if (isFail(whoAssignResult)) return resolve(whoAssignResult);
      if (isFail(wasteInfoResult)) return resolve(wasteInfoResult);

      const taskStatusRes = await updateTaskStatus(ward);

      if (!taskStatusRes?.success)
        return resolve(taskStatusRes);    

      
      const { driverResult, helperResult } = workAssignRes;
      const { driverDeviceResult, helperDeviceResult } = deviceStatusRes;

      const finalResult = {
        vehicle: vehicleResult,
        driver: driverResult,
        helper: helperResult,
        driverDevice: driverDeviceResult,
        helperDevice: helperDeviceResult,
        whoAssignWork: whoAssignResult,
        wasteInfo : wasteInfoResult,
        taskStatus : taskStatusRes
      };

       return resolve(
        common.setResponse(success, "Assignment started successfully", finalResult)
      );
    } catch (error) {
      resolve(
        common.setResponse(
          fail,
          "Unexpected error while starting assignment.",
          []
        )
      );
    }
  });
};
