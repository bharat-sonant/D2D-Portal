import axios from "axios";
import { getAvailableWardsFromStorage } from "../../../Services/WardsService/WardsService";
import { logServiceCall } from "../../../../common/serviceLogger";

const CITY_DETAILS_URL =
    "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/CityDetails%2FCityDetails.json?alt=media";

let _cache = null;

const fetchCityDetails = async () => {
    if (_cache) return _cache;
    try {
        const res = await axios.get(CITY_DETAILS_URL);
        _cache = res.data || [];
    } catch {
        _cache = [];
    }
    return _cache;
};

const EXCLUDED_WARDS = new Set([
    "OfficeWork", "FixedWages", "BinLifting", "GarageWork",
    "Compactor", "SegregationWork", "GeelaKachra",
    "SecondHelper", "ThirdHelper",
]);

const toZoneName = (zoneNo, city) => {
    const s = zoneNo.toString();
    if (s.includes("mkt"))         return "Market " + s.replace("mkt", "");
    if (s === "MarketRoute1")       return "Market 1";
    if (s === "MarketRoute2")       return "Market 2";
    if (s === "WetWaste")           return "Wet 1";
    if (s === "WetWaste1")          return "Wet 2";
    if (s === "WetWaste2")          return "Wet 3";
    if (s === "WetWaste4")          return "Wet 4";
    if (s === "WetWaste5")          return "Wet 5";
    if (s === "WetWaste6")          return "Wet 6";
    if (s === "CompactorTracking1") return "CompactorTracking1";
    if (s === "CompactorTracking2") return "CompactorTracking2";
    if (city?.toLowerCase() === "kishangarh" && s === "60") return "Zone 58_60";
    return "Zone " + s;
};

/**
 * City URL param se CityDetails.json mein storageCity + storagePath dhundho,
 * phir Firebase Storage se ward list fetch karo.
 * localStorage pe depend nahi — timing issue nahi aata.
 *
 * @param {string} city — URL param (e.g. "Sikar", "Ajmer")
 * @returns {Promise<Array<{ id: string, name: string, progress: number }>>}
 */
export const getWardListAction = async (city) => {
    logServiceCall('WardListAction', 'getWardListAction');
    if (!city) return [];

    const cityDetails = await fetchCityDetails();

    const normalizedCity = city.trim().toLowerCase();
    const detail = cityDetails.find(
        (item) =>
            item?.city?.toString()?.trim()?.toLowerCase() === normalizedCity ||
            item?.cityName?.toString()?.trim()?.toLowerCase() === normalizedCity
    );

    if (!detail) return [];

    const { cityName, firebaseStoragePath, storageBucket } = detail;
    const storageCity = cityName;
    const storagePath = firebaseStoragePath ||
        `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/`;

    const response = await getAvailableWardsFromStorage(storagePath, storageCity);

    if (response?.status !== "Success" || !Array.isArray(response.data)) return [];

    const data = response.data;
    const list = [];

    for (let i = 1; i < data.length; i++) {
        const zoneNo = data[i];
        if (!zoneNo) continue;
        const s = zoneNo.toString();
        if (s.includes("Test") || EXCLUDED_WARDS.has(s)) continue;
        list.push({ id: s, name: toZoneName(s, city), progress: 0 });
    }

    return list;
};
