import { subscribeChildEvents } from "../../../services/dbServices";
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

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

const parseSlot = (slot) => {
    const raw = typeof slot === "string" ? slot : slot?.["lat-lng"];
    return parseSlotString(raw);
};

export const getTravelPath = (wardId, year, month, date, onUpdate) => {
    if (!wardId || !year || !month || !date) return () => {};

    const path = `LocationHistory/${wardId}/${year}/${month}/${date}`;

    // Accumulate slots by key — only new/changed slots trigger a re-render
    // Old slots are NEVER re-downloaded (unlike onValue which re-sends everything)
    const slots = new Map(); // key → parsed points[]
    let tracked = false;

    const rebuild = () => {
        const points = [...slots.keys()]
            .sort()
            .flatMap((k) => slots.get(k));
        onUpdate(points);
    };

    const onAdded = (key, slot) => {
        if (!tracked) {
            saveRealtimeDbServiceHistory('MapServices', 'getTravelPath');
            saveRealtimeDbServiceDataHistory('MapServices', 'getTravelPath', slot);
            tracked = true;
        }
        slots.set(key, parseSlot(slot));
        rebuild();
    };

    const onChanged = (key, slot) => {
        slots.set(key, parseSlot(slot));
        rebuild();
    };

    return subscribeChildEvents(path, onAdded, onChanged);
};
