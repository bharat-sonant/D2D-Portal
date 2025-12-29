import { getCityData } from "../services/CityService/cityServices";

export const getCityList = async (setList,type='all') => {
    const response = await getCityData();
    if (response.status === 'success') {
        let list = type==='active'?response?.data?.filter(city=>city?.Status==='active'):response?.data;
        setList(list);
    } else {
        setList([]);
    }
}