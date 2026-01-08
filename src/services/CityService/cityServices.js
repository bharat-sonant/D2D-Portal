import { supabase } from "../../createClient";
import * as sbs from "../supabaseServices"

export const saveCityData = async (cityData,logoFile,cityId) => {
    return new Promise(async(resolve,reject)=>{
        if(!cityData && cityData?.city_name){
           return reject('Invalid parameters');
        }
          const fileName = `${cityData.city_code}.png`;
          const filePath = fileName;
        let logo = null;
        if (logoFile) {
            logo = await sbs.uploadAttachment(logoFile,`CityLogo`,filePath);
        }
        const response = !cityId ? await sbs.saveData('Cities', cityData) : await sbs.updateData('Cities','city_id',cityId,cityData);
        return !response?.success? reject(response?.err || response?.error):resolve(response);
    });
};

export const getCityData=async()=>{
    const result = await sbs.getData('Cities');
    if(result.success){

      const updatedCityList = result.data.map(city => ({
          ...city,
        logoUrl:`${sbs.storageUrl}/CityLogo/${city.city_code}.png?v=${Date.now()}`
          }));

         const sortedData = [...updatedCityList].sort((a, b) => {
     if (a.status !== b.status) {
       return a.status === "active" ? -1 : 1;
     }
     return a.city_name.localeCompare(b.city_name);
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

  const {data, error} = await supabase.from("Cities").select("city_id , city_name, status, city_code").in("city_id", cityIds);

  if (error) {
    return { status: 'error', message: error.message };
  }

  const updatedCityList = data.map(city => ({
    ...city,
    logoUrl : `${sbs.storageUrl}/CityLogo/${city.city_code}.png?v=${Date.now()}`
  }));

  const sortedData = [...updatedCityList].sort((a,b)=> {
    if(a.status !== b.status){
      return a.status === "active" ? -1 : 1;
    }
    return a.city_name.localeCompare(b.city_name);
  })

  return {
    status: 'success',
    message: 'Available city data fetched successfully',
    data: sortedData
  };
}

export const updateCityStatus=async(city_id,status)=>{
    return new Promise(async(resolve,reject)=>{
        
        if (!city_id) {
            return reject('Invalid parameters');
        }
        status = status || status==='active'?'active':'inactive';
        const response = await sbs.updateData('Cities','city_id',city_id,{status});
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

export const updateWardRealTimeStatus = async (wardId, realTimeStatus) => {
  const response = await sbs.updateData('Wards','id',wardId,realTimeStatus);
  return response.success? { status: 'success', message: 'Status updated successfully' }: { status: 'fail', message: 'Error occurred while updating status' };
};
