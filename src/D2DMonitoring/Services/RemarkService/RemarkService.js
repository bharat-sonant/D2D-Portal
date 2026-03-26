import dayjs from 'dayjs';
import * as db from '../../../services/dbServices';
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from '../DbServiceTracker/serviceTracker';

const FILE = 'RemarkService';

const todayParts = () => ({
    year:  dayjs().format('YYYY'),
    month: dayjs().format('MMMM'),
    date:  dayjs().format('YYYY-MM-DD'),
});

const remarkPath = (wardId) => {
    const { year, month, date } = todayParts();
    return `Remarks/${wardId}/${year}/${month}/${date}`;
};

export const getRemark = (wardId) => {
    if (!wardId) return Promise.resolve([]);
    return db.getData(remarkPath(wardId))
        .then((data) => {
            if (!data) return [];
            const list = Object.entries(data)
                .map(([id, val]) => ({ id, ...val }))
                .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
            saveRealtimeDbServiceHistory(FILE, 'getRemark');
            saveRealtimeDbServiceDataHistory(FILE, 'getRemark', data);
            return list;
        })
        .catch(() => []);
};

export const subscribeRemarks = (wardId, onUpdate) => {
    if (!wardId) return () => {};
    const remarksMap = new Map();
    const notify = () => {
        onUpdate([...remarksMap.values()].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
    };
    const onAdded   = (id, val) => { remarksMap.set(id, { id, ...val }); notify(); };
    const onChanged = (id, val) => { remarksMap.set(id, { id, ...val }); notify(); };
    const onRemoved = (id)      => { remarksMap.delete(id); notify(); };
    return db.subscribeChildEvents(remarkPath(wardId), onAdded, onChanged, onRemoved);
};

export const getRemarkCategories = async () => {
    try {
        const data = await db.getData('RemarkCategory');
        if (!data || typeof data !== 'object') return [];
        saveRealtimeDbServiceHistory(FILE, 'getRemarkCategories');
        return Object.entries(data).map(([id, val]) => ({
            id,
            name:  typeof val === 'string' ? val : (val?.name ?? val?.title ?? String(id)),
            image: typeof val === 'object'  ? (val?.image ?? null) : null,
        }));
    } catch { return []; }
};

export const saveRemark = async (wardId, remarkData) => {
    if (!wardId) return { success: false, message: 'No ward selected' };
    try {
        return await db.pushData(remarkPath(wardId), {
            ...remarkData,
            time:      dayjs().format('h:mm:ss A'),
            createdAt: Date.now(),
        });
    } catch (error) { return { success: false, message: error.message }; }
};

export const updateRemark = async (wardId, remarkId, remarkData) => {
    if (!wardId || !remarkId) return { success: false, message: 'Invalid params' };
    try {
        return await db.saveData(`${remarkPath(wardId)}/${remarkId}`, remarkData);
    } catch (error) { return { success: false, message: error.message }; }
};

export const deleteRemark = async (wardId, remarkId) => {
    if (!wardId || !remarkId) return { success: false, message: 'Invalid params' };
    try {
        return await db.removeData(`${remarkPath(wardId)}/${remarkId}`);
    } catch (error) { return { success: false, message: error.message }; }
};
