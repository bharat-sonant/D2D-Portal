import * as db from "../../../services/dbServices";

/**
 * Subscribe to live vehicle location.
 * Path: /CurrentLocationInfo/{wardId}/latLng
 *
 * @param {string|number} wardId
 * @param {function} onUpdate - called with { lat, lng } or null
 * @returns unsubscribe function
 */
export const subscribeVehicleLocation = (wardId, onUpdate) => {
    if (!wardId) return () => {};
    return db.subscribeData(
        `CurrentLocationInfo/${wardId}/latLng`,
        (data) => {
            if (!data) return onUpdate(null);
            const [lat, lng] = String(data).split(",").map(Number);
            onUpdate(isNaN(lat) || isNaN(lng) ? null : { lat, lng });
        }
    );
};
