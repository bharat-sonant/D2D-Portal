import * as db from "../../../services/dbServices";
import * as common from "../../../common/common";
import { ref, listAll, uploadBytes } from "firebase/storage";
import { getReadyStorage } from "../../../services/dbServices";

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

const saveVehicleAssignment = async (selectedVehicle, driverId, helperId, ward) => {
  const payload = {
    "assigned-driver": driverId,
    "assigned-helper": helperId,
    "assigned-task": ward,
    status: "3",
  };
  const result = await db.saveData(`Vehicles/${selectedVehicle}`, payload);

  return result?.success
    ? result
    : common.setResponse(fail, "Vehicle assignment failed", result);
}

const saveWorkAssignments = async (driverId, driverDeviceId, helperId, helperDeviceId, selectedVehicle, ward) => {
  const driverPayload = {
    "current-assignment": ward,
    device: formatDeviceName(driverDeviceId),
    vehicle: selectedVehicle,
  };

  const helperPayload = {
    "current-assignment": ward,
    device: formatDeviceName(helperDeviceId),
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

  return res?.success
    ? res
    : common.setResponse(fail, "Saving whoAssignWork failed", res);
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

  return res?.success
    ? res
    : common.setResponse(fail, "WasteCollectionInfo saving failed", res);
};

const updateTaskStatus = async (ward) => {
  const path = `Tasks`;
  const res = await db.saveData(path, { [ward]: "Assigned" });

  return res?.success
    ? res
    : common.setResponse(fail, "Failed to update task status", res);
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
        saveVehicleAssignment(selectedVehicle, driverId, helperId, ward),
        saveWorkAssignments(driverId, driverDeviceId, helperId, helperDeviceId, selectedVehicle, ward),
        updateDeviceStatus(devicesPath, driverDeviceKey, helperDeviceKey, formattedDate),
        saveWhoAssignWork(whoAssignWorkPath, ward, time),
        saveWasteCollectionInfo(ward, year, monthName, date, time, driverId, helperId, selectedVehicle),
      ]);

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
        wasteInfo: wasteInfoResult,
        taskStatus: taskStatusRes
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

export const refreshActiveDrivers = async () => {
  return new Promise(async (resolve) => {
    try {
      const result = await db.getData('Employees')
      const { lastEmpId, ...employeeObj } = result || {};


      const freshList = Object.entries(employeeObj).filter(([empId, emp])=>
        String(emp?.GeneralDetails?.designationId) === "5" &&
        String(emp?.GeneralDetails?.status) === "1"
      ).map(
        ([empId, emp])=>({
          Id : empId,
          name : emp?.GeneralDetails?.name
        })
      )

      const freshMap = new Map(freshList.map((d)=> [d.Id, d]));

       const activeDrivers = (await db.getData("ActiveDrivers")) || {};
       const updatedDrivers = { ...activeDrivers };

       for(const driverId of Object.keys(activeDrivers)){
        if(!freshMap.has(driverId)){
          await db.removeData(`ActiveDrivers/${driverId}`)
          delete updatedDrivers[driverId];
        }
       }

          for (const freshDriver of freshList) {
        const existing = activeDrivers[freshDriver.Id];

        if (!existing) {
          // ADD new driver
          await db.saveData(`ActiveDrivers/${freshDriver.Id}`, {
            Id: freshDriver.Id,
            name: freshDriver.name,
          });

          updatedDrivers[freshDriver.Id] = {
            Id: freshDriver.Id,
            name: freshDriver.name,
          };
        } else if (existing.name !== freshDriver.name) {
          // UPDATE only name
          await db.saveData(`ActiveDrivers/${freshDriver.Id}`, {
            // Id: freshDriver.Id,
            name: freshDriver.name,
          });

          updatedDrivers[freshDriver.Id].name = freshDriver.name;
        }
      }

       resolve(
        common.setResponse(
          success,
          "Drivers refreshed successfully",
          updatedDrivers
        )
      );
    } catch (error) {
      resolve(common.setResponse(fail, "failed to fetch driver list", []))
    }
  })
}

export const getActiveDriversList = async () => {
  return new Promise(async (resolve) => {
    try {
      const result = await db.getData('ActiveDrivers');
      const { lastEmpId, ...employeeObj } = result || {};

      const driverList = Object.entries(employeeObj).map(([empId, data])=>( {
        // empId,
        ...data
      }))

      if (driverList.length > 0) {
        resolve(common.setResponse(success, "Active Drivers fetched successfully", driverList))
      }
      else {
        resolve(common.setResponse(fail, "No Active drivers found.", []))
      }
    } catch (error) {
      resolve(common.setResponse(fail, "failed to fetch Active driver list", []))
    }
  })
}

export const getAvailableDevices = async (city) => {
  return new Promise(async(resolve)=>{
    try{
      const result = await db.getData(`Devices/${city}`)
      
      const deviceArray = Object.entries(result).map(([deviceId, device])=> ({
        deviceId,
        ...device
      }))

      const availableDevices = deviceArray.filter((device)=>device.status === "1")
        .map((device)=>({
          DeviceId : device.deviceId,
          DeviceName : device.name
        }))

      if(availableDevices.length > 0){
        resolve(common.setResponse(success, "available devices fetched successfully", availableDevices))
      }else{
        resolve(common.setResponse(fail, "No available devices Available", []))
      }
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch Available Devices"))
    }
  })
}

export const mapDeviceWithActiveDriver = async(driverId, device) => {
  return new Promise(async(resolve) => {
    try{
      const path = `ActiveDrivers/${driverId}`

      const payload = {
        DeviceId: device.DeviceId,
        DeviceName: device.DeviceName
      }

      const result = await db.saveData(path, payload)
      if(result.success){
        resolve(common.setResponse(success, "Device mapped successfully", result))
      }else{
        resolve(common.setResponse(fail, "failed to map device"))
      }
    }catch(error){
      resolve(common.setResponse(fail, "failed to map device"))
    }
  })
}

export const saveDriverHelperImage = async (
  selectedWard,
  year,
  month,
  date,
  file
) => {
  return new Promise(async (resolve) => {
    try {
      if (!selectedWard || !year || !month || !date || !file) {
        resolve(
          common.setResponse("fail", "Invalid Params !!!", {
            selectedWard,
            year,
            month,
            date,
            file,
          })
        );
        return;
      }

      const city = localStorage.getItem("city");
      const storage = await getReadyStorage();
      const ward = selectedWard !== "N/A" ? selectedWard : "Bharat";

      const basePath = `${city}/DutyOnImages/${ward}/${year}/${month}/${date}`;
      const fileRef = ref(storage, `${basePath}/1.jpg`);

      await Promise.all([
        db.uploadImageToStorage(file, fileRef)
      ]);

      resolve(
        common.setResponse(
          "success",
          "Driver/Helper Image saved successfully",
          {}
        )
      );
    } catch (error) {
      resolve(
        common.setResponse("fail", "Failed to save Images", error)
      );
    }
  });
};