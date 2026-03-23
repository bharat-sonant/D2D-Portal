import { subscribeVehicleLocation } from "../../../Services/VehicleLocationService/VehicleLocationService";

/**
 * Subscribe to live vehicle location for a given ward.
 * Calls onUpdate with { lat, lng } or null.
 *
 * @param {string|number} wardId
 * @param {function} onUpdate
 * @returns unsubscribe function
 */
export const subscribeVehicleLocationAction = (wardId, onUpdate) => {
    return subscribeVehicleLocation(wardId, onUpdate);
};
