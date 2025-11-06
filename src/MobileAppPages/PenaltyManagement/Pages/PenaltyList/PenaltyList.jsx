import React, { useEffect, useState } from "react";
import styles from "../../Styles/Penalties/PenaltyList.module.css";
import {
  ArrowLeft,
  Calendar,
  ArrowRight,
  Plus,
  Pencil,
  IndianRupee,
} from "lucide-react";

const PenaltyList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [penalties, setPenalties] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        employee: "Driver 1 - Bharat (104)",
        entry: "Penalty",
        amount: 50,
        reason: "Alcohol consumption in working hours",
        penalizedBy: "Bharat",
        time: "12:13",
      },
      {
        id: 2,
        employee: "Helper 1 - Bharat (105)",
        entry: "Reward",
        amount: 50,
        reason: "Uniform wear",
        penalizedBy: "Bharat",
        time: "12:14",
      },
      {
        id: 3,
        employee: "Khushwant Sharma - Driver (111)",
        entry: "Penalty",
        amount: 50,
        reason: "Absent + Penalty",
        penalizedBy: "Bharat",
        time: "09:26",
      },
      {
        id: 4,
        employee: "Khushwant Sharma - Helper (112)",
        entry: "Reward",
        amount: 100,
        reason: "Citizen Feedback",
        penalizedBy: "Bharat",
        time: "09:27",
      },
    ];
    setPenalties(dummyData);
  }, []);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formattedDate = selectedDate.toISOString().split("T")[0];

  const penaltyCount = penalties.filter((p) => p.entry === "Penalty").length;
  const rewardCount = penalties.filter((p) => p.entry === "Reward").length;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileView}>
        {/* Header (sticky) */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.headerLeft}>
              <ArrowLeft size={22} color="#fff" />
            </div>

            <h1 className={styles.title}>Penalties</h1>

            <button className={styles.addButton}>
              <Plus size={18} />
              ADD
            </button>
          </div>
        </div>

        {/* Date / Filters (sticky below header) */}
        <div className={styles.dateSection}>
          <button onClick={() => changeDate(-1)} className={styles.navButton}>
            <ArrowLeft size={18} />
          </button>

          <div className={styles.dateDisplay}>
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>

          <button onClick={() => changeDate(1)} className={styles.navButton}>
            <ArrowRight size={18} />
          </button>

          <div className={styles.summaryBox}>
            <div className={styles.summaryItem}>
              <p>Penalty</p>
              <span>{penaltyCount}</span>
            </div>
            <div className={styles.summaryItem}>
              <p>Reward</p>
              <span>{rewardCount}</span>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className={styles.listContainer}>
          {penalties.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.employeeName}>{item.employee}</h3>
                <Pencil size={18} color="#555" />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.row}>
                  <span className={styles.label}>Entry</span>
                  <span
                    className={styles.value}
                    style={{
                      color: item.entry === "Penalty" ? "#d32f2f" : "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    {item.entry}
                  </span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Amount</span>
                  <span className={styles.value}>
                    <IndianRupee size={14} /> {item.amount} | {item.reason}
                  </span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Reason</span>
                  <span className={styles.value}>{item.reason}</span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Penalized by</span>
                  <span className={styles.value}>
                    {item.penalizedBy} ({item.time})
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* filler to allow space above fixed download button on small lists */}
          <div style={{ height: 120 }} />
        </div>

        {/* Fixed Download Button */}
        <button className={styles.downloadBtn}>DOWNLOAD PENALTY/REWARD</button>
      </div>
    </div>
  );
};

export default PenaltyList;
