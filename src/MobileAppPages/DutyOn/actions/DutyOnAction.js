import * as common from '../../../common/common'
import { getActiveDrivers, getActiveHelpers, getAllActiveVehicles, startAssignmentService } from '../../services/DutyOnService/DutyOn'

export const fetchAllVehicles = async(setLoading, setActiveVehicles) => {
  try{
    setLoading(true)
    const result = await getAllActiveVehicles();
    if (result.status === "success" && result.data.length > 0) {
      setActiveVehicles(result?.data)
    }else{
      common.setAlertMessage('fail', 'No vehicles found')
      setActiveVehicles([])
    }
  }catch(error){
    common.setAlertMessage('fail', 'failed to fetch vehicles')
    setActiveVehicles([])
  }finally{
    setLoading(false)
  }
}

export const fetchAllActiveDrivers = async(setLoading, setActiveDrivers) => {
  try{
    setLoading(true)
    const result = await getActiveDrivers();
    if(result.status === "success" && result.data.length > 0){
      setActiveDrivers(result.data)
    }else{
      setActiveDrivers([])
      common.setAlertMessage('fail', "No active driver found.")
    }
  }catch(error){
    setActiveDrivers([])
    common.setAlertMessage('fail', "Failed to fetch drivers")
  }finally{
    setLoading(false)
  }
}

export const fetchAllActiveHelpers = async(setLoading, setActiveHelpers) => {
  try{
    setLoading(true)
    const result = await getActiveHelpers();
    if(result.status === "success" && result.data.length > 0){
      setActiveHelpers(result.data)
    }else{
      setActiveHelpers([])
      common.setAlertMessage('fail', "No active driver found.")
    }
  }catch(error){
    setActiveHelpers([])
    common.setAlertMessage('fail', "Failed to fetch drivers")
  }finally{
    setLoading(false)
  }
}

export const startAssignmentAction = async(setIsSaving, ward, selectedVehicle, selectedDriver, selectedHelper) => {
  try{
    setIsSaving(true);
    const result = await startAssignmentService(ward, selectedVehicle, selectedDriver, selectedHelper)
    if (result.status === "success") {
      common.setAlertMessage("success", result.message);
    } else {
      common.setAlertMessage("error", result.message || "Failed to start assignment!");
    }
      return result;
  }catch(error){
    common.setResponse('fail', 'failed to start assignment')
    return { status: "fail" };
  }finally{
    setIsSaving(false)
  }
}