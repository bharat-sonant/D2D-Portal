import { useNavigate } from 'react-router-dom';
import PenaltiesRewardsDetails from '../../Components/Penalties/PenaltiesRewardsDetails';
import PenaltyList from '../../Components/Penalties/PenaltyList';
import styles from '../../Styles/Penalties/PenaltyList.module.css';
import { useState } from 'react';

const Penalty = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.mobileView}>
          {!showDetails ? (
            <PenaltyList onAddClick={() => setShowDetails(true)} />
          ) : (
            <PenaltiesRewardsDetails onBack={() => setShowDetails(false)} />
          )}
        </div>
      </div>
    </>
  )
}

export default Penalty