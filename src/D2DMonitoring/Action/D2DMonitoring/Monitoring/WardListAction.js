import WardCityMap from "../../../../assets/WardsJson/WardCityMap";
import CityDetails from "../../../../assets/WardsJson/CityDetails.json";

export const getCityList = () =>
    CityDetails
        .filter((item) => item?.cityName)
        .map((item) => ({ city: item.city || item.cityName, cityName: item.cityName }));

export const getWardListAction = (city) => {
    if (!city) return [];
    const rawData = WardCityMap[city.trim().toLowerCase()];
    if (!Array.isArray(rawData)) return [];
    return rawData
        .filter(Boolean)
        .map((id) => ({ id: id.toString(), name: id.toString(), progress: 0 }));
};
