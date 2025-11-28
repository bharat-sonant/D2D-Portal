import React, { useEffect, useState } from 'react'
import style from "../../Style/Settings.module.css"
import { getNavigatorSetting, removeNavigatorSetting, saveNavigatorSetting } from '../../Services/NavigatorApplicationSettingsService';
import { setAlertMessage } from '../../../../common/common';



const Navigator = () => {
      const [isNavigatorSettingOn, setIsNavigatorSettingOn] = useState(false);
       const [loader, setLoader] = useState(false);

      useEffect(()=>{
            loadNavigator();
      },[])

       const loadNavigator = async () => {
    const response = await getNavigatorSetting(setLoader);
    setIsNavigatorSettingOn(response.status === "success" && response.data === "yes");
  };


    const toggleNavigator = async () => {
      const newValue = !isNavigatorSettingOn;
      setIsNavigatorSettingOn(newValue);
  
      const res = newValue ? await saveNavigatorSetting() : await removeNavigatorSetting();
      if (res?.status !== "success") {
        setIsNavigatorSettingOn(isNavigatorSettingOn);
        setAlertMessage("error", "Failed to update Navigator Setting");
      } else setAlertMessage("success", "Navigator Setting updated");
    };
    
  return (
    <div>
         <div className={style.card}>
            <h3 className={style.cardTitle}>Navigator Application Settings</h3>
            <div className={style.toggleWrapper}>
              <label className={style.toggleLabel}>Navigation Via Employee Code</label>
              <div className={`${style.toggleSwitch} ${isNavigatorSettingOn ? style.on : style.off}`} onClick={toggleNavigator}>
                <div className={style.toggleCircle}>{isNavigatorSettingOn ? "ON" : "OFF"}</div>
              </div>
            </div>
          </div>
      
    </div>
  )
}

export default Navigator
