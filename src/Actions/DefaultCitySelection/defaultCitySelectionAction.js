import {setUserDefaultCity} from '../../services/UserServices/UserServices';
import * as common from "../../common/common";

export const changeDefaultCityAction=async(selectedCity,setAsDefault,setCityContext,onClose)=>{
        try{
            if (setAsDefault && selectedCity?.site_id) {
                const userId = localStorage.getItem('userId');
                let resp = await setUserDefaultCity(userId, selectedCity?.site_id);
                if (resp?.status === 'success') {
                    localStorage.setItem('defaultCity', resp?.data?.default_city);
                    common.setAlertMessage("success", "Default city updated successfully!");
                }
                else {
                    console.error(resp);
                    common.setAlertMessage("error", "Error in saving default city");
                    return;
                }
            }
            setCityContext({
                city: selectedCity?.site_name,
                cityId: selectedCity?.site_id,
                cityLogo: selectedCity?.logoUrl
            })
            onClose();
        }
        catch (error) {
            console.error(error);
            common.setAlertMessage("error", "Error in saving default city");
        }
}