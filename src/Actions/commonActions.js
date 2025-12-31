import { getAvailableCityData, getCityData } from "../services/CityService/cityServices";
import { images } from '../assets/css/imagePath'; 
import { getDataByColumnName } from "../services/supabaseServices";
import * as sbs from "../services/supabaseServices"

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
export const getCityLogoUrl=async(cityId,setLogoUrl)=>{
    if(!cityId){
        return images?.wevoisLogo;
    }
    let logoUrl = images?.wevoisLogo
    const resp = await getDataByColumnName("Cities", "CityId",cityId );
    if(resp?.success){
        logoUrl = `${sbs.storageUrl}/CityLogo/${resp?.data?.[0]?.CityCode}.png?v=${Date.now()}`;
    }
    setLogoUrl(logoUrl);
}
export const createCityLogoUrl=(cityCode)=>{
    return `${sbs.storageUrl}/CityLogo/${cityCode}.png?v=${Date.now()}`;
}