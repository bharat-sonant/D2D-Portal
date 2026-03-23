import * as db from "../../../services/dbServices";

const parseSlotString = (value) => {
    if (!value) return [];
    return String(value)
        .split("~")
        .map((part) => {
            const [lat, lng] = part.replace(/[()]/g, "").split(",").map(Number);
            return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
        })
        .filter(Boolean);
};

export const subscribeLocationHistory = (wardId, year, month, date, onUpdate) => {
    if (!wardId || !year || !month || !date) return () => {};

    const path = `LocationHistory/${wardId}/${year}/${month}/${date}`;

    return db.subscribeData(path, (data) => {
        if (!data) return onUpdate([]);
        const points = Object.keys(data)
            .sort()
            .flatMap((key) => {
                const slot = data[key];
                const raw = typeof slot === "string" ? slot : slot?.["lat-lng"];
                return parseSlotString(raw);
            });
        onUpdate(points);
    });
};
