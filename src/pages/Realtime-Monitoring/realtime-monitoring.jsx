import { useState } from "react";
import ZoneList from "../../components/Realtime-Monitoring/zoneList";
import style from "../../Style/Dashboard/Dashboard.module.css";

const RealtimeMonitoring = () => {
  const [selectedWard,setSelectedWard] = useState(null);
  return (
    <div className={style.container}>
      <ZoneList selectedWard={selectedWard} setSelectedWard={setSelectedWard}/>
    </div>
  )
}

export default RealtimeMonitoring;