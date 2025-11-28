import { checkDailyAssignmentSummaryData, checkNotAssignedKey, getAllWards, getTaskStatus } from "../../Services/AssignmentService/AssignmentSummaryService"
import * as common from '../../../../../common/common'


    export const getWards = async (setWardsList, setLoading) => {
        return new Promise(async (resolve) => {
            const response = await getAllWards();

            if (response.status === "success") {
            setWardsList(response.data.wardKeys);
            setLoading(false);
            resolve(response);
            } else {
            setWardsList([]);
            setLoading(false);
            resolve(response);
            }
        });
    };



export const checkNotAssignedValue = async (setWardsList, setLoading) => {
  return new Promise(async (resolve) => {
    const resp = await checkNotAssignedKey();

    if (resp.success === true && resp.data?.data?.wardKeys) {
      setWardsList(resp.data.data.wardKeys);
      resolve(resp);
    } else {
      const res = await getWards(setWardsList, setLoading);
      resolve(res);
    }
      setLoading(false);
  });
};


export const checkTaskStatus = async(ward) => {
    try{
        const result = await getTaskStatus(ward);
        if (result.status !== "success") {
              common.setAlertMessage("error", result.message);
        }
        return result;
    }catch(error){
        common.setResponse('fail', 'failed to fetch task status')
        return { status: "fail" };
    }
}


