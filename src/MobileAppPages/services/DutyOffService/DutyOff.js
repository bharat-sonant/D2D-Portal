import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
import { getDateTimeDetails } from '../DutyOnService/DutyOn'
const fail = 'fail'
const success = 'success'
const isFail = (res) => res?.status === "fail";

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
      const [driverTaskStatusResult, helperTaskStatusResult, vehicleTaskStatusResult,assignmentSummaryResult] = await Promise.all([
        removeDriverTaskStatus(selectedDriver),
        removeHelperTaskStatus(selectedHelper),
        removeVehicleTaskStatus(selectedVehicle),
        updateAssignmentSummaryStatus(year, monthName, date, ward),
      ])
       if (isFail(driverTaskStatusResult)) return resolve(driverTaskStatusResult);
      if(isFail(helperTaskStatusResult)) return resolve(helperTaskStatusResult);
      if(isFail(vehicleTaskStatusResult)) return resolve(vehicleTaskStatusResult);
      if(isFail(assignmentSummaryResult)) return resolve(assignmentSummaryResult);

      const finalResult = {
              driverTaskStatus : driverTaskStatusResult,
              helperTaskStatus : helperTaskStatusResult,
              vehicleTaskStatus : vehicleTaskStatusResult,
              assignmentSummary : assignmentSummaryResult,
            }
      
            return resolve(
              common.setResponse(success, "Assignment completed successfully", finalResult)
            );
    }catch(error){
      resolve(common.setResponse(fail, "failed to complete assignment"))
    }
  })
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