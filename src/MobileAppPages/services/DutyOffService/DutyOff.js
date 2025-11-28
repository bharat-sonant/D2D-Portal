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
        moveVehicleToAvailableForNextTripResult, removeVehicleFromCurrentlyInUseResult
      ] = await Promise.all([
        updateAssignmentSummaryStatus(year, monthName, date, ward),
        moveToCompleted(ward),
        removeFromInProgress(ward),
        moveVehicleToAvailableForNextTrip(selectedVehicle),
        removeVehicleFromCurrentlyInUse(selectedVehicle)
      ])
      if(isFail(assignmentSummaryResult)) return resolve(assignmentSummaryResult);
      if(isFail(moveTaskToCompletedResult)) return resolve(moveTaskToCompletedResult);
      if(isFail(removeTaskFromInProgressResult)) return resolve(removeTaskFromInProgressResult);
if(isFail(moveVehicleToAvailableForNextTripResult)) return resolve(moveVehicleToAvailableForNextTripResult);
if(isFail(removeVehicleFromCurrentlyInUseResult)) return resolve(removeVehicleFromCurrentlyInUseResult);
      const finalResult = {
              assignmentSummary : assignmentSummaryResult,
              moveToCompleted : moveTaskToCompletedResult,
              removeTaskFromInProgress : removeTaskFromInProgressResult,
              moveVehicleToAvailableForNextTripResult,
              removeVehicleFromCurrentlyInUseResult,
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