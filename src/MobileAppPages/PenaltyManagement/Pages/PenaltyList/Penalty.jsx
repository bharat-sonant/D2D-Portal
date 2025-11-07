import { useState } from 'react';
import PenaltiesRewardsDetails from '../../Components/Penalties/PenaltiesRewardsDetails';
import PenaltyList from '../../Components/Penalties/PenaltyList';
import styles from '../../Styles/Penalties/PenaltyList.module.css';

const Penalty = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [transition, setTransition] = useState(''); // track transition direction

  const handleAddClick = () => {
    setTransition('slide-left'); // move to details
    setTimeout(() => setShowDetails(true), 300);
  };

  const handleBack = () => {
    setTransition('slide-right'); // move back to list
    setTimeout(() => setShowDetails(false), 300);
  };

  return (
    <div className={styles.pageWrapper}>
      <div
        className={`${styles.mobileView} ${transition}`}
        onAnimationEnd={() => setTransition('')}
      >
        {!showDetails ? (
          <PenaltyList onAddClick={handleAddClick} />
        ) : (
          <PenaltiesRewardsDetails onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default Penalty;
