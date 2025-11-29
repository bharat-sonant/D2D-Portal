import { useEffect, useState } from "react";
import { setAlertMessage } from "../../../../common/common";
import { getWorkMonitoringValue, removeWorkMonitoringValue, saveWorkMonitoringValue } from "../../Services/WorkMonitoringViaWebService";
import style from "../../Style/Settings.module.css"
const WorkMonitoring = () => {

   const [isWorkMonitoringOn, setIsWorkMonitoringOn] = useState(false);

   const [loader, setLoader] = useState(false);

    useEffect(()=>{
        loadWorkMonitoring();
    },[])

   const loadWorkMonitoring = async () => {
       const response = await getWorkMonitoringValue(setLoader);
       setIsWorkMonitoringOn(response.status === "success" && response.data.value === "yes");
     };
   

      const toggleWorkMonitoring = async () => {
         const newValue = !isWorkMonitoringOn;
         setIsWorkMonitoringOn(newValue);
     
         const res = newValue ? await saveWorkMonitoringValue() : await removeWorkMonitoringValue();
         if (res?.status !== "success") {
           setIsWorkMonitoringOn(isWorkMonitoringOn);
           setAlertMessage("error", "Failed to update Work Monitoring");
         } else setAlertMessage("success", "Work Monitoring updated");
       };
     

  return (

    <div>
      <div className={style.card}>
            <h3 className={style.cardTitle}>Work Monitoring</h3>
            <div className={style.toggleWrapper}>
              <label className={style.toggleLabel}>Work Monitoring Via Web</label>
              <div className={`${style.toggleSwitch} ${isWorkMonitoringOn ? style.on : style.off}`} onClick={toggleWorkMonitoring}>
                <div className={style.toggleCircle}>{isWorkMonitoringOn ? "ON" : "OFF"}</div>
              </div>
            </div>
          </div>
    </div>
  )
}

export default WorkMonitoring
