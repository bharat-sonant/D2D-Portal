import { useEffect, useState } from 'react';
import PenaltiesRewardsDetails from '../../Components/Penalties/PenaltiesRewardsDetails';
import PenaltyList from '../../Components/Penalties/PenaltyList';
import styles from '../../Styles/Penalties/PenaltyList.module.css';
import { useLocation } from 'react-router-dom';
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';
import { getEmployeesData, getPenaltiesRewardData } from '../../Actions/PenaltiesRewardDetails/PenaltiesDetailsAction';

const Penalty = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [penaltiesData, setPenaltiesData] = useState([]);
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city") || "DevTest";
  const loggedInUserId = queryParams.get('username') || 'Bharat';

  useEffect(() => {
    getEmployeesData(setEmployees);
  }, []);

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
    getPenaltiesRewardData(selectedDate, employees, setPenaltiesData);
  }, [selectedDate, employees])

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileView}>
        {!showDetails ? (
          <PenaltyList
            onAddClick={() => setShowDetails(true)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            penaltiesData={penaltiesData}
            setPenaltiesData={setPenaltiesData}
          />
        ) : (
          <PenaltiesRewardsDetails
            onBack={() => setShowDetails(false)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            loggedInUserId={loggedInUserId}
            employees={employees}
          />
        )}
      </div>
    </div>
  );
};

export default Penalty;
