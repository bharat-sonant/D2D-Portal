import { getAllVehicles, startAssignment } from "../../services/StartAssignmentService/StartAssignment";
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
      common.setAlertMessage('warn', 'No Vehicles found')
      setVehicles([]);
    }
  } catch (error) {
    common.setAlertMessage('error', 'Failed to fetch Vehicle list')
    setVehicles([])
  }finally{
    setLoading(false)
  }
};

export const startAssignmentAction = async (selectedVehicle, ward, driverId,driverDeviceId, helperId, helperDeviceId) => {
  try {
    const result = await startAssignment(selectedVehicle, ward, driverId,driverDeviceId, helperId, helperDeviceId);
    console.log('result', result)
    if (result.status === "success") {
      common.setAlertMessage("success", "Assignment started successfully!");
    } else {
      common.setAlertMessage("error", "Failed to start assignment!");
    }
    return result;
  } catch (error) {
    common.setAlertMessage("error", "Error while starting assignment!");
    return { status: "fail" };
  }
};
