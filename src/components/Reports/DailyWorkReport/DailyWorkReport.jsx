import { useState, useRef, useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import { ArrowDownUp, ArrowDown, ArrowUp } from "lucide-react";
import style from "../../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import { images } from "../../../assets/css/imagePath";
import { getDailyWorkReportAction, getWardDataAction } from "../../../Actions/ReportAction/DailyWorkReportAction";
import WevoisLoader from "../../Common/Loader/WevoisLoader";
import dayjs from "dayjs";
import { useCity } from "../../../context/CityContext";

const DailyWorkReport = () => {
  const todayDate = dayjs().format('YYYY-MM-DD')
  const [date, setDate] = useState(todayDate);
  const {cityId} = useCity();
  const [wards, setWards] = useState([]);
  const [rows, setRows] = useState([
    {
      zone: "Zone 1",
      start: "12:38",
      reach: "13:14",
      end: "19:08",
    },
    {
      zone: "Zone 2",
      start: "07:41",
      reach: "07:49",
      end: "13:38",
    },
    {
      zone: "Zone 3",
      start: "12:19",
      reach: "12:38",
      end: "15:16",
    },
  ]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(()=>{
    getWardDataAction(cityId, setWards);
  },[cityId])

  useEffect(()=>{
    getDailyWorkReportAction(date,wards,  setReportData, setLoading, cityId);
  },[date,wards])

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
          {/* <button
            className={style.sortBtn}
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <ArrowDownUp size={16} />
            <div> Sort by</div>
          </button> */}

          {/* SORT DROPDOWN */}
          {/* {isSortOpen && (
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
          )} */}

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
              <th className={style.th1}>Ward</th>
              <th className={style.th2}>Duty On Time</th>
              <th className={style.th3}>Ward Reach Time</th>
              <th className={style.th4}>Duty Off Time</th>
            </tr>
          </thead>
          <tbody>
            {loading? (
              <tr>
                <td colSpan={4} className={style.loaderCell}>
                  <WevoisLoader title="Loading data..." />
                </td>
              </tr>
            ) :reportData?.length > 0 ?(
              reportData?.map((row, index) => (
              <tr key={index}>
                <td>{row.ward}</td>
                <td>{row.duty_on_time || row.dutyInTime || 'N/A'}</td>
                <td>{row.ward_reach_time || row.wardReachedOn || 'N/A'}</td>
                <td>{row.duty_off_time || row.dutyOutTime || 'N/A'}</td>
               
                
                {/* <td>
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
                </td> */}
              </tr>
              ))
              ):(
                <tr>
                  <td colSpan={4} className={style.noData}>
                    No data found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DailyWorkReport;
