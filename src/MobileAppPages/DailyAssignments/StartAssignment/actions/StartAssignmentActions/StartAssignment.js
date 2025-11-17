import { getAllVehicles, getDriversList, startAssignment } from "../../../../services/StartAssignmentService/StartAssignment";
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

export const fetchAllDrivers = async() => {
  try{
    const result = await getDriversList();
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
