import dayjs from "dayjs";
import { getTravelPath } from "../../../Services/LocationHistoryService/LocationHistoryService";

export const subscribeLocationHistoryAction = (wardId, onUpdate) => {
    const now = dayjs();
    return getTravelPath(
        wardId,
        now.format("YYYY"),
        now.format("MMMM"),
        now.format("YYYY-MM-DD"),
        onUpdate
    );
};
