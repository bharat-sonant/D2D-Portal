import React, { useEffect, useState } from 'react';
import styles from '../../Style/WorkMonitoringList/WorkMonitoring.module.css';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBasicWorkMonitoringData } from '../../Services/WorkersDetail/WorkersDetailService';
import { getCityFirebaseConfig } from '../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../firebase/firebaseService';
import { PulseLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';

// ⬅️ Duplicate Remove Function
const formatWorkerValue = (value) => {
  if (!value) return "-";

  const parts = value.split(",").map(v => v.trim());
  const unique = [...new Set(parts)];
  return unique.join(", ");
};

const WorkMonitoringList = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let city = "DevTest";

  const handleBack = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (
      isAndroid &&
      window.AndroidApp &&
      typeof window.AndroidApp.closeWebView === "function"
    ) {
      window.AndroidApp.closeWebView();
    } else {
      navigate(-1);
    }
  };

  // Firebase Connect
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

  // Fetch Data on Date Change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getBasicWorkMonitoringData(selectedDate);

        console.log("API Response:", res);

        if (res.status === "success") {
          setWorkData(res.data);
        } else {
          setWorkData([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [selectedDate]);

  // Date Handlers
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
          <button
            className={styles.backButton}
            onClick={handleBack}
          >
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

          {loading ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px 0"
            }}>
              <PulseLoader color="#3fb2f1" size={12} />
              <p style={{ marginTop: "12px", fontSize: "14px", color: "#555" }}>
                Loading work monitoring data...
              </p>
            </div>
          ) : workData.length === 0 ? (
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
                        <td>{formatWorkerValue(item.workerDetails.driver)}</td>
                      </tr>

                      <tr>
                        <td>Helper</td>
                        <td>{formatWorkerValue(item.workerDetails.helper)}</td>
                      </tr>

                      <tr>
                        <td>Vehicle</td>
                        <td>{formatWorkerValue(item.workerDetails.vehicle)}</td>
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
