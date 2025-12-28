import {setUserDefaultCity} from '../../services/UserServices/UserServices';
import * as common from "../../common/common";

export const changeDefaultCityAction=async(selectedCity,setAsDefault,setCity,onClose)=>{
        
        try{
            if (setAsDefault && selectedCity?.CityId) {
                const userId = localStorage.getItem('userId');
                let resp = await setUserDefaultCity(userId, selectedCity?.CityId);
                if (resp?.status === 'success') {
                    localStorage.setItem('defaultCity', resp?.data?.defaultCity);
                    common.setAlertMessage("success", "Default city updated successfully!");
                }
                else {
                    console.error(resp);
                    common.setAlertMessage("error", "Error in saving default city");
                }
            }
            
        }
        catch (error) {
            console.error(error);
            common.setAlertMessage("error", "Error in saving default city");
        }
        finally {
            setCity(selectedCity?.CityName);
            onClose();
        }
}