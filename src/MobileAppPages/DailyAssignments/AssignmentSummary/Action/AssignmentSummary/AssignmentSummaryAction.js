import { getAllWards } from "../../Services/AssignmentService/AssignmentSummaryService"

export const getWards = (setWardsList, setLoading) => {
    getAllWards().then((response) => {
        if (response.status === 'success') {
            setWardsList(response.data.wardKeys);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else {
            setWardsList([]);
            setLoading(false);
        }
    });
};