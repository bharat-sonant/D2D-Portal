import { useState } from "react";
import style from "../../../Style/Reports_Style/WardMonitoring/WardMonitoring.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const WardMonitoring = () => {

  const [date, setDate] = useState("2025-12-08");
  const [circle, setCircle] = useState("Circle 1");
  const redValues = [12, 38, 30, 14, 55];

  const hourSlots = [
    "07:00","08:00","09:00","10:00","11:00",
    "12:00","13:00","14:00","15:00","16:00",
    "17:00","18:00","19:00","20:00"
  ];

  const tableData = [
    { ward: "Zone 1", duty: "09:19", hours: {} },
    { ward: "Zone 2", duty: "06:19", hours: { "07:00": 29, "08:00": 59, "09:00": 87, "10:00": 100 } },
    { ward: "Zone 3", duty: "13:25", hours: { "13:00": 12, "15:00": 12, "16:00": 22 } },
    { ward: "Zone 4", duty: "07:41", hours: { "09:00": 6, "10:00": 38, "11:00": 38, "12:00": 40, "13:00": 88, "14:00": 100 } },
    { ward: "Zone 5", duty: "16:40", hours: { "18:00": 34, "19:00": 37 } },
    { ward: "Zone 6", duty: "06:43", hours: {
        "08:00": 5, "09:00": 18, "10:00": 23, "11:00": 30, "12:00": 30,
        "13:00": 48, "14:00": 73, "15:00": 95, "16:00": 100
      }
    },
    { ward: "Zone 11", duty: "10:35", hours: { "12:00": 14, "13:00": 14, "14:00": 93, "15:00": 100 } },
    { ward: "Zone 12", duty: "08:33", hours: { "09:00": 11, "10:00": 70, "11:00": 81, "12:00": 98 } },
    { ward: "Zone 13", duty: "08:49", hours: { "09:00": 15, "10:00": 89, "11:00": 100 } },

    { ward: "Zone 14–15", duty: "08:08", grey: true,
      hours: { "09:00": 4, "10:00": 36, "11:00": 47, "12:00": 49, "13:00": 51, "14:00": 75, "15:00": 100 }
    },

    { ward: "Zone 16", duty: "13:37", hours: { "17:00": 50, "18:00": 54 } },
    { ward: "Zone 17", duty: "06:24", hours: { "08:00": 5, "09:00": 45, "10:00": 86, "11:00": 99, "12:00": 100 } },
    { ward: "Zone 18_19", duty: "09:42",
      hours: { "12:00": 5, "13:00": 16, "14:00": 26, "15:00": 43, "16:00": 55, "17:00": 55 }
    },

    { ward: "Zone Market-4-Morning", duty: "--", pink: true, hours: {} },
    { ward: "Zone Market-4-Evening", duty: "17:32", pink: true,
      hours: { "18:00": 9, "19:00": 79, "20:00": 100 }
    }
  ];

  return (
    <div className={style.container}>

      <div className={style.topBar}>

        <div className={style.dateNav}>
          <button className={style.navBtn}><FaChevronLeft /></button>

          <input
            type="date"
            className={style.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button className={style.navBtn}><FaChevronRight /></button>
        </div>

        <select
          className={`${style.circleSelect}`}
          value={circle}
          onChange={(e) => setCircle(e.target.value)}
        >
          <option>Circle 1</option>
          <option>Circle 2</option>
          <option>Circle 3</option>
          <option>Circle 4</option>
          <option>Circle 5</option>
          <option>Circle 6</option>
        </select>

      </div>

      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Ward</th>
              <th>Duty On Time</th>
              {hourSlots.map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, idx) => (
              <tr
                key={idx}
                className={
                  row.grey ? style.greyRow :
                  row.pink ? style.pinkRow : ""
                }
              >
                <td>{row.ward}</td>
                <td>{row.duty}</td>

                {hourSlots.map((h) => (
                  <td key={h}>
                    {row.hours[h] !== undefined &&
                      (redValues.includes(row.hours[h]) ? (
                        <span className={style.badge}>{row.hours[h]}</span>
                      ) : (
                        <span>{row.hours[h]}</span>
                      ))}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default WardMonitoring;
