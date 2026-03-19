import dayjs from "dayjs";
import { getHaltInfoFromDB } from "../../../Services/HaltInfoService/HaltInfoService";

export const getHaltInfo = (ward, setHaltData) => {
    try {
        if (!ward) return;

        const year = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const date = dayjs().format("YYYY-MM-DD");

        getHaltInfoFromDB(year, month, date, ward).then((response) => {
            if (response.status === "Success") {
                setHaltData(response.data);
            } else {
                setHaltData(null);
            }
        });
    } catch (error) {
        console.error("Error fetching Halt Info: ", error);
        setHaltData(null);
    }
};
