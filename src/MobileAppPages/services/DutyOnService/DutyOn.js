import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
const fail = 'fail'
const success = 'success'

export const getAllActiveVehicles = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('Vehicles')

      const vehicleList = Object.entries(result).map(([vehicleNo, data])=>({
        vehicleNo,
        ...data
      }))

      resolve(common.setResponse(success, "vehicels fetched successfully", vehicleList))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch vehicles"))
    }
  })
}