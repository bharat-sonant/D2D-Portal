import { useState } from "react";
import style from "../../MobileAppPages/Settings/Style/Settings.module.css";

const ZoneList = ({selectedWard,setSelectedWard}) => {
  const [wardList,setWardList] = useState(['1','2','3','4','5','6','7','8']);
  return (
    <div className={`${style.verticalTabs} `}>
      {/* <h6 className="p-2 ps-3 " style={{borderRadius:'10px 10px 0px 0px',backgroundColor:'lightgrey'}}>Zone List</h6> */}
      {wardList?.map((ward) => (
        <div key={ward} className={`${style.tabItem} ${selectedWard === ward ? style.activeTab : ""}`}
          onClick={() => setSelectedWard(ward)}
        >
          Ward {ward}
        </div>
      ))}
    </div>
  );
}

export default ZoneList;