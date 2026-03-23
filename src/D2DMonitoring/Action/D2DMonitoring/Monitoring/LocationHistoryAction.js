import dayjs from "dayjs";
import { subscribeLocationHistory } from "../../../Services/LocationHistoryService/LocationHistoryService";

export const subscribeLocationHistoryAction = (wardId, onUpdate) => {
    const now = dayjs();
    return subscribeLocationHistory(
        wardId,
        now.format("YYYY"),
        now.format("MMMM"),
        now.format("YYYY-MM-DD"),
        onUpdate
    );
};
