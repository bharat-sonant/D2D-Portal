import axios from "axios";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { setResponse } from "../../../common/common";
import { getStorageInstance } from "../../../firebase/firebaseService";
import { trackCall, saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

// ── Cache TTL: 24 hours (ward maps don't change daily) ──────────────────────
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const LS_LINES_KEY    = (cityName, wardId) => `wls_${cityName}_${wardId}`;
const LS_BOUNDARY_KEY = (cityName, wardId) => `wbd_${cityName}_${wardId}`;
const SS_URL_KEY      = (cityName, wardId) => `wls_url_${cityName}_${wardId}`;

function lsGet(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }
        return data;
    } catch { return null; }
}

function lsSet(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch { /* quota full */ }
}

// ── In-memory + in-flight maps ───────────────────────────────────────────────
const _wardLinesCache      = new Map();
const _wardLatestRefCache  = new Map();
const _wardBoundaryCache   = new Map();
const _wardBoundaryInFlight = new Map();
const _wardLinesInFlight    = new Map();

// ── getWardBoundaryFromStorage ───────────────────────────────────────────────
export const getWardBoundaryFromStorage = (storagePath, cityName, wardId) => {
    const cacheKey = `${cityName}_${wardId}`;

    // 1. In-memory (~0 ms)
    if (_wardBoundaryCache.has(cacheKey)) {
        return Promise.resolve(setResponse("Success", "Ward boundary fetched", _wardBoundaryCache.get(cacheKey)));
    }

    // 2. localStorage (~1-2 ms) — survives page refresh
    const lsData = lsGet(LS_BOUNDARY_KEY(cityName, wardId));
    if (lsData) {
        _wardBoundaryCache.set(cacheKey, lsData);
        return Promise.resolve(setResponse("Success", "Ward boundary fetched", lsData));
    }

    // 3. In-flight dedup
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
                lsSet(LS_BOUNDARY_KEY(cityName, wardId), response.data);
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

// ── getWardLinesFromStorage ──────────────────────────────────────────────────
export const getWardLinesFromStorage = (cityName, wardId) => {
    const cacheKey = `${cityName}_${wardId}`;

    // 1. In-memory (~0 ms)
    if (_wardLinesCache.has(cacheKey)) {
        return Promise.resolve(setResponse("Success", "Ward lines fetched", _wardLinesCache.get(cacheKey)));
    }

    // 2. localStorage (~1-2 ms) — survives page refresh
    const lsData = lsGet(LS_LINES_KEY(cityName, wardId));
    if (lsData) {
        _wardLinesCache.set(cacheKey, lsData);
        return Promise.resolve(setResponse("Success", "Ward lines fetched", lsData));
    }

    // 3. In-flight dedup
    if (_wardLinesInFlight.has(cacheKey)) {
        return _wardLinesInFlight.get(cacheKey);
    }

    const fetchPromise = (async () => {
        try {
            const storage = getStorageInstance();
            if (!storage) return setResponse("Fail", "Storage not ready", null);

            // 4. sessionStorage URL cache — skips listAll() + getDownloadURL()
            let downloadUrl = sessionStorage.getItem(SS_URL_KEY(cityName, wardId));

            if (!downloadUrl) {
                let latestRef = _wardLatestRefCache.get(cacheKey);
                if (!latestRef) {
                    const folderRef = ref(storage, `${cityName}/GeoJsonWard/${wardId}`);
                    const result = await listAll(folderRef);
                    if (!result.items.length) return setResponse("Fail", "No ward line files found", null);
                    const sorted = [...result.items].sort((a, b) => b.name.localeCompare(a.name));
                    latestRef = sorted[0];
                    _wardLatestRefCache.set(cacheKey, latestRef);
                }
                downloadUrl = await getDownloadURL(latestRef);
                try { sessionStorage.setItem(SS_URL_KEY(cityName, wardId), downloadUrl); } catch { }
            }

            const response = await axios.get(downloadUrl);

            if (response?.data) {
                _wardLinesCache.set(cacheKey, response.data);
                lsSet(LS_LINES_KEY(cityName, wardId), response.data);
                trackCall(`GeoJsonWardLines/${wardId}`, "axios", response.data);
                saveRealtimeDbServiceHistory('MapServices', 'getWardLinesFromStorage');
                saveRealtimeDbServiceDataHistory('MapServices', 'getWardLinesFromStorage', response.data);
                return setResponse("Success", "Ward lines fetched", response.data);
            }
            return setResponse("Fail", "No data in file", null);
        } catch (error) {
            try { sessionStorage.removeItem(SS_URL_KEY(cityName, wardId)); } catch { }
            return setResponse("Fail", error.message, null);
        } finally {
            _wardLinesInFlight.delete(cacheKey);
        }
    })();

    _wardLinesInFlight.set(cacheKey, fetchPromise);
    return fetchPromise;
};
