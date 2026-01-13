import { useState, useRef, useEffect, useMemo } from "react";
import noData from "../../../assets/images/icons/noData.gif";
import style from "../../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";
import { images } from "../../../assets/css/imagePath";
import {
  getDailyWorkReportAction,
  getWardDataAction,
} from "../../../Actions/ReportAction/DailyWorkReportAction";
import WevoisLoader from "../../Common/Loader/WevoisLoader";
import dayjs from "dayjs";
import { useCity } from "../../../context/CityContext";
import NoResult from "../../NoResultFound/NoResult";

const DailyWorkReport = () => {
  const todayDate = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(todayDate);
  const { cityId } = useCity();
  const [wards, setWards] = useState([]);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    getWardDataAction(cityId, setWards);
  }, [cityId]);

  useEffect(() => {
    getDailyWorkReportAction(date, wards, setReportData, setLoading, cityId);
  }, [date, wards]);

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

  const reportByWardId = useMemo(() => {
    return reportData?.reduce((acc, row) => {
      acc[String(row.ward_id)] = row;
      return acc;
    },{})
  },[reportData])

  //calculating working hours on base of duty on and duty off time
  const calculateWorkingHours = (dutyOn, dutyOff) => {
    if(!dutyOn || !dutyOff) return null;

    const toMinutes = (time) => {
      const parts = time.split(":").map(Number);
      const [hh, mm, ss = 0] = parts;
      return hh * 60 + mm + ss / 60;
    }
    const start = toMinutes(dutyOn);
    const end = toMinutes(dutyOff);

    if (isNaN(start) || isNaN(end) || end < start) return null;

  const diffMinutes = end - start;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = Math.round(diffMinutes % 60);

  return `${hours}h ${minutes}m`;
  }
//without changing case -> for vehicle names
const renderMultiLine = (value) => {
  if (!value) return "-";

  const uniqueMap = new Map();

  value
    .split(",")
    .map(v => v.trim())
    .filter(Boolean)
    .forEach(v => {
      const key = v.toLowerCase(); // 🔑 case-insensitive check
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, v); // preserve first seen format
      }
    });

  return [...uniqueMap.values()].map((item, index) => (
    <div key={index}>{item}</div>
  ));
};

//changing case for driver halper names
const renderMultiLineName = (value) => {
  if (!value) return "-";

  const uniqueMap = new Map();

  value
    .split(",")
    .map(v => v.trim())
    .filter(Boolean)
    .forEach(v => {
      const key = v.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, titleCaseName(v)); // ✅ only here
      }
    });

  return [...uniqueMap.values()].map((item, index) => (
    <div key={index}>{item}</div>
  ));
};




  // ----------------------------
  // SORT FUNCTIONS
  // ----------------------------
  // const sortLowToHigh = () => {
  //   const sorted = [...rows].sort(
  //     (a, b) => parseFloat(a.actualPerc) - parseFloat(b.actualPerc)
  //   );
  //   setRows(sorted);
  //   setIsSortOpen(false);
  // };

  // const sortHighToLow = () => {
  //   const sorted = [...rows].sort(
  //     (a, b) => parseFloat(b.actualPerc) - parseFloat(a.actualPerc)
  //   );
  //   setRows(sorted);
  //   setIsSortOpen(false);
  // };

  const getWorkColor = (perc) => {
    const value = parseInt(perc);

    if (value >= 90) return "var(--textSuccess)";
    if (value >= 70) return "var(--themeColor)";
    if (value >= 40) return "var(--pending)";
    return "var(--textDanger";
  };
  const titleCaseName = (name = "") => {
    if (!name) return "-";

    return name
      .toLowerCase()
      .trim()
      .split(/\s+/) // multiple spaces safe
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <>
      {/* TOP BAR */}
      <div className={style.topBar}>
        {/* DATE PICKER */}
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
              <th
                className={`text-start ${style.parentHeader} `}
                style={{ width: "10%" }}
              >
                #
              </th>
              <th
                className={`${style.parentHeader} `}
                style={{ width: "30%" }}
                colSpan={4}
              >
                Timing Details
              </th>
              <th
                className={style.parentHeader}
                style={{ width: "50%" }}
                colSpan={4}
              >
                Person / Vehicle Details
              </th>
              
               <th
                className={`text-start ${style.parentHeader} `}
                style={{ width: "10%" }}
              >
                
              </th>
            </tr>
            <tr>
              <th className={`${style.th1} ${style.parentHeader1}`}>Ward</th>
              <th className={style.th2}>Duty On </th>
              <th className={style.th3}>Ward Reach </th>
              <th className={`${style.th4}`}>
                Duty Off 
              </th>
              <th className={`${style.th4} ${style.borderRight}`}>
                Working Hrs
              </th>
              <th className={style.th5}>Vehicle</th>
              <th className={style.th6}>Driver</th>
              <th className={style.th7}>Helper</th>
              <th className={style.th8}>Second Helper</th>
              <th className={`text-center ${style.th3}`}>
                Trip Count
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className={style.loaderCell}>
                  <WevoisLoader title="Loading data..." />
                </td>
              </tr>
            ) : wards?.length > 0 && reportData?.length > 0 ? (
              wards?.map((ward) => {
                const row = reportByWardId[String(ward.ward_id)];
                return(
                <tr key={ward.ward_id}>
                  <td className={style.th1}>{ward.ward_display_name}</td>
                  <td className={`${style.th2}`}>
                    {row?.duty_on_time || "-"}
                  </td>
                  <td className={style.th3}>{row?.ward_reach_time || "-"}</td>
                  <td className={`${style.th4}`}>
                    {row?.duty_off_time || "-"}
                  </td>
                   <td className={`${style.th4} ${style.borderRight}`}>
                    {calculateWorkingHours(
                      row?.duty_on_time,
                      row?.duty_off_time
                    ) || "-"}
                  </td>
                  <td className={`${style.th5}`}>
                    <span 
                    // className={` ${style.vehicleNumber}`}
                    >
                      {renderMultiLine(row?.vehicle) || "-"}
                    </span>
                  </td>
                  <td className={style.th6}>
                    <span className={`${style.driverName}`}>
                      {" "}
                      {/* {row.driver_name || "N/A"} */}
                      {renderMultiLineName(row?.driver_name)}
                    </span>
                  </td>
                  <td className={style.th7}>
                    <span className={`${style.helperName}`}>
                      {/* {row.helper_name || "N/A"} */}
                      {renderMultiLineName(row?.helper_name)}
                    </span>
                  </td>
                  <td className={style.th8}>
                    <span className={`${style.helperName}`}>
                      {/* {row.second_helper_name || "N/A"} */}
                      {renderMultiLineName(row?.second_helper_name)}
                    </span>
                  </td>
                   <td className={`text-center ${style.th4}`}>
                    <span className={style.tripBG }>
                    {row?.trip_count ?? 0}
                    </span>
                  </td>

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
              )
})
            ) : (
              <tr>
                <td colSpan={10} className={style.noData}>
                  <NoResult
                    title="No data available"
                    // query={searchTerm}
                    gif={noData}
                    // height="calc(100vh - 280px)"
                  />
                  {/* <div className={style.noUserData}>
                      <img
                        src={images.noDAtaAvailable}
                        className={style.noUserImg}
                        alt="No data available"
                      />
                      <span>No data available</span>
                    </div> */}
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
