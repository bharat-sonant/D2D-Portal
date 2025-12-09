import { useState } from "react";
import style from "../../../Style/Reports_Style/SevenDaysWorkReport/SevenDaysWorkReport.module.css";

const SevenDaysWorkReport = () => {
  const [circle, setCircle] = useState("Circle 1");

  const dates = [
    "2025-12-09",
    "2025-12-08",
    "2025-12-07",
    "2025-12-06",
    "2025-12-05",
    "2025-12-04",
    "2025-12-03",
  ];

  const isRed = (val) => val !== "100%" && val !== "";

  const rows = [
    { zone: "1", values: ["35%", "25%", "40%", "0%", "33%", "4%", "47%"] },
    { zone: "2", values: ["100%", "100%", "100%", "100%", "100%", "0%", "0%"] },
    { zone: "3", values: ["61%", "22%", "0%", "41%", "40%", "14%", "0%"] },
    { zone: "4", values: ["100%", "100%", "100%", "100%", "100%", "0%", "100%"] },
    { zone: "5", values: ["0%", "36%", "97%", "97%", "97%", "52%", "94%"] },

    // ❗ Grey rows removed completely
    { zone: "6", values: ["100%", "100%", "100%", "60%", "0%", "0%", "22%"] },

    { zone: "11", values: ["100%", "100%", "100%", "100%", "100%", "100%", "100%"] },
    { zone: "12", values: ["98%", "98%", "98%", "100%", "98%", "98%", "98%"] },
    { zone: "13", values: ["100%", "100%", "100%", "100%", "100%", "100%", "100%"] },
    { zone: "14_15", values: ["100%", "100%", "0%", "100%", "100%", "100%", "98%"] },
    { zone: "16", values: ["100%", "53%", "100%", "60%", "100%", "100%", "100%"] },
    { zone: "17", values: ["100%", "100%", "100%", "100%", "0%", "77%", "74%"] },
    { zone: "18_19", values: ["41%", "55%", "71%", "70%", "96%", "95%", "75%"] },

    // Pink rows remain only
    { zone: "Market-4-Morning", pink: true, values: ["0%", "0%", "0%", "0%", "0%", "0%", "0%"] },
    { zone: "Market-4-Evening", pink: true, values: ["0%", "100%", "100%", "100%", "100%", "100%", "100%"] },
  ];

  return (
    <div className={style.container}>

      <div className={style.topBar}>
        <select
          className={style.dropdown}
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
              <th>Zone</th>
              {dates.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={row.pink ? style.pinkRow : ""}
              >
                <td>{row.zone}</td>

                {row.values.map((val, i) => (
                  <td
                    key={i}
                    className={isRed(val) ? style.redCell : ""}
                    style={{ color: isRed(val) ? "red" : "black" }}
                  >
                    {val}
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

export default SevenDaysWorkReport;
