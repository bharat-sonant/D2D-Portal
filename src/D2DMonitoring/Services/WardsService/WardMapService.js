import axios from "axios";
import { setResponse } from "../../../common/common";

/**
 * Firebase Storage se selected ward ki boundary fetch karta hai.
 * Path: {storagePath}{cityName}%2FWardBoundryJson%2F{wardId}.json
 *
 * @param {string} storagePath - e.g. "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/"
 * @param {string} cityName    - e.g. "Sikar"
 * @param {string|number} wardId
 */
export const getWardBoundaryFromStorage = (storagePath, cityName, wardId) => {
    return new Promise((resolve) => {
        if (!storagePath || !cityName || !wardId) {
            resolve(setResponse("Fail", "Invalid Params !!", null));
            return;
        }

        const url = `${storagePath}${encodeURIComponent(cityName)}%2FWardBoundryJson%2F${wardId}.json?alt=media`;

        axios.get(url)
            .then((response) => {
                if (response?.data) {
                    resolve(setResponse("Success", "Ward boundary fetched", response.data));
                } else {
                    resolve(setResponse("Fail", "No boundary data found", null));
                }
            })
            .catch((error) => {
                console.error("getWardBoundaryFromStorage error:", error);
                resolve(setResponse("Fail", error.message, null));
            });
    });
};

/**
 * Firebase Storage se selected ward ki lines (GeoJSON) fetch karta hai.
 * Path: {storagePath}{cityName}%2FWardLines%2F{wardId}.json
 *
 * @param {string} storagePath
 * @param {string} cityName
 * @param {string|number} wardId
 */
export const getWardLinesFromStorage = (storagePath, cityName, wardId) => {
    return new Promise((resolve) => {
        if (!storagePath || !cityName || !wardId) {
            resolve(setResponse("Fail", "Invalid Params !!", null));
            return;
        }

        const url = `${storagePath}${encodeURIComponent(cityName)}%2FWardLinesjson%2F${wardId}.json?alt=media`;
        console.log("WardLines URL:", url);

        axios.get(url)
            .then((response) => {
                if (response?.data) {
                    resolve(setResponse("Success", "Ward lines fetched", response.data));
                } else {
                    resolve(setResponse("Fail", "No lines data found", null));
                }
            })
            .catch((error) => {
                console.error("getWardLinesFromStorage error:", error);
                resolve(setResponse("Fail", error.message, null));
            });
    });
};
