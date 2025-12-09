import { useState } from "react";
import style from "../../../Style/Reports_Style/WardSwipeReport/WardSwipeReport.module.css";
import { FaCalendarAlt, FaFileExcel } from "react-icons/fa";

const WardSwipeReport = () => {
  const [date, setDate] = useState("2025-12-03");

  // ---------------- STATIC SWIPE DATA ----------------
  const rows = [
    { sr: 1, from: "2", to: "36", driver: "AJAY KUMAR", vehicle: "TATA-AT-0656", swipeBy: "RAHUL NAYAK", time: "06:52:58" },
    { sr: 2, from: "21", to: "57_58", driver: "PAWAN MP", vehicle: "LEY-AT-4620", swipeBy: "RAHUL NAYAK", time: "07:06:56" },
    { sr: 3, from: "51", to: "47", driver: "KALU DAMOR MP", vehicle: "TATA-AT-5517", swipeBy: "NIKHIL JOSHI", time: "07:14:06" },
    { sr: 4, from: "36", to: "37", driver: "AJAY KUMAR", vehicle: "TATA-AT-0656", swipeBy: "RAHUL NAYAK", time: "08:27:08" },
    { sr: 5, from: "30", to: "12", driver: "VIKAS", vehicle: "TATA-AT-5641", swipeBy: "RAHUL NAYAK", time: "08:29:02" },
    { sr: 6, from: "WetWaste-Puliya-Trolly", to: "46", driver: "RAHUL KUMAR", vehicle: "TRACTOR-8349", swipeBy: "NIKHIL JOSHI", time: "09:33:44" },
    { sr: 7, from: "40", to: "11", driver: "MUKESH", vehicle: "TATA-AT-0654", swipeBy: "NIKHIL JOSHI", time: "10:31:05" },
    { sr: 8, from: "31", to: "13", driver: "VISHNU KUMAR", vehicle: "TATA-AT-5949", swipeBy: "NIKHIL JOSHI", time: "11:13:41" },
    { sr: 9, from: "48", to: "59", driver: "RAJMAL MP", vehicle: "TATA-AT-3028", swipeBy: "RAHUL NAYAK", time: "11:58:47" },
    { sr: 10, from: "51", to: "50", driver: "VIJAY KHADIYA MP", vehicle: "TATA-AT-5533", swipeBy: "RAHUL NAYAK", time: "12:55:00" },
    { sr: 11, from: "47", to: "45", driver: "KALU DAMOR MP", vehicle: "TATA-AT-5517", swipeBy: "RAHUL NAYAK", time: "12:55:26" },
    { sr: 12, from: "WetWaste1", to: "17", driver: "SURESH KUMAR", vehicle: "TRACTOR-8259", swipeBy: "RAHUL NAYAK", time: "12:56:44" },
    { sr: 13, from: "14_15", to: "23", driver: "ABHISHEK KUMAR", vehicle: "TATA-AT-5948", swipeBy: "MOHAMMED IRFAN", time: "15:09:42" },
    { sr: 14, from: "10", to: "WetWaste-Beed-Trolly", driver: "MANISH KUMAR", vehicle: "LEY-AT-7152", swipeBy: "NIKHIL JOSHI", time: "17:54:53" },
  ];

  return (
    <div className={style.container}>

      {/* ---------- TOP BAR ---------- */}
      <div className={style.topBar}>

        <div className={style.dateBox}>
          <label>Date</label>

          <div className={style.inputWrapper}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <button className={style.excelBtn}>
          <FaFileExcel /> Export Excel
        </button>

      </div>

      {/* ---------- TABLE ---------- */}
      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Ward From</th>
              <th>Ward To</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Swipe By</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.sr}</td>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td>{row.driver}</td>
                <td>{row.vehicle}</td>
                <td>{row.swipeBy}</td>
                <td>{row.time}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default WardSwipeReport;
