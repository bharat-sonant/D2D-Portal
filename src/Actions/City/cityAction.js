import dayjs from "dayjs";
import * as common from "../../common/common";
import { saveCityWithLogo, updateCityStatus } from "../../services/cityServices";

export const saveCityAction = async(form,logo,props,setLoading,setCityError,resetStateValues,setLogoError) => {
    let isValid = true;
    setCityError("");
    if (!form?.name?.trim()) {
        setCityError("Name is required");
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
            name: form?.name?.trim(),
            ...(!props?.onEdit ? { status: "active", created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"), created_by: loggedUserName } : { logo_image: props?.onEdit?.logo_image})
        };

        try {
            await saveCityWithLogo(cityDetail,logo,props?.onEdit?.id);
            resetStateValues();
            props.loadCities();
            common.setAlertMessage("success", "City added successfully");
        } catch (err) {
            setLoading(false);
            if (err.code === "23505") {
                if (err.details?.includes("name")) {
                    setCityError("City name already exists!");
                } else {
                    common.setAlertMessage("error", "Duplicate value exists!");
                }
            } else {
                common.setAlertMessage("error", "Something went wrong!");
            }
        }
    }
}
export const changeCityStatusAction=async(newStatus,selectedCity,setToggle,loadCities,setStatusConfirmation)=>{
    if (!selectedCity) return;
    try{
        await updateCityStatus(selectedCity?.id,newStatus);
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
export const filterCityAction=(cityList,searchTerm,setSelectedCity)=>{
    const term = searchTerm?.trim().toLowerCase();
    if (!term) {
        setSelectedCity(cityList?.length > 0 ? cityList[0] : null);
        return cityList;
    }
    let list = cityList?.filter((item) => item?.name?.trim().toLowerCase().includes(term));
    setSelectedCity(list?.length > 0 ? list[0] : null);

    return list;
}