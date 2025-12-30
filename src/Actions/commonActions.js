import { getCityData } from "../services/CityService/cityServices";

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