import { useEffect, useState } from 'react'
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import WardList from '../../components/Monitoring/WardList';
import { getDutySummaryAction, getWardDailyWorkSummaryAction, getWardList } from '../../Actions/Monitoring/WardAction';
import { useCity } from '../../context/CityContext';
import WardMonitoringPanel from '../../components/Monitoring/WardMonitoringPanel';
import dayjs from 'dayjs';

const Monitoring = () => {
  const [selectedWard, setSelectedWard] = useState('');
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const {cityId, city} = useCity();
  const [dutySummary, setDutySummary] = useState(null);
  const [dutyLoading, setDutyLoading] = useState(false);
  const year = dayjs().format('YYYY');
  const month = dayjs().format('MMMM');
  const date = dayjs().format('YYYY-MM-DD');
    const loadWards = async () => {
      getWardList(setSelectedWard,setWardList,selectedWard, setLoading, cityId)
    };
  
    useEffect(() => {
      loadWards();
    }, [cityId]);

    useEffect(()=>{
        fetchDutyIntime();
    },[selectedWard, city])

    const fetchDutyIntime = async() => {
      if(!selectedWard) return;
      setDutyLoading(true);
      const result = await getWardDailyWorkSummaryAction(date, selectedWard,cityId, setDutyLoading);
      if (result) {
        setDutySummary(result);
      } else {
        setDutySummary(null);
      }
    }

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

        <div className={`${TaskStyles.employeeRight}`}>
          <WardMonitoringPanel
          selectedWard={selectedWard}
          dutySummary={dutySummary}
          dutyLoading={dutyLoading}
          />
        </div>
      </div>
    </>
  );
}

export default Monitoring
