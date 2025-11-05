import React from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation } from "react-router-dom";

const StartAssignment = () => {
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search);
  // Sample data — replace with real data later
   const ward = queryParams.get("ward") || "N/A";
  const user = queryParams.get("user") || "N/A";
  const city = queryParams.get("city") || "N/A";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Start Assignment</h2>

        <div className={styles.details}>
          <p>
            <strong>City:</strong> {city}
          </p>
          <p>
            <strong>Ward:</strong> {ward}
          </p>
          <p>
            <strong>User:</strong> {user}
          </p>
        </div>

        <button
          className={styles.startButton}
          onClick={() => alert("Assignment Started")}
        >
          Start Assignment
        </button>
      </div>
    </div>
  );
};

export default StartAssignment;
