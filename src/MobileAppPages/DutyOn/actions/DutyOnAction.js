import * as common from '../../../common/common'
import { getAllActiveVehicles } from '../../services/DutyOnService/DutyOn'

export const fetchAllVehicles = async(setLoading, setActiveVehicles) => {
  try{
    setLoading(true)
    const result = await getAllActiveVehicles();
    if (result.status === "success" && result.data) {
      const active = result?.data?.filter((v)=> String(v.status) === '1')
      setActiveVehicles(active)
    }else{
      common.setAlertMessage('fail', 'No vehicles found', [])
    }
  }catch(error){
    common.setAlertMessage('fail', 'failed to fetch vehicles', [])
  }finally{
    setLoading(false)
  }
}