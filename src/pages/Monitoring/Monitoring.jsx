import React, { useEffect, useState } from 'react'
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import WardList from '../../components/Monitoring/WardList';
import {  getDutySummaryAction, getWardList } from '../../Actions/Monitoring/WardAction';
import * as common from '../../common/common'
import { supabase } from '../../createClient';
import { useCity } from '../../context/CityContext';
import { getDutyInTime } from '../../services/MonitoringServices/MonitoringServices';
import WardMonitoringPanel from '../../components/Monitoring/WardMonitoringPanel';

const Monitoring = () => {
  const [selectedWard, setSelectedWard] = useState('');
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const {cityId, city} = useCity();
  const [dutySummary, setDutySummary] = useState(null);
  const [dutyLoading, setDutyLoading] = useState(false);
    const loadWards = async () => {
      getWardList(setSelectedWard,setWardList,selectedWard, setLoading, cityId)
    };
  
    useEffect(() => {
      console.log("MONITORING LOAD", { city, cityId });
      loadWards();
    }, [cityId]);

    useEffect(()=>{
      if(city === 'Reengus'){
        fetchDutyIntime();
      }
    },[selectedWard, city])

    useEffect(() => {
      if (city !== 'Reengus') {
        setDutySummary(null);
        setDutyLoading(false);
      }
    }, [city]);

    const fetchDutyIntime = async() => {
      if(!selectedWard) return;
      setDutyLoading(true);
      const result = await getDutySummaryAction(selectedWard, setDutyLoading);
      if (result) {
        setDutySummary(result);
      } else {
        setDutySummary(null);
      }
    }

    const handleAttachMap = async(ward) => {
  // open file picker / modal
  // const input = document.createElement('input');
  // input.type = 'file';
  // input.accept = ".pdf, .png, .jpg, .jpeg, .geojson, .kml, .kmz"

  // input.onchange = async(e)=> {
  //   const file = e.target.files[0];
  //   if(!file) return;

  //   try{
  //     const fileExt = file.name.split(".").pop();
  //     console.log('fileExt', fileExt)
  //     const filePath = `city_${ward.city_Id}/ward_${ward.id}/ward_map.${fileExt}`;

  //     const {error} = await supabase.storage.from("WardMaps").upload(filePath, file, {
  //       upsert: true,
  //     })
  //     if (error) throw error;

  //     const {data} = supabase.storage.from("WardMaps").getPublicUrl(filePath);

  //     console.log("Uploaded map URL:", data.publicUrl);
  //     common.setAlertMessage('success', 'Ward Map uploaded successfully')

  //      window.open(data.publicUrl, "_blank");
  //   }catch(err){
  //     common.setAlertMessage('error', 'Filed to upload ward map, Please try again.')
  //   }
  // };
  // input.click();
};

     return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        {/* {selectedWard && <SettingsBtn 
        click={handleOpenSettings}
         />} */}
        {/* <button
          className={`${GlobalStyles.floatingBtn}`}
          onClick={handleOpenModal}
        >
          +
        </button> */}
      </div>

      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`}>
            <WardList
            wardList={wardList}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            loading={loading}
          />
        </div>

        {city === 'Reengus' ? (<div className={`${TaskStyles.employeeRight}`}>
          <WardMonitoringPanel
          selectedWard={selectedWard}
          dutySummary={dutySummary}
          dutyLoading={dutyLoading}
          />
        </div>): null}
      </div>
    </>
  );
}

export default Monitoring
