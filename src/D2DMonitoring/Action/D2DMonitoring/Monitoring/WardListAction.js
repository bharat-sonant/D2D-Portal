import WardCityMap from "../../../../assets/WardsJson/WardCityMap";
import { ensureCityDetails } from "../../../../configurations/cityDBConfig";

// Reuse the shared cached fetch from cityDBConfig to avoid a duplicate HTTP request
const fetchCityDetails = () => ensureCityDetails().catch(() => []);

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
