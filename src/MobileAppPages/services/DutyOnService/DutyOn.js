import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
const fail = 'fail'
const success = 'success'
const isFail = (res) => res?.status === "fail";

export const getAllActiveVehicles = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('Vehicles')

      const vehicleList = Object.entries(result).map(([vehicleNo, data])=>({
        vehicleNo,
        ...data
      }))

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
      const activeDrivers = Object.entries(result).map(([Key, value])=>({
        Id : Key,
        name: value.name
      }))

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

      // const activeDrivers = Object.values(result)
      const activeHelpers = Object.entries(result).map(([Key, value])=>({
        Id : Key,
        name: value.name
      }))

      resolve(common.setResponse(success, "fetched active drivers successfully", activeHelpers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}

export const startAssignmentService = (ward, selectedVehicle, selectedDriver, selectedHelper) => {
  return new Promise(async(resolve)=> {
    try{
      
      const [driverAssignmentResult, helperAssignmentResult, workAssignmentResult] = await Promise.all([
        saveDriverAssignment(selectedDriver, ward, selectedVehicle),
        saveHelperAssignment(selectedHelper, ward, selectedVehicle),
        saveWorkAssignment(ward, selectedVehicle, selectedDriver, selectedHelper)
      ])
      if (isFail(driverAssignmentResult)) return resolve(driverAssignmentResult);
      if (isFail(workAssignmentResult)) return resolve(workAssignmentResult);
      if(isFail(helperAssignmentResult)) return resolve(helperAssignmentResult)
      const finalResult = {
        driverAssignment: driverAssignmentResult,
        helperAssignment: helperAssignmentResult,
        workAssignment: workAssignmentResult,
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