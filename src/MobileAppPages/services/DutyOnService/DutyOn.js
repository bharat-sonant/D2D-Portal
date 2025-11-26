import { ref } from 'firebase/storage';
import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
const fail = 'fail'
const success = 'success'
const isFail = (res) => res?.status === "fail";

export const getDateTimeDetails = () => {
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

export const getAllActiveVehicles = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('Vehicles')

      const vehicleList = Object.entries(result)
  .filter(([vehicleNo, data]) => data.taskAssigned !== "yes")   
  .map(([vehicleNo, data]) => ({
    vehicleNo,
    ...data
  }));


      resolve(common.setResponse(success, "vehicels fetched successfully", vehicleList))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch vehicles"))
    }
  })
}

export const getActiveDrivers = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('ActiveDrivers');

      // const activeDrivers = Object.values(result)
       const activeDrivers = Object.entries(result)
        .filter(([key, value]) => value.taskAssigned !== "yes")   
        .map(([key, value]) => ({
          Id: key,
          name: value.name,
        }));

      resolve(common.setResponse(success, "fetched active drivers successfully", activeDrivers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}

export const getActiveHelpers = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('ActiveHelpers');

      const activeHelpers = Object.entries(result)
        .filter(([key, value]) => value.taskAssigned !== "yes")   
        .map(([key, value]) => ({
          Id: key,
          name: value.name,
        }));

      resolve(common.setResponse(success, "fetched active drivers successfully", activeHelpers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}

export const startAssignmentService = (ward, selectedVehicle, selectedDriver, selectedHelper) => {
  return new Promise(async(resolve)=> {
    try{
      console.log('ward', ward)
      const { year, monthName, date, time, formattedDate } = getDateTimeDetails();
      const [driverAssignmentResult, driverTaskStatusResult, helperAssignmentResult, helperTaskStatusResult, vehicleTaskStatusResult, workAssignmentResult, assignmentSummaryResult] = await Promise.all([
        saveDriverAssignment(selectedDriver, ward, selectedVehicle),
        SaveDriverTaskStatus(selectedDriver),
        saveHelperAssignment(selectedHelper, ward, selectedVehicle),
        saveHelperTaskStatus(selectedHelper),
        saveVehicleTaskStatus(selectedVehicle),
        saveWorkAssignment(ward, selectedVehicle, selectedDriver, selectedHelper),
        saveAssignmentSummaryStatus(year, monthName, date, ward),
      ])
      if (isFail(driverAssignmentResult)) return resolve(driverAssignmentResult);
      if (isFail(driverTaskStatusResult)) return resolve(driverTaskStatusResult);
      if(isFail(helperAssignmentResult)) return resolve(helperAssignmentResult);
      if(isFail(helperTaskStatusResult)) return resolve(helperTaskStatusResult);
      if(isFail(vehicleTaskStatusResult)) return resolve(vehicleTaskStatusResult);
      if (isFail(workAssignmentResult)) return resolve(workAssignmentResult);
      if(isFail(assignmentSummaryResult)) return resolve(assignmentSummaryResult);
      const finalResult = {
        driverAssignment: driverAssignmentResult,
        driverTaskStatus : driverTaskStatusResult,
        helperAssignment: helperAssignmentResult,
        helperTaskStatus : helperTaskStatusResult,
        vehicleTaskStatus : vehicleTaskStatusResult,
        workAssignment: workAssignmentResult,
        assignmentSummary : assignmentSummaryResult,
      }

      return resolve(
        common.setResponse(success, "Assignment started successfully", finalResult)
      );
    }catch(error){
      resolve(common.setResponse(fail, "failed to start assignment"))
    }
  })
}

const saveDriverAssignment = async(selectedDriver, ward, selectedVehicle) => {
  const userAssignmentPath = `AssignmentData/UserAssignments/${selectedDriver.Id}`
      const userAssignmentPayload = {
        task : ward,
        vehicle: selectedVehicle
      }

    const result = await db.saveData(userAssignmentPath, userAssignmentPayload);

    return result?.success
        ? result
        : common.setResponse(fail, "driver assignment failed", result);
}

const SaveDriverTaskStatus = async(selectedDriver) => {
  const path = `ActiveDrivers/${selectedDriver.Id}`
      const payload = {
        taskAssigned : "yes"
      }

    const result = await db.saveData(path, payload);

    return result?.success
        ? result
        : common.setResponse(fail, "driver task assignment status save failed", result);
}

const saveHelperTaskStatus = async(selectedHelper) => {
  const path = `ActiveHelpers/${selectedHelper.Id}`
  const payload = {
    taskAssigned : "yes"
  }

  const result = await db.saveData(path, payload);

  return result.success
      ? result
      : common.setResponse(fail, "Helper task assignment status save failed", result)
}

const saveVehicleTaskStatus = async(selectedVehicle) => {
  const path = `Vehicles/${selectedVehicle}`
  const payload = {
    taskAssigned : "yes"
  }

  const result = await db.saveData(path, payload);

  return result.success
      ? result
      : common.setResponse(fail, "Vehicle task assignment status save failed", result)
}

const saveAssignmentSummaryStatus = async(year, monthName, date, ward) => {
  const path = `AssignmentData/AssignmentSummary/${year}/${monthName}/${date}/Task`;
  const payload ={
    [ward] : "Assigned"
  }

  const result = await db.saveData(path, payload);

  return result.success
    ? result
    : common.setResponse(fail, "assignment summary status update failed", result)
}

const saveHelperAssignment = async(selectedHelper, ward, selectedVehicle) => {
  const userAssignmentPath = `AssignmentData/UserAssignments/${selectedHelper.Id}`
      const userAssignmentPayload = {
        task : ward,
        vehicle: selectedVehicle
      }

    const result = await db.saveData(userAssignmentPath, userAssignmentPayload);

    return result?.success
        ? result
        : common.setResponse(fail, "helper assignment failed", result);
}

const saveWorkAssignment = async(ward, selectedVehicle, selectedDriver, selectedHelper) => {
  const workAssignmentPath = `AssignmentData/WorkAssignment/${ward}`
      const workAssignmentPayload = {
        driver: selectedDriver.Id,
        helper: selectedHelper.Id,
        vehicle: selectedVehicle
      }

    const result = await db.saveData(workAssignmentPath, workAssignmentPayload);

    return result?.success
        ? result
        : common.setResponse(fail, "work assignment failed", result);
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
      const storage = await db.getReadyStorage();
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