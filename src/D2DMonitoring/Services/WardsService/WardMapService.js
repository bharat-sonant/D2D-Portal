import axios from "axios";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { setResponse } from "../../../common/common";
import { getStorageInstance } from "../../../firebase/firebaseService";
import { trackCall, saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

const _wardLinesCache = new Map();
const _wardLatestRefCache = new Map();
const _wardBoundaryCache = new Map();
const _wardBoundaryInFlight = new Map(); // deduplicates concurrent boundary fetches
const _wardLinesInFlight = new Map();    // deduplicates concurrent lines fetches

export const getWardBoundaryFromStorage = (storagePath, cityName, wardId) => {
    const cacheKey = `${cityName}_${wardId}`;

    // 1. In-memory cache — zero cost
    if (_wardBoundaryCache.has(cacheKey)) {
        return Promise.resolve(setResponse("Success", "Ward boundary fetched", _wardBoundaryCache.get(cacheKey)));
    }

    // 2. In-flight dedup — if same ward is already being fetched, reuse that promise
    if (_wardBoundaryInFlight.has(cacheKey)) {
        return _wardBoundaryInFlight.get(cacheKey);
    }

    if (!storagePath || !cityName || !wardId) {
        return Promise.resolve(setResponse("Fail", "Invalid Params !!", null));
    }

    const url = `${storagePath}${encodeURIComponent(cityName)}%2FWardBoundryJson%2F${wardId}.json?alt=media`;

    const promise = axios.get(url)
        .then((response) => {
            if (response?.data) {
                _wardBoundaryCache.set(cacheKey, response.data);
                trackCall(`WardBoundaryStorage/${wardId}`, "axios", response.data);
                saveRealtimeDbServiceHistory('MapServices', 'getWardBoundaryFromStorage');
                saveRealtimeDbServiceDataHistory('MapServices', 'getWardBoundaryFromStorage', response.data);
                return setResponse("Success", "Ward boundary fetched", response.data);
            }
            return setResponse("Fail", "No boundary data found", null);
        })
        .catch((error) => setResponse("Fail", error.message, null))
        .finally(() => _wardBoundaryInFlight.delete(cacheKey));

    _wardBoundaryInFlight.set(cacheKey, promise);
    return promise;
};

const _ssUrlKey = (cityName, wardId) => `wls_url_${cityName}_${wardId}`;

export const getWardLinesFromStorage = (cityName, wardId) => {
    const cacheKey = `${cityName}_${wardId}`;

    // 1. In-memory cache — fastest, zero cost
    if (_wardLinesCache.has(cacheKey)) {
        return Promise.resolve(setResponse("Success", "Ward lines fetched", _wardLinesCache.get(cacheKey)));
    }

    // 2. In-flight dedup — if same ward is already being fetched, reuse that promise
    if (_wardLinesInFlight.has(cacheKey)) {
        return _wardLinesInFlight.get(cacheKey);
    }

    const fetchPromise = (async () => {
        try {
            const storage = getStorageInstance();
            if (!storage) return setResponse("Fail", "Storage not ready", null);

            // 3. sessionStorage URL cache — skips listAll() + getDownloadURL() on page reload
            let downloadUrl = sessionStorage.getItem(_ssUrlKey(cityName, wardId));

            if (!downloadUrl) {
                let latestRef = _wardLatestRefCache.get(cacheKey);
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
                downloadUrl = await getDownloadURL(latestRef);
                try { sessionStorage.setItem(_ssUrlKey(cityName, wardId), downloadUrl); } catch { /* quota full — skip */ }
            }

            const response = await axios.get(downloadUrl);

            if (response?.data) {
                _wardLinesCache.set(cacheKey, response.data);
                trackCall(`GeoJsonWardLines/${wardId}`, "axios", response.data);
                saveRealtimeDbServiceHistory('MapServices', 'getWardLinesFromStorage');
                saveRealtimeDbServiceDataHistory('MapServices', 'getWardLinesFromStorage', response.data);
                return setResponse("Success", "Ward lines fetched", response.data);
            }
            return setResponse("Fail", "No data in file", null);
        } catch (error) {
            // If cached URL expired/invalid, clear it so next call retries fresh
            try { sessionStorage.removeItem(_ssUrlKey(cityName, wardId)); } catch { }
            return setResponse("Fail", error.message, null);
        } finally {
            _wardLinesInFlight.delete(cacheKey);
        }
    })();

    _wardLinesInFlight.set(cacheKey, fetchPromise);
    return fetchPromise;
};
