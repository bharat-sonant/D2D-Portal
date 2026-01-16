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
      {console.log('binlifting',binliftingData)}

      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th className={`${style.th1} ${style.parentHeader1}`}>Plan Name</th>
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
                    <td className={style.th7}>
                      <span className={`${style.helperName}`}>
                        {/* {row.helper_name || "N/A"} */}
                        {plan.driver_name}
                      </span>
                    </td>
                    <td className={style.th7}>
                      <span className={`${style.helperName}`}>
                        {/* {row.helper_name || "N/A"} */}
                        {plan.helper_name}
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
