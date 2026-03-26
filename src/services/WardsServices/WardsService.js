import * as db from '../dbServices'
import * as common from '../../common/common'
const fail = 'fail'
const success = 'success'


export const getAllVehicles = () => {
  return new Promise(async (resolve) => {
    try {
      const result = await db.getData("Vehicles");

      // 🔹 Validate result
      if (!result) {
        return resolve(
          common.setResponse(fail, "No vehicle data found", null)
        );
      }

      resolve(
        common.setResponse(
          success,
          "Vehicle list fetched successfully",
          result
        )
      );
    } catch (error) {
      console.error("Error in getAllVehicles:", error);
      resolve(
        common.setResponse(
          fail,
          "Error occurred while fetching vehicle data",
          { error: error.message || error }
        )
      );
    }
  });
};
