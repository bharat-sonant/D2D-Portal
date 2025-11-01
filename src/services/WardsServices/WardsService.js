import * as db from '../dbServices'
import * as common from '../../common/common'
import axios from 'axios'
const fail = 'fail'
const success = 'success'

export const getAllWards = () => {
 return new Promise(async (resolve) => {
    try {
       const url =
      "https://firebasestorage.googleapis.com/v0/b/devtest-62768.firebasestorage.app/o/DevTest%2FDefaults%2FAvailableWard.json?alt=media";

      const response = await axios.get(url);

    // 🔹 Validate response
    if (!response || !response.data) {
      return common.setResponse(
        fail,
        "Empty or invalid response from Firebase",
        null
      );
    }
      resolve(
        common.setResponse(
          success,
          "Ward List fetched from Firebase Storage",
          response.data
        )
      );
    } catch (error) {
      console.error("Error in getAllWards:", error);
      resolve(
        common.setResponse(
          fail,
          "Error occurred while fetching wardList from storage",
          { error: error.message || error }
        )
      );
    }
  });
}

