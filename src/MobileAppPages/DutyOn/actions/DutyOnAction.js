import * as common from '../../../common/common'
import { getActiveDrivers, getActiveHelpers, getAllActiveVehicles } from '../../services/DutyOnService/DutyOn'

export const fetchAllVehicles = async(setLoading, setActiveVehicles) => {
  try{
    setLoading(true)
    const result = await getAllActiveVehicles();
    if (result.status === "success" && result.data.length > 0) {
      const active = result?.data?.filter((v)=> String(v.status) === '1')
      setActiveVehicles(active)
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