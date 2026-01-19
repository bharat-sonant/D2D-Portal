import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import CustomDatePicker from '../../CustomDatePicker/CustomDatePicker';
import style from "../../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css";
import { images } from "../../../assets/css/imagePath";
import { getBinliftingData } from '../../../Actions/ReportAction/BinliftingAction';
import { useCity } from '../../../context/CityContext';
import WevoisLoader from '../../Common/Loader/WevoisLoader';
import NoResult from '../../NoResultFound/NoResult';
import noData from "../../../assets/images/icons/noData.gif";

const Binlifting = () => {
  const todayDate = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(todayDate);
  const {city, cityId} = useCity();
  const [binliftingData, setBinliftingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const year = dayjs(date).format("YYYY");
    const month = dayjs(date).format("MMMM"); 
    const selectedDate = dayjs(date).format("YYYY-MM-DD");
    getBinliftingData(cityId, year, month, selectedDate, setBinliftingData, setLoading)
  },[cityId,date])

  //includes times in seconds also
const calculateWorkingHours = (dutyOn, dutyOff) => {
  if (!dutyOn || !dutyOff) return null;

  const toSeconds = (time) => {
    const [hh = 0, mm = 0, ss = 0] = time.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  };

  let start = toSeconds(dutyOn);
  let end = toSeconds(dutyOff);

  if (isNaN(start) || isNaN(end)) return null;

  // 🌙 Night shift handling (crosses midnight)
  if (end < start) {
    end += 24 * 3600;
  }

  const diffSeconds = end - start;

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};


  return (
    <>
       <div className={style.topBar}>
        {/* DATE PICKER */}
        <CustomDatePicker value={date} onChange={(val) => setDate(val)} />
        {/* SORT + EXPORT BUTTONS */}
        <div className={style.rightButtons}>

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

      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
             <tr>
              <th
                className={`text-start ${style.parentHeader} `}
                style={{ width: "15%" }}
              >
                #
              </th>
              <th
                className={`${style.parentHeader} `}
                style={{ width: "35%" }}
                colSpan={3}
              >
                Timing Details
              </th>
              <th
                className={style.parentHeader}
                style={{ width: "50%" }}
                colSpan={3}
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
              <th className={`${style.th1} ${style.parentHeader1}`}>Plan Name</th>
              <th className={style.th2}>Duty On </th>
              <th className={`${style.th4}`}>
                Duty Off
              </th>
              <th className={`${style.th4} ${style.borderRight}`}>
                Working Hrs
              </th>
              <th className={style.th6}>Driver</th>
              <th className={style.th7}>Helper</th>
              <th className={style.th5}>Vehicle</th>
              <th className={`text-center ${style.th3}`}>Bin Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className={style.loaderCell}>
                  <WevoisLoader title="Loading data..." />
                </td>
              </tr>
            ) :  binliftingData?.length > 0 ? (
              binliftingData?.map((plan) => {
                return (
                  <tr key={plan.plan_id}>
                    <td className={style.th1}>{plan.plan_name || "-"}</td>
                    <td className={`${style.th2}`}>
                      {plan?.in_time || "-"}
                    </td>
                    <td className={`${style.th4}`}>
                      {plan?.out_time || "-"}
                    </td>
                    <td className={`${style.th4} ${style.borderRight}`}>
                      {calculateWorkingHours(
                        plan?.in_time,
                        plan?.out_time
                      ) || "-"}
                    </td>
                    <td className={style.th7}>
                      <span className={style.helperName}>
                        {plan.driver_name}
                        {plan.driver_id ? ` (${plan.driver_id})` : ""}
                      </span>
                    </td>
                    <td className={style.th7}>
                      <span className={`${style.helperName}`}>
                        {plan.helper_name}
                        {plan.helper_id ? ` (${plan.helper_id})` : ""}
                      </span>
                    </td>
                    <td className={style.th1}>{plan.vehicle || "-"}</td>
                    <td className={`text-center ${style.th4}`}>
                      <span className={style.tripBG}>
                        {plan?.bin_count ?? 0}
                      </span>
                    </td>
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
  )
}

export default Binlifting
