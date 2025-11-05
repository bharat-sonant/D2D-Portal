import React, { useEffect, useState } from "react";
import styles from "../../Styles/Penalties/PenaltyList.module.css";
import { User, MapPin } from "lucide-react";

const PenaltyList = () => {
  const [user, setUser] = useState(null);
  const [city, setCity] = useState("");
  const [penalties, setPenalties] = useState([]);

  // Parse data from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 1️⃣ Get logged-in user info
    const userJson = params.get("user");
    if (userJson) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userJson));
        setUser(decodedUser);
        setCity(decodedUser.city || "");
      } catch (err) {
        console.error("Failed to parse user JSON:", err);
      }
    }

    // 2️⃣ Optionally, listen for data sent from Android WebView
    window.setPenaltyData = (data) => {
      try {
        const parsedData = JSON.parse(data);
        setPenalties(parsedData);
      } catch (err) {
        console.error("Failed to parse penalty data:", err);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* User Card */}
      <div className={styles.card}>
        <div className={styles.userSection}>
          <div className={styles.userIcon}>
            <User size={28} />
          </div>
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{user?.name || "Employee Name"}</h2>
            <p className={styles.userMeta}>
              ID: {user?.loginId || "EMP123"} &nbsp;•&nbsp; {user?.loginType || "Employee"}
            </p>
          </div>
        </div>

        <div className={styles.citySection}>
          <MapPin size={20} className={styles.cityIcon} />
          <span className={styles.cityName}>{city || "No City Selected"}</span>
        </div>
      </div>

      {/* Penalty / Reward List */}
      {/* <div className={styles.listContainer}>
        <h3 className={styles.sectionTitle}>Penalty / Reward Records</h3>
        {penalties.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {penalties.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.type}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.placeholder}>No records available yet.</p>
        )}
      </div> */}
    </div>
  );
};

export default PenaltyList;
