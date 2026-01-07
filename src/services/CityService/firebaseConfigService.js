import * as sbs from "../supabaseServices";

/**
 * Saves or updates the Firebase configuration for a specific city.
 * @param {string} cityId - The UUID of the city.
 * @param {Object} firebaseConfig - The Firebase configuration object.
 */
export const saveCityFirebaseConfig = async (cityId, firebaseConfig) => {
    return new Promise(async (resolve, reject) => {
        if (!cityId || !firebaseConfig) {
            return reject('Invalid parameters');
        }

        try {
            const response = await sbs.updateData('Cities', 'CityId', cityId, { firebaseConfig });
            if (!response?.success) {
                return reject(response?.error || 'Failed to save Firebase configuration');
            }
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Fetches the Firebase configuration for a specific city.
 * @param {string} cityId - The UUID of the city.
 */
export const getCityFirebaseConfig = async (city_id) => {
    try {
        const result = await sbs.getDataByColumnName('Cities', 'city_id', city_id);
        if (result.success && result.data?.length > 0) {
            return { status: 'success', data: result.data[0].firebase_config };
        } else {
            return { status: 'error', message: result.error || 'City not found' };
        }
    } catch (err) {
        return { status: 'error', message: err.message || err };
    }
};
