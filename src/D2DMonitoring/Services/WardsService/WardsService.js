import axios from "axios";
import { setResponse } from "../../../common/common";
import { logServiceCall } from "../../../common/serviceLogger";

/**
 * Firebase Storage se city ka AvailableWard.json fetch karta hai.
 * Path: {storagePath}{storageCity}/Defaults/AvailableWard.json
 *
 * @param {string} storagePath  - e.g. "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/"
 * @param {string} storageCity  - e.g. "Sikar"
 * @returns {Promise} setResponse with raw array data
 */
export const getAvailableWardsFromStorage = (storagePath, storageCity) => {
    logServiceCall('WardsService', 'getAvailableWardsFromStorage');
    return new Promise((resolve) => {
        if (!storagePath || !storageCity) {
            resolve(setResponse("Fail", "Invalid Params !!", { storagePath, storageCity }));
            return;
        }

        const fileName = storageCity.toLowerCase() === "nokha" ? "Wards.json" : "AvailableWard.json";
        const url = `${storagePath}${encodeURIComponent(storageCity)}%2FDefaults%2F${fileName}?alt=media`;

        axios.get(url)
            .then((response) => {
                if (response?.data) {
                    resolve(setResponse("Success", "Wards fetched successfully", response.data));
                } else {
                    resolve(setResponse("Fail", "No ward data found", []));
                }
            })
            .catch((error) => {
                resolve(setResponse("Fail", error.message, []));
            });
    });
};
