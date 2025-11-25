import * as common from '../../../common/common'
import { completeAssignment, getTaskDetails } from "../../services/DutyOffService/DutyOff"

export const getDutyOffDetails = async(ward, setDetails) => {
  try{
    const result = await getTaskDetails(ward);
  if(result.status === "success"){
    setDetails(result.data)
  }else{
    common.setAlertMessage("warn", result.message)
    setDetails({})
  }
  return result;
  }catch(error){
    common.setAlertMessage("fail", "failed to fetch details for this task !")
  }
}

export const CompleteAssignmentAction = async(ward, vehicle, driver, helper) => {
  try{
    const result = await completeAssignment(ward, vehicle, driver, helper)
    if(result.status === "success"){
      common.setAlertMessage('success', result.message)
    }else{
      common.setAlertMessage('fail', result.message )
    }
     return result; 
  }catch(error){
    common.setAlertMessage("fail", "failed to complete assignment")
    return null;
  }
}