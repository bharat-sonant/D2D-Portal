import { checkNotAssignedKey, getAllWards } from "../../Services/AssignmentService/AssignmentSummaryService"

export const getWards = (setWardsList, setLoading) => {
    getAllWards().then((response) => {
        if (response.status === 'success') {
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
