import api from "../../api/api";
import { supabase } from "../../createClient";
import * as sbs from "../supabaseServices"
import * as common from '../../common/common'

export const saveCityData = async (cityData, logoFile, cityId) => {
  if (!cityData || !cityData?.site_name) {
    throw new Error("Invalid parameters");
  }
  const isEdit = !!cityId;

  const apiPayload = isEdit ? {
    site_name: cityData.site_name,
    status: cityData.status,
    firebase_db_path: cityData.firebase_db_path, 
  }: {
    site_code: cityData.site_code,
    site_name: cityData.site_name,
    status: cityData.status,
    created_by: cityData.created_by,
  }
  const response = !cityId
    ? await api.post("sites/create", apiPayload)
    // : await sbs.updateData("Cities", "city_id", cityId, cityData);
    : await api.patch(`sites/${cityId}`,apiPayload)

  if (logoFile) {
    const fileName = `${cityData.site_code}.png`;

    const formData = new FormData();
    formData.append("file", logoFile);          // 👈 actual file
    formData.append("bucket", "CityLogo");
    formData.append("path", fileName);

    // await sbs.uploadAttachment(logoFile, `CityLogo`, filePath);
    try {
      await api.post("files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (uploadError) {
      console.error("Logo upload failed:", uploadError);
      common.setAlertMessage('error',uploadError || "filed to upload the logo !")
    }
  }

  return response;
};
  

// export const getCityData=async()=>{
//     const result = await sbs.getData('Cities');
//     if(result.success){

//       const updatedCityList = result.data.map(city => ({
//           ...city,
//         logoUrl:`${sbs.storageUrl}/CityLogo/${city.city_code}.png?v=${Date.now()}`
//           }));

//          const sortedData = [...updatedCityList].sort((a, b) => {
//      if (a.status !== b.status) {
//        return a.status === "active" ? -1 : 1;
//      }
//      return a.city_name.localeCompare(b.city_name);
//    });

//   return { status: 'success', message: 'City data fetched successfully', data: sortedData };
//     }else{
//        return { status: 'error', message: result.error };
//     } 
// }

export const getAvailableCityData = async(userId) => {
  const accessResp = await sbs.getDataByColumnName('UserCityAccess', 'user_id', userId)

  if (!accessResp?.success || !accessResp?.data?.length) {
    return { status: 'success', data: [] };
  }

  const cityIds = accessResp?.data?.map(item => item.city_id)

  const {data, error} = await supabase.from("Sites").select("site_id , site_name, status, site_code").in("site_id", cityIds);

  if (error) {
    return { status: 'error', message: error.message };
  }

  const updatedCityList = data.map(site => ({
    ...site,
    logoUrl : `${sbs.storageUrl}/CityLogo/${site.site_code}.png?v=${Date.now()}`
  }));

  const sortedData = [...updatedCityList].sort((a,b)=> {
    if(a.status !== b.status){
      return a.status === "active" ? -1 : 1;
    }
    return a.site_name.localeCompare(b.site_name);
  })

  return {
    status: 'success',
    message: 'Available city data fetched successfully',
    data: sortedData
  };
}

export const updateCityStatus=async(siteId,status)=>{
    return new Promise(async(resolve,reject)=>{
        
        if (!siteId) {
            return reject('Invalid parameters');
        }
        status = status || status==='active'?'active':'inactive';
        const response = await sbs.updateData('Sites','site_id',siteId,{status});
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
