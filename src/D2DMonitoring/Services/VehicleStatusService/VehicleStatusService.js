import { setResponse } from '../../../common/common';
import * as db from '../../../services/dbServices';

/**
 * 🔔 Subscribe to vehicle surfing history (realtime).
 * Path: GeoGraphicallySurfingHistory/{vehicleId}/{year}/{month}/{date}
 * Returns unsubscribe function — call in useEffect cleanup.
 */
export const subscribeVehicleSurfingHistoryFromDB = (vehicleId, year, month, date, onData) => {
    if (!vehicleId || !year || !month || !date) return () => {};
    const path = `GeoGraphicallySurfingHistory/${vehicleId}/${year}/${month}/${date}`;
    console.log("[VehicleStatusService] Subscribing to path:", path);
    return db.subscribeData(path, (data) => {
        console.log("[VehicleStatusService] Raw snapshot received:", data);
        if (data) onData(data);
    });
};

/**
 * 📦 One-time fetch of vehicle surfing history.
 * Path: GeoGraphicallySurfingHistory/{vehicleId}/{year}/{month}/{date}
 */
export const getVehicleSurfingHistoryFromDB = async (vehicleId, year, month, date) => {
    return new Promise((resolve) => {
        try {
            if (!vehicleId || !year || !month || !date) {
                resolve(setResponse("Fail", "Invalid Params !!", { vehicleId, year, month, date }));
                return;
            }
            const path = `GeoGraphicallySurfingHistory/${vehicleId}/${year}/${month}/${date}`;
            console.log("[VehicleStatusService] Fetching from path:", path);
            db.getData(path).then((resp) => {
                if (resp !== null) {
                    resolve(setResponse("Success", "Vehicle Surfing History Fetched Successfully !!", resp));
                } else {
                    resolve(setResponse("Fail", "No Surfing History Found !!", {}));
                }
            });
        } catch (error) {
            console.error("[VehicleStatusService] Error fetching Vehicle Surfing History:", error);
            resolve(setResponse("Fail", "Error fetching Vehicle Surfing History !!", error.message));
        }
    });
};
