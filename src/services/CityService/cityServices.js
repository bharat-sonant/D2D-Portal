import * as sbs from "../supabaseServices"

export const saveCityWithLogo = async (cityData,logoFile,cityId) => {
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
        //2️⃣ Insert city data with logo URL
        // cityData.logo_image = logo?.url || cityData?.logo_image;
        const response = !cityId ? await sbs.saveData('Cities', cityData) : await sbs.updateData('Cities','CityId',cityId,cityData);
    
        return !response?.success? reject(response?.err || response?.error):resolve(response);
        // data return nahi kar rahe
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

