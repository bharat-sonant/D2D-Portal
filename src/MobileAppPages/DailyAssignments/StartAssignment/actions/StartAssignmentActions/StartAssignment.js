import { getActiveDriversList, getAllVehicles, getAvailableDevices, getDriversList, refreshActiveDrivers, startAssignment } from "../../../../services/StartAssignmentService/StartAssignment";
import * as common from '../../../../../common/common'

export const fetchAllVehicles = async (setVehicles, setLoading, setActiveVehicles) => {
  try {
    setLoading(true)
    setVehicles([])
    const result = await getAllVehicles();
    if (result.status === "success" && result.data) {
      const vehicleArray = Object.entries(result.data).map(([key,value])=>({
        vehcileNo : key,
        ...value
      }))
      setVehicles(vehicleArray);

      const active = vehicleArray.filter((v)=> String(v.status) === '1')
      setActiveVehicles(active)
    } else {
      common.setAlertMessage('warn', result.message || 'No Vehicles found')
      setVehicles([]);
    }
  } catch (error) {
    common.setAlertMessage('error', 'Failed to fetch Vehicle list')
    setVehicles([])
  }finally{
    setLoading(false)
  }
};

export const startAssignmentAction = async (selectedVehicle, ward, driverId,driverDeviceId, helperId, helperDeviceId, city,user, setIsSaving) => {
  try {
    setIsSaving(true)
    const result = await startAssignment(selectedVehicle, ward, driverId,driverDeviceId, helperId, helperDeviceId,city , user);
    console.log('result',result)
     if (result.status === "success") {
      common.setAlertMessage("success", result.message);
    } else {
      common.setAlertMessage("error", result.message || "Failed to start assignment!");
    }
    return result;
  } catch (error) {
    common.setAlertMessage("error", "Error while starting assignment!");
    return { status: "fail" };
  }finally{
    setIsSaving(false)
  }
};

export const fetchAllActiveDrivers = async() => {
  try{
    const result = await getActiveDriversList();
    if(result.status === 'success' && result.data){
      return result.data;
    }else{
      common.setAlertMessage('warn', result.message || 'No Drivers found')
      return [];
    }
  }catch(error){
    common.setAlertMessage('error','Failed to fetch driver list')
    return [];
  }
}

export const refreshActiveDriverlist = async(setActiveDrivers, setLoading) => {
  try{
    setLoading(true)
    const result = await refreshActiveDrivers()

    if(result.status === "success"){
      const activeDriversArray = Object.values(result.data)
      setActiveDrivers(activeDriversArray)
    }else{
      common.setAlertMessage('warn', result.message || "no active drivers available")
    }
  }catch(error){
    common.setAlertMessage('error', "failed to fetch active drivers")
  }finally{
    setLoading(false)
  }
}

export const fetchAvailableDevices = async(city, setLoading) => {
  try{
    setLoading(true)
    const result = await getAvailableDevices(city);
    if(result.status === 'success' && result.data){
      return result.data;
    }else{
      common.setAlertMessage('warn', result.message || 'No availble devices found')
      return [];
    }
  }catch(error){
    common.setAlertMessage("warn", error.message || "No available devices")
    return [];
  }finally{
    setLoading(false)
  }
}
