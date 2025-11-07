import { useEffect, useState } from 'react';
import PenaltiesRewardsDetails from '../../Components/Penalties/PenaltiesRewardsDetails';
import PenaltyList from '../../Components/Penalties/PenaltyList';
import styles from '../../Styles/Penalties/PenaltyList.module.css';

const Penalty = () => {
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileView}>
        {!showDetails ? (
          <PenaltyList onAddClick={() => setShowDetails(true)} />
        ) : (
          <PenaltiesRewardsDetails onBack={() => setShowDetails(false)} />
        )}
      </div>
    </div>
  );
};

export default Penalty;
