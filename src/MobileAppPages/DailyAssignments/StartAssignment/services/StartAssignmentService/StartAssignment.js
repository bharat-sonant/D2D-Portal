import * as db from "../../../../../services/dbServices";
import * as common from "../../../../../common/common";
const success = "success";
const fail = "fail";

export const getAllVehicles = async () => {
  return new Promise(async (resolve) => {
    try {
      const result = await db.getData(`Vehicles`);
      if (result) {
        resolve(common.setResponse(success, "Vehicles fetched successfully", result));
      } else {
        resolve(common.setResponse(fail, "No vehicles found", []));
      }
    } catch (error) {
      resolve(common.setResponse(fail, "Failed to fetch vehicles", []));
    }
  });
};
