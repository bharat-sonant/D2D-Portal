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

export const getActiveDrivers = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('ActiveDrivers');

      // const activeDrivers = Object.values(result)
      const activeDrivers = Object.entries(result).map(([Key, value])=>({
        Id : Key,
        name: value.name
      }))

      resolve(common.setResponse(success, "fetched active drivers successfully", activeDrivers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}