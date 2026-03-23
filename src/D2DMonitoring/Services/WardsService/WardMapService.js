import axios from "axios";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { setResponse } from "../../../common/common";
import { getStorageInstance } from "../../../firebase/firebaseService";
import { trackCall, saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

// In-memory cache per session
const _wardLinesCache = new Map();       // "cityName_wardId" → geoJson data
const _wardLatestRefCache = new Map();   // "cityName_wardId" → latest file ref
const _wardBoundaryCache = new Map();    // "cityName_wardId" → boundary data

/**
 * Firebase Storage se selected ward ki boundary fetch karta hai.
 * Path: {storagePath}{cityName}%2FWardBoundryJson%2F{wardId}.json
 */
export const getWardBoundaryFromStorage = (storagePath, cityName, wardId) => {
    const cacheKey = `${cityName}_${wardId}`;
    if (_wardBoundaryCache.has(cacheKey)) {
        return Promise.resolve(setResponse("Success", "Ward boundary fetched", _wardBoundaryCache.get(cacheKey)));
    }

    return new Promise((resolve) => {
        if (!storagePath || !cityName || !wardId) {
            resolve(setResponse("Fail", "Invalid Params !!", null));
            return;
        }

        const url = `${storagePath}${encodeURIComponent(cityName)}%2FWardBoundryJson%2F${wardId}.json?alt=media`;

        axios.get(url)
            .then((response) => {
                if (response?.data) {
                    _wardBoundaryCache.set(cacheKey, response.data);
                    trackCall(`WardBoundaryStorage/${wardId}`, "axios", response.data);
                    saveRealtimeDbServiceHistory('WardMapService', 'getWardBoundaryFromStorage');
                    saveRealtimeDbServiceDataHistory('WardMapService', 'getWardBoundaryFromStorage', response.data);
                    resolve(setResponse("Success", "Ward boundary fetched", response.data));
                } else {
                    resolve(setResponse("Fail", "No boundary data found", null));
                }
            })
            .catch((error) => {
                resolve(setResponse("Fail", error.message, null));
            });
    });
};

/**
 * Firebase Storage SDK se ward lines fetch karta hai.
 * Folder: {cityName}/GeoJsonWard/{wardId}/
 * Cache: first fetch stores data + file ref; subsequent calls return instantly.
 */
export const getWardLinesFromStorage = async (cityName, wardId) => {
    const cacheKey = `${cityName}_${wardId}`;

    // Return from data cache immediately if available
    if (_wardLinesCache.has(cacheKey)) {
        return setResponse("Success", "Ward lines fetched", _wardLinesCache.get(cacheKey));
    }

    try {
        const storage = getStorageInstance();
        if (!storage) return setResponse("Fail", "Storage not ready", null);

        let latestRef = _wardLatestRefCache.get(cacheKey);

        // Only call listAll once per ward per session
        if (!latestRef) {
            const folderRef = ref(storage, `${cityName}/GeoJsonWard/${wardId}`);
            const result = await listAll(folderRef);
            if (!result.items.length) {
                return setResponse("Fail", "No ward line files found", null);
            }
            const sorted = [...result.items].sort((a, b) => b.name.localeCompare(a.name));
            latestRef = sorted[0];
            _wardLatestRefCache.set(cacheKey, latestRef);
        }

        const downloadUrl = await getDownloadURL(latestRef);
        const response = await axios.get(downloadUrl);

        if (response?.data) {
            _wardLinesCache.set(cacheKey, response.data);
            trackCall(`GeoJsonWardLines/${wardId}`, "axios", response.data);
            saveRealtimeDbServiceHistory('WardMapService', 'getWardLinesFromStorage');
            saveRealtimeDbServiceDataHistory('WardMapService', 'getWardLinesFromStorage', response.data);
            return setResponse("Success", "Ward lines fetched", response.data);
        }
        return setResponse("Fail", "No data in file", null);
    } catch (error) {
        return setResponse("Fail", error.message, null);
    }
};
