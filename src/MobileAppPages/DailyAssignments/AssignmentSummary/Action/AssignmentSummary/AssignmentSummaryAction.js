import { checkDailyAssignmentSummaryData, getAllWards, getTaskStatus } from "../../Services/AssignmentService/AssignmentSummaryService"
import * as common from '../../../../../common/common'


    export const getWards = async (setWardsList, setLoading) => {
        return new Promise(async (resolve) => {
            const response = await getAllWards();
            if (response.status === "success") {
            setWardsList(response.data);
            setLoading(false);
            resolve(response);
            } else {
            setWardsList([]);
            setLoading(false);
            resolve(response);
            }
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


