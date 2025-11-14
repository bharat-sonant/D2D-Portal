import React, { useState } from 'react';
import styles from '../../Style/WorkMonitoringList/WorkMonitoring.module.css';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const WorkMonitoringList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const workData = [];

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleDatePicker = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileView}>

        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.backButton}>
            <ArrowLeft size={22} />
          </button>
          <h1 className={styles.title}>Penalties</h1>
        </div>

        {/* DATE SECTION */}
        <div className={styles.dateSection}>

          <div className={styles.dateNavigation}>
            <button className={styles.dateNavButton} onClick={handlePrevDay}>
              <ChevronLeft size={20} />
            </button>

            {/* DATE PICKER */}
            <input
              type="date"
              className={styles.datePicker}
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDatePicker}
            />

            <button className={styles.dateNavButton} onClick={handleNextDay}>
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

        {/* LIST section remains same */}
        <div className={styles.listContainer}>
          {workData.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.employeeName}>{item.name}</div>
                  <div className={styles.penaltyTag}>{item.type}</div>
                </div>
                {/* <button className={styles.editButton}>
                  <Edit2 size={18} color="#666" />
                </button> */}
              </div>

              <div className={styles.cardBody}>
                <table className={styles.cardTable}>
                  <tbody>
                    <tr>
                      <td>Penalty</td>
                      <td>{item.details.penalty}</td>
                    </tr>
                    <tr>
                      <td>Reason</td>
                      <td>{item.details.reason}</td>
                    </tr>
                    <tr>
                      <td>Penalized by</td>
                      <td>{item.details.penalizedBy}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>

       
      </div>
    </div>
  );
};

export default WorkMonitoringList;
