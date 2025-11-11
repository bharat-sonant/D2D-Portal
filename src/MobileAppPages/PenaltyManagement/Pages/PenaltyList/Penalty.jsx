import { useEffect, useState } from 'react';
import PenaltiesRewardsDetails from '../../Components/Penalties/PenaltiesRewardsDetails';
import PenaltyList from '../../Components/Penalties/PenaltyList';
import styles from '../../Styles/Penalties/PenaltyList.module.css';
import { useLocation } from 'react-router-dom';
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';
import { getEmployeesData, getPenaltiesRewardData, getPenaltiesType, getRewardTypes } from '../../Actions/PenaltiesRewardDetails/PenaltiesDetailsAction';

const Penalty = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [penaltiesData, setPenaltiesData] = useState([]);
  const [penaltyCount, setPenaltyCount] = useState('0');
  const [rewardCount, setRewardCount] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [penaltyId, setPenaltyId] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [rewardTypes, setRewardTypes] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [entryType, setEntryType] = useState('');


  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "DevTest";
  const loggedInUserId = queryParams.get('username') || 'Bharat';

  useEffect(() => {
    getEmployeesData(setEmployees);
  }, [trigger, selectedDate]);

  useEffect(() => {
    if (entryType === 'Penalty') {
      getPenaltiesType(setPenaltyTypes);
    } else if (entryType === 'Reward') {
      getRewardTypes(setRewardTypes);
    }
  }, [entryType])

  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);

      let config = getCityFirebaseConfig(city);
      connectFirebase(config, city)
    } else {
      localStorage.setItem("city", "DevTest");
      console.warn("⚠️ No city found, defaulting to DevTest");
    }
  }, [city]);

  useEffect(() => {
    const handleAndroidBack = () => {
      if (showDetails) {
        setShowDetails(false);
      } else {
        if (window.AndroidApp?.closeWebView) {
          window.AndroidApp.closeWebView();
        } else {
          window.history.back();
        }
      }
    };
    window.addEventListener('androidBackPressed', handleAndroidBack);
    return () => {
      window.removeEventListener('androidBackPressed', handleAndroidBack);
    };
  }, [showDetails]);

  useEffect(() => {
    getPenaltiesRewardData(selectedDate, employees, setPenaltiesData, setPenaltyCount, setRewardCount, setIsLoading);
  }, [selectedDate, employees, trigger])

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
    setPenaltyId(item.id);
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileView}>
        {!showDetails ? (
          <PenaltyList
            onAddClick={() => { setShowDetails(true); setSelectedItem(null); }}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            penaltiesData={penaltiesData}
            setPenaltiesData={setPenaltiesData}
            penaltyCount={penaltyCount}
            rewardCount={rewardCount}
            isLoading={isLoading}
            handleEdit={handleEdit}
          />
        ) : (
          <PenaltiesRewardsDetails
            onBack={() => setShowDetails(false)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            loggedInUserId={loggedInUserId}
            employees={employees}
            penaltiesData={penaltiesData}
            setPenaltiesData={setPenaltiesData}
            selectedItem={selectedItem}
            penaltyId={penaltyId}
            setPenaltyId={setPenaltyId}
            trigger={trigger}
            setTrigger={setTrigger}
            penaltyTypes={penaltyTypes}
            rewardTypes={rewardTypes}
            entryType={entryType}
            setEntryType={setEntryType}
          />
        )}
      </div>
    </div>
  );
};

export default Penalty;
