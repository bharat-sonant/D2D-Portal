import { getAvailableCityData } from "../services/CityService/cityServices";
import { images } from '../assets/css/imagePath'; 
import { getDataByColumnName } from "../services/supabaseServices";
import * as sbs from "../services/supabaseServices"

// export const getCityList = async (setList,type='all', setLoading) => {
//     try{
//         setLoading(true)
//         const response = await getCityData();
//     if (response.status === 'success') {
//         let list = type==='active'?response?.data?.filter(city=>city?.status==='active'):response?.data;
//         setList(list);
//     } else {
//         setList([]);
//     }
//     }catch(error){
//         setList([]);
//     }finally{
//         setLoading(false)
//     }
// }

export const getAvailableCityList = async (setList,type='all', setLoading, userId) => {
    try{
        setLoading(true)
        const response = await getAvailableCityData(userId);
    if (response.status === 'success') {
        let list = type==='active'?response?.data?.filter(city=>city?.status==='active'):response?.data;
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

export const getCityLogoUrl=async(siteId,setLogoUrl)=>{
    if(!siteId){
        return images?.wevoisLogo;
    }
    let logoUrl = images?.wevoisLogo
    const resp = await getDataByColumnName("Sites", "site_id",siteId );
    if(resp?.success){
        logoUrl = `${sbs.storageUrl}/CityLogo/${resp?.data?.[0]?.site_code}.png?v=${Date.now()}`;
    }
    setLogoUrl(logoUrl);
}

export const createCityLogoUrl=(siteCode)=>{
    return `${sbs.storageUrl}/CityLogo/${siteCode}.png?v=${Date.now()}`;
}