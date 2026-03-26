import axios from "axios";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { setResponse } from "../../../common/common";
import { getStorageInstance } from "../../../firebase/firebaseService";
import { trackCall, saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../DbServiceTracker/serviceTracker";

export const getWardBoundaryFromStorage = (storagePath, cityName, wardId) => {
    if (!storagePath || !cityName || !wardId) {
        return Promise.resolve(setResponse("Fail", "Invalid Params !!", null));
    }
    const url = `${storagePath}${encodeURIComponent(cityName)}%2FWardBoundryJson%2F${wardId}.json?alt=media`;
    return axios.get(url)
        .then((response) => {
            if (response?.data) {
                trackCall(`WardBoundaryStorage/${wardId}`, "axios", response.data);
                saveRealtimeDbServiceHistory('MapServices', 'getWardBoundaryFromStorage');
                saveRealtimeDbServiceDataHistory('MapServices', 'getWardBoundaryFromStorage', response.data);
                return setResponse("Success", "Ward boundary fetched", response.data);
            }
            return setResponse("Fail", "No boundary data found", null);
        })
        .catch((error) => setResponse("Fail", error.message, null));
};

export const getWardLinesFromStorage = async (cityName, wardId) => {
    try {
        const storage = getStorageInstance();
        if (!storage) return setResponse("Fail", "Storage not ready", null);

        const folderRef = ref(storage, `${cityName}/GeoJsonWard/${wardId}`);
        const result = await listAll(folderRef);
        if (!result.items.length) return setResponse("Fail", "No ward line files found", null);

        const sorted = [...result.items].sort((a, b) => b.name.localeCompare(a.name));
        const downloadUrl = await getDownloadURL(sorted[0]);
        const response = await axios.get(downloadUrl);

        if (response?.data) {
            trackCall(`GeoJsonWardLines/${wardId}`, "axios", response.data);
            saveRealtimeDbServiceHistory('MapServices', 'getWardLinesFromStorage');
            saveRealtimeDbServiceDataHistory('MapServices', 'getWardLinesFromStorage', response.data);
            return setResponse("Success", "Ward lines fetched", response.data);
        }
        return setResponse("Fail", "No data in file", null);
    } catch (error) {
        return setResponse("Fail", error.message, null);
    }
};
