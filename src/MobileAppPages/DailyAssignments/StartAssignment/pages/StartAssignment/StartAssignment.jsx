import React from "react";
import styles from "../../styles/StartAssignment.module.css";

const StartAssignment = () => {
  // Sample data — replace with real data later
  const ward = "Ward 14 - Shastri Nagar";
  const user = "Govind Sharma";
  const city = "Jaipur";

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
