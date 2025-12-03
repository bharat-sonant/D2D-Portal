import * as db from '../../../services/dbServices'
import * as common from '../../../common/common'
import dayjs from 'dayjs'
const success = "success"
const fail = 'fail'
      const year = dayjs().format("YYYY");
      const month = dayjs().format("MMMM");
      const date = dayjs().format("YYYY-MM-DD");

export const fetchTaskVehicle = async(ward) => {
  return new Promise(async(resolve)=>{
    try{
      const path = `AssignmentData/WorkAssignment/${ward}`

      const result = await db.getData(path);

      if(result){
        resolve(common.setResponse(success, "Task data fetched successfully", result))
      }else{
        resolve(common.setResponse(fail, "No data exists for this task", {}))
      }
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch taks's data", {}))
    }
  })
}

export const getAllActiveVehicles = () => {
  return new Promise(async(resolve)=> {
    try{
      const path = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/NotAssigned`
      const result = await db.getData(path)

      const cleaned = Object.values(result || {}).filter(
        (v) => typeof v === "string" && v.trim() !== ""
      );

      resolve(common.setResponse(success, "vehicels fetched successfully", cleaned))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch vehicles"))
    }
  })
}

export const getActiveDrivers = () => {
  return new Promise(async(resolve)=> {
    try{
      const path = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Drivers/NotAssigned`
      const result = await db.getData(path);
      // const activeDrivers = Object.values(result)
       const activeDrivers = Object.entries(result)
        .filter(([key, value]) => value.taskAssigned !== "yes")   
        .map(([key, value]) => ({
          Id: value.id,
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
      const path = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Helpers/NotAssigned`
      const result = await db.getData(path);

      const activeHelpers = Object.entries(result)
        .filter(([key, value]) => value.taskAssigned !== "yes")   
        .map(([key, value]) => ({
          Id: value.id,
          name: value.name,
        }));

      resolve(common.setResponse(success, "fetched active drivers successfully", activeHelpers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}
