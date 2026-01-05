import { useState, useRef, useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import { ArrowDownUp, ArrowDown, ArrowUp } from "lucide-react";
import style from "../../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import { images } from "../../../assets/css/imagePath";

const DailyWorkReport = () => {
  const [date, setDate] = useState("2025-12-05");
  const [rows, setRows] = useState([
    {
      zone: "Zone 1",
      start: "12:38",
      reach: "13:14",
      end: "19:08",
      vehicle: "LEY-AT–7174",
      driver: "SANWAR LAL (909)",
      helper1: "AMIT (C) (1408)",
      helper2: "",
      trips: 1,
      workTime: "6:30 hr",
      haltTime: "2:33 hr",
      workPerc: "70%",
      actualPerc: "33%",
      runKm: "16.232",
      zoneKm: "18.539",
      remark: "",
    },
    {
      zone: "Zone 2",
      start: "07:41",
      reach: "07:49",
      end: "13:38",
      vehicle: "TATA–AT–0662",
      driver: "AJAY KUMAR (1437)",
      helper1: "RAKESH KUMAR (378)",
      helper2: "",
      trips: 2,
      workTime: "5:57 hr",
      haltTime: "0:10 hr",
      workPerc: "100%",
      actualPerc: "100%",
      runKm: "26.505",
      zoneKm: "9.991",
      remark: "",
    },
    {
      zone: "Zone 3",
      start: "12:19",
      reach: "12:38",
      end: "15:16",
      vehicle: "TATA–AT–5520",
      driver: "VIJAY KUMAR (745)",
      helper1: "RAGHUNANDAN (1778)",
      helper2: "",
      trips: 1,
      workTime: "2:57 hr",
      haltTime: "0:15 hr",
      workPerc: "91%",
      actualPerc: "40%",
      runKm: "15.623",
      zoneKm: "7.311",
      remark: "ghar per urgent kaam hone ke kaaran ward pura nhi ho paya",
    },
  ]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ----------------------------
  // SORT FUNCTIONS
  // ----------------------------
  const sortLowToHigh = () => {
    const sorted = [...rows].sort(
      (a, b) => parseFloat(a.actualPerc) - parseFloat(b.actualPerc)
    );
    setRows(sorted);
    setIsSortOpen(false);
  };

  const sortHighToLow = () => {
    const sorted = [...rows].sort(
      (a, b) => parseFloat(b.actualPerc) - parseFloat(a.actualPerc)
    );
    setRows(sorted);
    setIsSortOpen(false);
  };

  const getWorkColor = (perc) => {
    const value = parseInt(perc);

    if (value >= 90) return "var(--textSuccess)";
    if (value >= 70) return "var(--themeColor)";
    if (value >= 40) return "var(--pending)";
    return "var(--textDanger";
  };
  return (
    <>
      {/* TOP BAR */}
      <div className={style.topBar}>
        {/* DATE PICKER */}
        {/* <div
          className={style.dateBox}
          onClick={() =>
            document.getElementById("reportDateInput").showPicker()
          }
        >
          <input
            id="reportDateInput"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={style.dateInput}
          />
        </div> */}
        <CustomDatePicker value={date} onChange={(val) => setDate(val)} />
        {/* SORT + EXPORT BUTTONS */}
        <div className={style.rightButtons} ref={sortRef}>
          {/* SORT BUTTON */}
          <button
            className={style.sortBtn}
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <ArrowDownUp size={16} />
            <div> Sort by</div>
          </button>

          {/* SORT DROPDOWN */}
          {isSortOpen && (
            <div className={style.sortDropdown}>
              <div className={style.sortItem} onClick={sortLowToHigh}>
                <ArrowUp size={16} className={style.sortUpIcon} />
                Actual Work % ( Low → High )
              </div>

              <div className={style.sortItem} onClick={sortHighToLow}>
                <ArrowDown size={16} className={style.sortDownIcon} />
                Actual Work % ( High → Low )
              </div>
            </div>
          )}

          {/* EXPORT BUTTON */}
          <button className={style.exportBtn}>
            <img
              src={images.iconExcel}
              className={style.iconExcel}
              title="Export to Excel"
              alt="Export to Excel"
            />{" "}
            <div> Export to Excel</div>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Zone</th>
              <th>Start Time</th>
              <th>Ward Reach On</th>
              <th>End Time</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Helper</th>
              <th>Second Helper</th>
              <th>Trip/Bins</th>
              <th>Work Time</th>
              <th>Halt Time</th>
              <th>Work %</th>
              <th>Actual Work %</th>
              <th>Run KM</th>
              <th>Zone Run KM</th>
              <th>Remark</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.zone}</td>
                <td>{row.start}</td>
                <td>{row.reach}</td>
                <td>{row.end}</td>
                <td>
                  <span className={style.vehicleNumber}> {row.vehicle}</span>
                </td>
                <td className={style.driverName}>{row.driver}</td>
                <td className={style.helperName}>{row.helper1}</td>
                <td>{row.helper2?.trim() || "-"}</td>

                <td>
                  <span className={style.tripBG}> {row.trips}</span>
                </td>
                <td>{row.workTime}</td>
                <td>{row.haltTime}</td>
                <td>
                  <div className={style.progressCell}>
                    <span className={style.percentageText}>{row.workPerc}</span>

                    <div className={style.progressBar}>
                      <div
                        className={style.progressFill}
                        style={{
                          width: row.workPerc,
                          "--progress-color": getWorkColor(row.workPerc),
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className={style.progressCell}>
                    <span className={style.percentageText}>
                      {row.actualPerc}
                    </span>

                    <div className={style.progressBar}>
                      <div
                        className={style.progressFill}
                        style={{
                          width: row.actualPerc,
                          "--progress-color": getWorkColor(row.actualPerc),
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>{row.runKm}</td>
                <td>{row.zoneKm}</td>
                <td>
                  <div className={style.remark}>{row.remark}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DailyWorkReport;
