import dayjs from 'dayjs';
import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
import { getDateTimeDetails } from '../UtilServices/DateTImeUtil';
const fail = 'fail'
const success = 'success'
const isFail = (res) => res?.status === "fail";
const year = dayjs().format('YYYY')
const month = dayjs().format('MMMM')
const date = dayjs().format('YYYY-MM-DD')

export const getTaskDetails = async(ward)=>{
 return new Promise(async(resolve) => {
  try{
    const path = `AssignmentData/WorkAssignment/${ward}`
    const result = await db.getData(path);
    console.log('resultttt',result)

    if(result){
      resolve(common.setResponse(success, "task details fetched successfully", result))
    }else{
      resolve(common.setResponse(fail, "No details found for this task", {}))
    }
  }catch(error){
    resolve(common.setResponse(fail, "failed to fetch task details", {}))
  }
 })
}

export const completeAssignment = (ward, selectedVehicle, selectedDriver, selectedHelper) => {
  return new Promise(async(resolve)=> {
    try{
      const { year, monthName, date, time, formattedDate } = getDateTimeDetails();
      const [assignmentSummaryResult, moveTaskToCompletedResult, removeTaskFromInProgressResult,
        moveVehicleToAvailableForNextTripResult, removeVehicleFromCurrentlyInUseResult,
        moveDriverToCompletedResult, removeDriverFromInProgressResult,
        moveHelperToCompletedResult, removeHelperFromInProgressResult
      ] = await Promise.all([
        updateAssignmentSummaryStatus(year, monthName, date, ward),
        moveToCompleted(ward),
        removeFromInProgress(ward),
        moveVehicleToAvailableForNextTrip(selectedVehicle),
        removeVehicleFromCurrentlyInUse(selectedVehicle),
        moveDriverToCompleted(selectedDriver),
        removeDriverFromInProgress(selectedDriver),
        moveHelperToCompleted(selectedHelper),
        removeHelperFromInProgress(selectedHelper)
      ])
      if(isFail(assignmentSummaryResult)) return resolve(assignmentSummaryResult);
      if(isFail(moveTaskToCompletedResult)) return resolve(moveTaskToCompletedResult);
      if(isFail(removeTaskFromInProgressResult)) return resolve(removeTaskFromInProgressResult);
      if(isFail(moveVehicleToAvailableForNextTripResult)) return resolve(moveVehicleToAvailableForNextTripResult);
      if(isFail(removeVehicleFromCurrentlyInUseResult)) return resolve(removeVehicleFromCurrentlyInUseResult);
      if(isFail(moveDriverToCompletedResult)) return resolve(moveDriverToCompletedResult);
      if(isFail(removeDriverFromInProgressResult)) return resolve(removeDriverFromInProgressResult);
      if(isFail(moveHelperToCompletedResult)) return resolve(moveHelperToCompletedResult);
      if(isFail(removeHelperFromInProgressResult)) return resolve(removeHelperFromInProgressResult);
      const finalResult = {
              assignmentSummary : assignmentSummaryResult,
              moveToCompleted : moveTaskToCompletedResult,
              removeTaskFromInProgress : removeTaskFromInProgressResult,
              moveVehicleToAvailableForNextTripResult,
              removeVehicleFromCurrentlyInUseResult,
              moveDriverToCompletedResult,
              removeDriverFromInProgressResult,
              moveHelperToCompletedResult, 
              removeHelperFromInProgressResult
            }
      
            return resolve(
              common.setResponse(success, "Assignment completed successfully", finalResult)
            );
    }catch(error){
      resolve(common.setResponse(fail, "failed to complete assignment"))
    }
  })
}

const moveToCompleted = async(ward) => {
  const completedPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Task/Completed`

  const existing = await db.getData(completedPath);

   const payload = existing ? { ...existing } : {};

  const nextIndex = existing ? Object.keys(existing).length + 1 : 1;

  payload[nextIndex] = ward;

  const result = await db.saveData(completedPath, payload);

  return result?.success
        ? result
        : common.setResponse(fail, "Task failed to move into completed bucket", result);
}

const removeFromInProgress = async(ward) => {
  const inProgressPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Task/InProgress`

  const existing = await db.getData(inProgressPath);

  let keyToRemove = null;

  Object.keys(existing).forEach((key)=>{
    if(existing[key] === ward){
      keyToRemove = key
    }
  })

  if(keyToRemove === null){
    return
  }

  const removePath = `${inProgressPath}/${keyToRemove}`
  const result = await db.removeData(removePath);

   return result?.success
        ? result
        : common.setResponse(fail, "Task failed to remove from not assigned bucket", result);
}

