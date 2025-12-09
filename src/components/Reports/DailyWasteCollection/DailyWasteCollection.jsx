import { useState } from "react";
import style from "../../../Style/Reports_Style/DailyWasteCollection/DailyWasteCollection.module.css";
import { FaCalendarAlt, FaFileExcel } from "react-icons/fa";

const DailyWasteCollection = () => {

  const [date, setDate] = useState("2025-12-09");

  const rows = [
    { sr: 1, ward: "Zone 1", vehicle: "LEY-AT-7174", weight: "1000 kg" },
    { sr: 2, ward: "Zone 2", vehicle: "TATA-AT-5538", weight: "800 kg" },
    { sr: 3, ward: "Zone 3", vehicle: "TATA-AT-5538", weight: "800 kg" },
    { sr: 4, ward: "Zone 4", vehicle: "TATA-AT-5520", weight: "1600 kg" },
    { sr: 5, ward: "Zone 6", vehicle: "TRACTOR-3471", weight: "3000 kg" },
    { sr: 6, ward: "Zone 7", vehicle: "TATA-AT-0656", weight: "800 kg" },
    { sr: 7, ward: "Zone 8", vehicle: "TATA-AT-WeV-5470", weight: "800 kg" },
    { sr: 8, ward: "Zone 9", vehicle: "TATA-AT-WeV-5825", weight: "800 kg" },
    { sr: 9, ward: "Zone 11", vehicle: "TATA-AT-0654", weight: "1600 kg" },
    { sr: 10, ward: "Zone 12", vehicle: "TATA-AT-5641", weight: "800 kg" },
    { sr: 11, ward: "Zone 13", vehicle: "TATA-AT-5949", weight: "800 kg" },
    { sr: 12, ward: "Zone 16", vehicle: "TRACTOR-5391", weight: "3000 kg" },
    { sr: 13, ward: "Zone 17", vehicle: "TATA-AT-5535", weight: "1600 kg" },
    { sr: 14, ward: "Zone 20", vehicle: "TATA-AT-0673", weight: "800 kg" },
    { sr: 15, ward: "Zone 21", vehicle: "LEY-AT-7157", weight: "1000 kg" },
  ];

  const total = rows.reduce((sum, r) => sum + parseInt(r.weight), 0);

  return (
    <div className={style.container}>


      {/* ---------- TOP BAR ---------- */}
      <div className={style.topBar}>
        
        {/* DATE INPUT */}
        <div className={style.dateBox}>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
    
        </div>

        {/* TOTAL + EXPORT */}
        <div className={style.rightControls}>
          <div className={style.totalBox}>
            <span>Total</span>
            <strong>{total}</strong>
          </div>

          <button className={style.exportBtn}>
            <FaFileExcel /> Export
          </button>
        </div>

      </div>

      {/* ---------- TABLE ---------- */}
      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Ward</th>
              <th>Vehicle</th>
              <th>Waste Weight</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.sr}</td>
                <td>{r.ward}</td>
                <td>{r.vehicle}</td>
                <td>{r.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DailyWasteCollection;
