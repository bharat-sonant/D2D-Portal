import { saveData, updateData, uploadAttachment } from "./supabaseServices";

export const saveCityWithLogo = async (cityData,logoFile,cityId) => {
    return new Promise(async(resolve,reject)=>{
        if(!cityData && cityData?.name){
           return reject('Invalid parameters');
        }
        let logo = null;
        if (logoFile) {
            logo = await uploadAttachment(logoFile, "CityLogo");
        }
        //2️⃣ Insert city data with logo URL
        cityData.logo_image = logo?.url || cityData?.logo_image;
        const response = !cityId ? await saveData('Cities', cityData) : await updateData('Cities',cityId,cityData);
        return !response?.success? reject(response?.err):resolve(response);
        // data return nahi kar rahe
    });
};
export const updateCityStatus=async(cityId,status)=>{
    return new Promise(async(resolve,reject)=>{
        if (!cityId) {
            return reject('Invalid parameters');
        }
        status = status || status==='active'?'active':'inactive';
        const response = await updateData('Cities',cityId,{status});
        return !response?.success? reject(response?.error):resolve(response);
    })
}