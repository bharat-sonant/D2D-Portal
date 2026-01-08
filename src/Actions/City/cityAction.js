import dayjs from "dayjs";
import * as common from "../../common/common";
import * as cityService from "../../services/CityService/cityServices"


export const saveCityAction = async(form,logo,props,setLoading,setCityError,setCityCodeError,resetStateValues,setLogoError) => {
    let isValid = true;
    setCityError("");
    setCityCodeError("");
    if(!form?.city_code?.trim()){
        setCityCodeError("City code is required");
        isValid = false;
    }
    if (!form?.city_name?.trim()) {
        setCityError("City name is required");
        isValid = false;
    }
    if (!logo && !props?.onEdit && !props?.onEdit?.logo_image) {
        setLogoError("Logo is required");
        isValid = false;
    }
    if (isValid) {
        setLoading(true);
        let loggedUserName = localStorage.getItem("name");
        let cityDetail = {
              city_code:form?.city_code?.trim(),
              city_name: form?.city_name?.trim(),
              status: form?.status, 
              created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"), 
              created_by: loggedUserName 
        }
       
        try {
            await cityService.saveCityData(cityDetail,logo,props?.onEdit?.city_id);
            resetStateValues();
            props.loadCities();
            common.setAlertMessage("success", !props?.onEdit?"City added successfully": "City updated successfully");
        } catch (err) {
            setLoading(false);
                  if (err?.code === "23505") {
                if (err?.details?.includes("city_code")) {
                    setCityCodeError("City code already exists!");
                    return;
                }
                if (err?.details?.includes("city_name")) {
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

export const getCityList=async (setSelectedCity,setCityList,selectedCity,setWardList,setLoading)=>{
    setLoading(true)
      const response = await cityService.getCityData();
       if(response.status==='success'){
        let currentSelected = response.data?.find(item=>item?.city_id===selectedCity?.city_id);
           setSelectedCity(currentSelected || response.data[0]);
           getwardList(response.data[0]?.city_id,setWardList)
           setCityList(response.data);
           setLoading(false)
       }else{
        setSelectedCity(null)
       setCityList([]);
       setLoading(false)
}
       }
      
export const changeCityStatusAction=async(newStatus,selectedCity,setToggle,loadCities,setStatusConfirmation)=>{
    
    if (!selectedCity) return;
    try{
        
        await cityService.updateCityStatus(selectedCity?.city_id,newStatus);
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
        let currentSelected = cityList?.find(item=>item?.city_id===selectedCity?.city_id);
        setSelectedCity(currentSelected || cityList[0] || null);
        return cityList;
    }
    let list = cityList?.filter((item) => item?.city_name?.trim().toLowerCase().includes(term));
    let currentSelected = list?.find(item=>item?.city_id===selectedCity?.city_id);

    setSelectedCity(currentSelected || list[0] || null);

    return list;
}



export const saveWardAction = async(form,cityId,wardId,setLoading,setWardNumberError,resetStateValues,setWardList) => {
    let isValid = true;
    setWardNumberError("");
    if(!form?.Ward?.trim()){
        setWardNumberError("Ward name is required");
        isValid = false;
    }
    if (isValid) {
        setLoading(true);
        let wardDetail = {
              name:form?.Ward?.trim(),
              city_Id:cityId,
              created_At: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              created_By: localStorage.getItem('name'),
              show_realtime:'Yes'
        }
       
        try {
           let response =  await cityService.saveCityWiseWardData(wardDetail,wardId)
            if(response.duplicatefound){
            setWardNumberError(response.msg);
             setLoading(false);
            return;
            }
              getwardList(cityId,setWardList)
            resetStateValues();
            const message = wardId? "Ward updated successfully": "Ward added successfully";
            common.setAlertMessage("success", message);
          
        } catch (err) {
            setLoading(false);
                  if (err?.code === "23505") {
                if (err?.details?.includes("CityCode")) {
                    setWardNumberError("City code already exists!");
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


export const getwardList=async (city_Id,setWardList)=>{
   let response= await cityService.getCityWisewardList(city_Id)
   if(response.status==='success'){
    setWardList(response.data)
   }else{
    setWardList([])
   }
}

export const updateWardRealTimeStatusAction=async (wardId,realTimeStatus,setWardList)=>{
    let newStatus = {show_realtime:realTimeStatus==='Yes'?'No':'Yes'}
   let response = await cityService.updateWardRealTimeStatus(wardId,newStatus)
   if(response.status==='success'){
    setWardList(prevList => prevList.map(ward => ward.id === wardId ? { ...ward, show_realtime: newStatus.show_realtime}: ward));
   }
}