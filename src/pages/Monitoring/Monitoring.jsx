import React, { useEffect, useState } from 'react'
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import WardList from '../../components/Monitoring/WardList';
import { getWardList } from '../../Actions/Monitoring/WardAction';

const Monitoring = () => {
  const [selectedWard, setSelectedWard] = useState('');
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(false);
  
    const loadWards = async () => {
      getWardList(setSelectedWard,setWardList,selectedWard, setLoading)
    };
  
    useEffect(() => {
      loadWards();
    }, []);
  

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
       
      
      </div>
    </>
  );
}

export default Monitoring
