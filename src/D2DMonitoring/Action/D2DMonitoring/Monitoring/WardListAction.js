import axios from "axios";
import WardCityMap from "../../../../assets/WardsJson/WardCityMap";

const CITY_DETAILS_URL =
    "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/CityDetails%2FCityDetails.json?alt=media";

const fetchCityDetails = async () => {
    try {
        const res = await axios.get(CITY_DETAILS_URL);
        return res.data || [];
    } catch {
        return [];
    }
};

export const getCityList = async () => {
    const cityDetails = await fetchCityDetails();
    return cityDetails
        .filter((item) => item?.cityName && WardCityMap[item.cityName.toLowerCase()])
        .map((item) => ({ city: item.city || item.cityName, cityName: item.cityName }));
};

export const getWardListAction = (city) => {
    if (!city) return [];
    const rawData = WardCityMap[city.trim().toLowerCase()];
    if (!Array.isArray(rawData)) return [];
    return rawData
        .filter(Boolean)
        .map((id) => ({ id: id.toString(), name: id.toString(), progress: 0 }));
};
