import dayjs from "dayjs";
import { fetchCalenderData } from "../../services/supabaseServices";
import * as common from '../../common/common'

export const prevMonthAction = (setCurrentDate) => {
    setCurrentDate(pre => pre.subtract(1, 'month'));
};

export const nextMonthAction = (setCurrentDate) => {
    setCurrentDate(pre => pre.add(1, 'month'));
};

export const getDatesArrayAction = async (setDaysArray, currentDate,userId) => {
    const year = currentDate.format('YYYY');
    const month = currentDate.format('MMMM');
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day();
 
     const monthCode = common.getMonthCode(month);
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ day: '' });
    }

     let response = await fetchCalenderData(userId,year,monthCode);
   let monthDates = getAllDatesOfMonth(monthCode+1,year)
   let mapDates = mapDatesWithStatus(monthDates,response.data)
   
        for (let i = 1; i <= daysInMonth; i++) {
            let dateObj = currentDate.date(i);
            let isSunday = dateObj.day() === 0;
            let detail = mapDates.find(item => Number(item.date.split('-')[2]) === i);

            let status = 0;
            let backgroundColor = '';
            let color = 'black';

            if (detail) {
                status = detail.status || 0;
                backgroundColor = detail.backgroundColor || '';
                color = detail.backgroundColor === '#707070' ? 'white' : '#000000';
            }

            if (isSunday && status === 0) {
                status = 7;
            }

            days.push({
                ...detail,
                backgroundColor,
                day: detail && detail.status === 6 ? "H" : i,
                status,
                color
            });
        }
    // } else {
    //     for (let i = 1; i <= daysInMonth; i++) {
    //         let dateObj = currentDate.date(i);
    //         let isSunday = dateObj.day() === 0;
    //         days.push({
    //             backgroundColor: '',
    //             day: i,
    //             color: 'black',
    //             status: isSunday ? 7 : 0
    //         });
    //     }
     
    setDaysArray([...days]);
};

function getAllDatesOfMonth(month, year) {
  const dates = [];
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    dates.push(`${year}-${mm}-${dd}`);
  }

  return dates;
}


function mapDatesWithStatus(allDates, loginArray) {
  if (loginArray===undefined) {
    return allDates.map(date => ({
      date,
      status: 0
    }));
  }
  const loginDateSet = new Set(loginArray.filter(item => item?.login_date).map(item => item.login_date));
  return allDates.map(date => ({
    date,
    status: loginDateSet.has(date) ? 1 : 0
  }));
}




export const getBackgroundColor = (status, date) => {
    const dayOfWeek = dayjs(date).day();
    const currentDate = dayjs();
    const currentDateFormatted = currentDate.format('YYYY-MM-DD');
    const targetDate = dayjs(date).format('YYYY-MM-DD');
    const isPastDate = dayjs(targetDate).isBefore(currentDateFormatted, 'day');

    if (status !== 0 && status !== 7) {
        return getDefaultBackgroundColor(status);
    }

    if (dayOfWeek === 0) {
        return '#e8e8e8';
    }

    if (isPastDate && status === 0) {
        return '#fdbebe';
    }

    return 'transparent';
};


const getDefaultBackgroundColor = (status) => {
    switch (status) {
        case 0:
            return 'transparent';
        case 1:
            return '#b8e3f4';
        case 2:
            return '#B7E4C7';
        case 3:
            return '#ffc4c0';
        case 5:
            return '#f9daa4';
        case 6:
            return '#e8e8e8';
        default:
            return 'transparent';
    }
};

