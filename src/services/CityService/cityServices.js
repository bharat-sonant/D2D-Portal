import * as sbs from "../supabaseServices"

export const saveCityWithLogo = async (cityData,logoFile,cityId) => {
    return new Promise(async(resolve,reject)=>{
        if(!cityData && cityData?.name){
           return reject('Invalid parameters');
        }
        let logo = null;
        if (logoFile) {
            logo = await sbs.uploadAttachment(logoFile, "CityLogo");
        }
        //2️⃣ Insert city data with logo URL
        cityData.logo_image = logo?.url || cityData?.logo_image;
        const response = !cityId ? await sbs.saveData('Cities', cityData) : await sbs.updateData('Cities',cityId,cityData);
        return !response?.success? reject(response?.err || response?.error):resolve(response);
        // data return nahi kar rahe
    });
};

export const getCityData=async()=>{
    const result = await sbs.getData('Cities');
    if(result.success){
         const sortedData = [...result.data].sort((a, b) => {
     if (a.status !== b.status) {
       return a.status === "active" ? -1 : 1;
     }
     return a.name.localeCompare(b.name);
   });
  return { status: 'success', message: 'City data fetched successfully', data: sortedData };
    }else{
       return { status: 'error', message: result.error };
    } 
}

export const updateCityStatus=async(cityId,status)=>{
    return new Promise(async(resolve,reject)=>{
        if (!cityId) {
            return reject('Invalid parameters');
        }
        status = status || status==='active'?'active':'inactive';
        const response = await sbs.updateData('Cities',cityId,{status});
        return !response?.success? reject(response?.error):resolve(response);
    })
}

