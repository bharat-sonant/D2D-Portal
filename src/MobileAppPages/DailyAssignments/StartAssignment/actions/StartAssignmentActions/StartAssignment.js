import { getAllVehicles } from "../../services/StartAssignmentService/StartAssignment";
import * as common from '../../../../../common/common'

export const fetchAllVehicles = async (setVehicles, setLoading) => {
  try {
    setLoading(true)
    const result = await getAllVehicles();
    if (result.status === "success" && result.data) {
      const vehicleArray = Object.entries(result.data).map(([key,value])=>({
        vehcileNo : key,
        ...value
      }))
      setVehicles(vehicleArray);
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