const moveVehicleToAvailableForNextTrip = async(selectedVehicle) => {
  const path = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/AvialbleForNextTrip`

  const existing = await db.getData(path);

  
  const payload = existing ? { ...existing } : {};

  const nextIndex = existing ? Object.keys(existing).length + 1 : 1;
  payload[nextIndex] = selectedVehicle;

  const result = await db.saveData(path, payload);

  return result?.success
        ? result
        : common.setResponse(fail, "Vehicle failed to move into inProgress bucket", result);
}

const removeVehicleFromCurrentlyInUse = async(selectedVehicle) => {
  const path = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/CurrentlyInUse`

  const existing = await db.getData(path);

  let keyToRemove = null;

  Object.keys(existing).forEach((key)=>{
    if(existing[key] === selectedVehicle){
      keyToRemove = key
    }
  })

  if(keyToRemove === null){
    return
  }

  const removePath = `${path}/${keyToRemove}`
  const result = await db.removeData(removePath);
console.log('result',result)
   return result?.success
        ? result
        : common.setResponse(fail, "Vehicle failed to remove from not assigned bucket", result);
}

const moveDriverToCompleted = async(selectedDriver) => {
  console.log('selected Driver',selectedDriver)
  const inProgressPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Drivers/AvialableforNexTrip`

  const existing = await db.getData(inProgressPath);

  const payload = existing ? { ...existing } : {};

  const nextIndex = existing ? Object.keys(existing).length + 1 : 1;

  payload[nextIndex] = selectedDriver;

  const result = await db.saveData(inProgressPath, payload);
console.log('result',result)
  return result?.success
        ? result
        : common.setResponse(fail, "Driver failed to move into completed bucket", result);
}

const removeDriverFromInProgress = async(selectedDriver) => {
  console.log('selecteddriver',selectedDriver)
  const notAssignedPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Drivers/CurrentlyWorking`

  const existing = await db.getData(notAssignedPath);

  let keyToRemove = null;

  Object.keys(existing).forEach((key)=>{
    if(existing[key]?.id === selectedDriver.Id){
      keyToRemove = key
    }
  })

  if(keyToRemove === null){
    return
  }

  const removePath = `${notAssignedPath}/${keyToRemove}`
  const result = await db.removeData(removePath);

   return result?.success
        ? result
        : common.setResponse(fail, "Driver failed to remove from not assigned bucket", result);
}

const moveHelperToCompleted = async(selectedVehicle) => {
  const inProgressPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Helpers/AvialableforNexTrip`

  const existing = await db.getData(inProgressPath);

  const payload = existing ? { ...existing } : {};

  const nextIndex = existing ? Object.keys(existing).length + 1 : 1;

  payload[nextIndex] = selectedVehicle;

  const result = await db.saveData(inProgressPath, payload);

  return result?.success
        ? result
        : common.setResponse(fail, "Vehicle failed to move into inProgress bucket", result);
}

const removeHelperFromInProgress = async(selectedVehicle) => {
  const notAssignedPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Helpers/CurrentlyWorking`

  const existing = await db.getData(notAssignedPath);

  let keyToRemove = null;

  Object.keys(existing).forEach((key)=>{
    if(existing[key]?.id === selectedVehicle.Id){
      keyToRemove = key
    }
  })

  if(keyToRemove === null){
    return
  }

  const removePath = `${notAssignedPath}/${keyToRemove}`
  const result = await db.removeData(removePath);

   return result?.success
        ? result
        : common.setResponse(fail, "Vehicle failed to remove from not assigned bucket", result);
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

const removeDriverTaskStatus = async(selectedDriver) => {
  const path = `ActiveDrivers/${selectedDriver}/taskAssigned`
      

    const result = await db.removeData(path);

    return result?.success
        ? result
        : common.setResponse(fail, "failed to remove driver task status", result);
}

const removeHelperTaskStatus = async(selectedHelper) => {
  const path = `ActiveHelpers/${selectedHelper}/taskAssigned`
  

  const result = await db.removeData(path);

  return result.success
      ? result
      : common.setResponse(fail, "failed to remove helper task status", result)
}

const removeVehicleTaskStatus = async(selectedVehicle) => {
  const path = `Vehicles/${selectedVehicle}/taskAssigned`

  const result = await db.removeData(path);

  return result.success
      ? result
      : common.setResponse(fail, "failed to remove vehicle status", result)
}

const updateAssignmentSummaryStatus = async(year, monthName, date, ward) => {
  const path = `AssignmentData/AssignmentSummary/${year}/${monthName}/${date}/Task`;
  const payload ={
    [ward] : "Completed"
  }

  const result = await db.saveData(path, payload);

  return result.success
    ? result
    : common.setResponse(fail, "assignment summary status update failed", result)
}