import React, { useEffect, useState } from 'react';
import styles from '../../Style/WorkMonitoringList/WorkMonitoring.module.css';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBasicWorkMonitoringData } from '../../Services/WorkersDetail/WorkersDetailService';
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';

const WorkMonitoringList = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workData, setWorkData] = useState([]);

  let city = "devTest";

  // 🔹 Firebase Connect
  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);
      let config = getCityFirebaseConfig(city);
      connectFirebase(config, city);
    } else {
      localStorage.setItem("city", "DevTest");
      console.warn("⚠ No city found, defaulting to DevTest");
    }
  }, []);

  // 🔹 Fetch Data whenever selectedDate changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBasicWorkMonitoringData(selectedDate);

        console.log("API Response:", res);

        if (res.status === "success") {
          setWorkData(res.data); // <-- final array set
        } else {
          setWorkData([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    localStorage.setItem("city", "DevTest");
    fetchData();

  }, [selectedDate]); // <-- important!

  // Date Picker Functions
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
          <h1 className={styles.title}>Work Monitoring</h1>
        </div>

        {/* DATE SECTION */}
        <div className={styles.dateSection}>
          <div className={styles.dateNavigation}>
            <button className={styles.dateNavButton} onClick={handlePrevDay}>
              <ChevronLeft size={20} />
            </button>

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

        {/* LIST SECTION */}
        <div className={styles.listContainer}>
          {workData.length === 0 ? (
            <p>No Data Found</p>
          ) : (
            workData.map((item, index) => (
              <div key={index} className={styles.card}>

                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <div className={styles.employeeName}>{item.wardName}</div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <table className={styles.cardTable}>
                    <tbody>
                      <tr>
                        <td>Driver</td>
                        <td>{item.workerDetails.driver || "-"}</td>
                      </tr>

                      <tr>
                        <td>Helper</td>
                        <td>{item.workerDetails.helper || "-"}</td>
                      </tr>

                      <tr>
                        <td>Vehicle</td>
                        <td>{item.workerDetails.vehicle || "-"}</td>
                      </tr>

                      <tr>
                        <td>Duty In</td>
                        <td>{item.summary.dutyInTime || "-"}</td>
                      </tr>

                      <tr>
                        <td>Duty Out</td>
                        <td>{item.summary.dutyOutTime || "-"}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkMonitoringList;
