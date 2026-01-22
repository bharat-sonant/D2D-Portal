import React, { useState } from 'react';
import AddFuelEntries from '../../components/FuelEntries/AddFuelEntries';
import styles from './FuelEntries.module.css';

const FuelEntries = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Fuel Entries</h1>
        <button
          onClick={() => setShowCanvas(true)}
          className={styles.addButton}
        >
          +
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <p>No fuel entries yet</p>
          <p className={styles.emptyStateSubtext}>
            Tap the + button to add your first entry
          </p>
        </div>
      </div>

      {/* Add Fuel Entries Modal */}
      <AddFuelEntries
        showCanvas={showCanvas}
        setShowCanvas={setShowCanvas}
      />
    </div>
  );
};

export default FuelEntries;
