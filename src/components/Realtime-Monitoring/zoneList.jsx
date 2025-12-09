import { useState } from "react";
import style from "../../MobileAppPages/Settings/Style/Settings.module.css";

const ZoneList = ({selectedZone,setSelectedZone}) => {
  const [wardList,setWardList] = useState(['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6','Zone 7','Zone 8']);
  return (
    <div className={`${style.verticalTabs} `}>
      {/* <h6 className="p-2 ps-3 " style={{borderRadius:'10px 10px 0px 0px',backgroundColor:'lightgrey'}}>Zone List</h6> */}
      {wardList?.map((ward) => (
        <div key={ward} className={`${style.tabItem} ${selectedZone === ward ? style.activeTab : ""}`}
          onClick={() => setSelectedZone(ward)}
        >
        {ward}
        </div>
      ))}
    </div>
  );
}

export default ZoneList;