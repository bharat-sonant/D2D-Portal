import dayjs from "dayjs";
import { getWardDutyOnTimeFromDB } from "../../../Services/D2DMonitoringDutyIn"

export const getDutyInTime = (ward, setShowDutyInTime) => {
    try {
        const year = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const day = dayjs().format("YYYY-MM-DD");

        getWardDutyOnTimeFromDB(year, month, '2025-02-14', ward).then((response) => {
            console.log("Response: ", response);
            if (response.status === "Success") {
                const data = response.data;
                // If dutyInTime contains multiple records (object), join all values with ", "
                if (data && typeof data === "object" && !Array.isArray(data)) {
                    const values = Object.values(data).filter(Boolean);
                    setShowDutyInTime(values.length > 0 ? values.join(", ") : "");
                } else if (Array.isArray(data)) {
                    setShowDutyInTime(data.filter(Boolean).join(", "));
                } else {
                    setShowDutyInTime(data || "");
                }
            } else {
                setShowDutyInTime("");
            };
        });
    } catch (error) {
        console.error("Error fetching Duty In Time: ", error);
        setShowDutyInTime("");
    };
};