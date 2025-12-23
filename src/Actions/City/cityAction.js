import dayjs from "dayjs";
import * as common from "../../common/common";
import { getCityData, saveCityWithLogo, updateCityStatus } from "../../services/CityService/cityServices";

export const saveCityAction = async(form,logo,props,setLoading,setCityError,setCityCodeError,resetStateValues,setLogoError) => {
    let isValid = true;
    setCityError("");
    setCityCodeError("");
    if(!form?.CityCode?.trim()){
        setCityCodeError("City code is required");
        isValid = false;
    }
    if (!form?.CityName?.trim()) {
        setCityError("City name is required");
        isValid = false;
    }
    if (!logo && !props?.onEdit && !props?.onEdit?.logo_image) {
        setLogoError("Logo is required");
        isValid = false;
    }
    if (isValid) {
        setLoading(true);
        let loggedUserName = localStorage.getItem("userName");
        let cityDetail = {
              CityCode:form?.CityCode?.trim(),
              CityName: form?.CityName?.trim(),
              Status: form?.Status, 
              CreatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), 
              CreatedBy: loggedUserName 
        }
       
        try {
            await saveCityWithLogo(cityDetail,logo,props?.onEdit?.CityId);
            resetStateValues();
            props.loadCities();
            common.setAlertMessage("success", !props?.onEdit?"City added successfully": "City updated successfully");
        } catch (err) {
            setLoading(false);
                  if (err?.code === "23505") {
                if (err?.details?.includes("CityCode")) {
                    setCityCodeError("City code already exists!");
                    return;
                }
                if (err?.details?.includes("CityName")) {
                    setCityError("City name already exists!");
                    return;
                } 
                 else {
                    common.setAlertMessage("error", "Duplicate value exists!");
                }
            } else {
                common.setAlertMessage("error", "Something went wrong!");
            }
        }
    }
}

export const getCityList=async (setSelectedCity,setCityList,selectedCity)=>{
      const response = await getCityData();
       if(response.status==='success'){
        let currentSelected = response.data?.find(item=>item?.CityId===selectedCity?.CityId);
           setSelectedCity(currentSelected || response.data[0]);
        setCityList(response.data);
       }else{
        setSelectedCity(null)
       setCityList([]);
}
       }
      
export const changeCityStatusAction=async(newStatus,selectedCity,setToggle,loadCities,setStatusConfirmation)=>{
    
    if (!selectedCity) return;
    try{
        
        await updateCityStatus(selectedCity?.CityId,newStatus);
        setToggle(newStatus);
        setStatusConfirmation({status:false,data:null,setToggle:()=>{}})
        loadCities()
        common.setAlertMessage("success", `City status ${newStatus?'active':'inactive'} successfully.`);
    }
    catch(error){
        console.error(error);
        common.setAlertMessage("error",error);
    }
}
export const filterCityAction=(cityList,searchTerm,setSelectedCity,selectedCity)=>{
    const term = searchTerm?.trim().toLowerCase();
    if (!term) {
        let currentSelected = cityList?.find(item=>item?.CityId===selectedCity?.CityId);
        setSelectedCity(currentSelected || cityList[0] || null);
        return cityList;
    }
    let list = cityList?.filter((item) => item?.CityName?.trim().toLowerCase().includes(term));
    let currentSelected = list?.find(item=>item?.CityId===selectedCity?.CityId);

    setSelectedCity(currentSelected || list[0] || null);

    return list;
}
