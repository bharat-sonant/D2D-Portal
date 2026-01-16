import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import CustomDatePicker from '../../CustomDatePicker/CustomDatePicker';
import style from "../../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css";
import { images } from "../../../assets/css/imagePath";
import { getBinliftingData } from '../../../Actions/ReportAction/BinliftingAction';
import { useCity } from '../../../context/CityContext';

const Binlifting = () => {
  const todayDate = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(todayDate);
  const city = useCity();

  useEffect(() => {
    const year = dayjs(date).format("YYYY");
    const month = dayjs(date).format("MMMM"); 
    const selectedDate = dayjs(date).format("YYYY-MM-DD");
    getBinliftingData(year, month, selectedDate)
  },[city,date])

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
    </>
  )
}

export default Binlifting
