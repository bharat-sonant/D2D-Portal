import { checkDailyAssignmentSummaryData, checkNotAssignedKey, getAllWards, getTaskStatus } from "../../Services/AssignmentService/AssignmentSummaryService"
import * as common from '../../../../../common/common'

export const getWards = (setWardsList, setLoading) => {
    getAllWards().then((response) => {
        if (response.status === 'success') {
            console.log('resposn',response)
            setWardsList(response.data.wardKeys);
            setLoading(false);
        } else {
            setWardsList([]);
            setLoading(false);
        }
    });
};

export const checkNotAssignedValue = (setWardsList, setLoading) => {
    checkNotAssignedKey().then((resp) => {
        if (resp.success === true && resp.data?.data?.wardKeys) {
            setWardsList(resp.data.data.wardKeys);
        } else {
            getWards(setWardsList, setLoading);
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


