import { getAvailableCityData, getCityData } from "../services/CityService/cityServices";

export const getCityList = async (setList,type='all', setLoading) => {
    try{
        setLoading(true)
        const response = await getCityData();
    if (response.status === 'success') {
        let list = type==='active'?response?.data?.filter(city=>city?.Status==='active'):response?.data;
        setList(list);
    } else {
        setList([]);
    }
    }catch(error){
        setList([]);
    }finally{
        setLoading(false)
    }
}

export const getAvailableCityList = async (setList,type='all', setLoading, userId) => {
    try{
        setLoading(true)
        const response = await getAvailableCityData(userId);
    if (response.status === 'success') {
        let list = type==='active'?response?.data?.filter(city=>city?.Status==='active'):response?.data;
        setList(list);
    } else {
        setList([]);
    }
    }catch(error){
        setList([]);
    }finally{
        setLoading(false)
    }
}