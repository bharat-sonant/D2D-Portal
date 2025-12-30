import { supabase } from "../../createClient";
import * as sbs from "../supabaseServices"

export const saveCityData = async (cityData,logoFile,cityId) => {
    return new Promise(async(resolve,reject)=>{
        if(!cityData && cityData?.CityName){
           return reject('Invalid parameters');
        }
          const fileName = `${cityData.CityCode}.png`;
          const filePath = fileName;
        let logo = null;
        if (logoFile) {
            logo = await sbs.uploadAttachment(logoFile,`CityLogo`,filePath);
        }
        const response = !cityId ? await sbs.saveData('Cities', cityData) : await sbs.updateData('Cities','CityId',cityId,cityData);
        return !response?.success? reject(response?.err || response?.error):resolve(response);
    });
};

export const getCityData=async()=>{
    const result = await sbs.getData('Cities');
    if(result.success){

      const updatedCityList = result.data.map(city => ({
          ...city,
        logoUrl:`${sbs.storageUrl}/CityLogo/${city.CityCode}.png?v=${Date.now()}`
          }));

         const sortedData = [...updatedCityList].sort((a, b) => {
     if (a.Status !== b.Status) {
       return a.Status === "active" ? -1 : 1;
     }
     return a.CityName.localeCompare(b.CityName);
   });

  return { status: 'success', message: 'City data fetched successfully', data: sortedData };
    }else{
       return { status: 'error', message: result.error };
    } 
}

export const getAvailableCityData = async(userId) => {
  const accessResp = await sbs.getDataByColumnName('UserCityAccess', 'user_id', userId)

  if (!accessResp?.success || !accessResp?.data?.length) {
    return { status: 'success', data: [] };
  }

  const cityIds = accessResp?.data?.map(item => item.city_id)

  const {data, error} = await supabase.from("Cities").select("CityId , CityName, Status, CityCode").in("CityId", cityIds);

  if (error) {
    return { status: 'error', message: error.message };
  }

  const updatedCityList = data.map(city => ({
    ...city,
    logoUrl : `${sbs.storageUrl}/CityLogo/${city.CityCode}.png?v=${Date.now()}`
  }));

  const sortedData = [...updatedCityList].sort((a,b)=> {
    if(a.Status !== b.Status){
      return a.Status === "active" ? -1 : 1;
    }
    return a.CityName.localeCompare(b.CityName);
  })

  return {
    status: 'success',
    message: 'Available city data fetched successfully',
    data: sortedData
  };
}

export const updateCityStatus=async(cityId,Status)=>{
    return new Promise(async(resolve,reject)=>{
        
        if (!cityId) {
            return reject('Invalid parameters');
        }
        Status = Status || Status==='active'?'active':'inactive';
        const response = await sbs.updateData('Cities','CityId',cityId,{Status});
        return !response?.success? reject(response?.error):resolve(response);
    })
}


export const saveCityWiseWardData=(wardData,wardId)=>{
       return new Promise(async(resolve,reject)=>{
        if(!wardData && wardData?.Ward){
           return reject('Invalid parameters');
        }
        let isDuplicateWardAvailable = await sbs.checkDuplicayInDb(wardData?.city_Id,wardData?.name,wardId)
    
          if(isDuplicateWardAvailable){
            return resolve({duplicatefound:true,msg:'Ward already available in this city '})
          }
         const response = !wardId ? await sbs.saveData('Wards', wardData) : await sbs.updateData('Wards','id',wardId,wardData);
        return !response?.success? reject(response?.err || response?.error):resolve(response);
    });
}

export const getCityWisewardList = async (city_Id) => {
  const result = await sbs.getDataByColumnName('Wards', 'city_Id', city_Id);
  if (!result.success) {
    return { status: 'error', message: result.error };
  }
  const sortedData = [...result.data].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return {
    status: 'success',
    message: 'Ward data fetched successfully',
    data: sortedData
  };
};
