import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
const fail = 'fail'
const success = 'success'

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