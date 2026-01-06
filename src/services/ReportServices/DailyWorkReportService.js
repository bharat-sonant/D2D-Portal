import dayjs from 'dayjs';
import * as sbs from '../supabaseServices';
import * as db from '../dbServices'
import axios from 'axios';

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];


export const getDailyWorkReport = async(date, cityId) => {
  const result = await sbs.getDataByColumns('DailyWorkAssignment', {date, city_id: cityId})
  
  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : "Daily work report data fetched successfully",
    data : result?.data || []
  }
}

export const DailyWorkReportDataFromFirebase = async(date, wards, cityId) => {
  if(!date || !wards.length) {
    return { status: 'success', data: [] };
  }

  const [year, monthNum] = date.split('-');
  const monthName = MONTH_NAMES[Number(monthNum) - 1];

  const requests = wards.map(async(wardName)=>{
    // const path = `WasteCollectionInfo/${wardName}/${year}/${monthName}/${date}`;
    // const dayData = await db.getData(path);
    const URL = `https://reengus.firebaseio.com/WasteCollectionInfo/${wardName}/${year}/${monthName}/${date}/Summary.json?alt=media`
    const dayData = await axios.get(URL);

    if (!dayData?.data) return null;

    const summary = dayData?.data;

    return {
      ward: wardName,
      dutyInTime: summary?.dutyInTime ?? null,
      dutyOutTime: summary?.dutyOutTime ?? null,
      wardReachedOn: summary?.wardReachedOn ?? null,
      cityId
    };
  })

  const results = (await Promise.all(requests)).filter(Boolean);
  return {
    status : 'success',
    message : 'Firebase daily report data fetched successfully.',
    data : results
  }
}

export const getWardData = async(cityId) => {
  const result = await sbs.getDataByColumnName('Wards', 'city_Id', cityId)
  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : 'Ward list fetched successfully',
    data : result?.data
  }
}

export const saveDailyWorkReportToSupabase = async(date, data) => {
  if(!date || !data.length) return;

  for (const row of data) {
    const payload = {
      date,
      ward: row.ward,
      duty_on_time: row.dutyInTime ?? null,
      ward_reach_time: row.wardReachedOn ?? null,
      duty_off_time: row.dutyOutTime ?? null,
      city_id: row.cityId ?? null
    };

    // background upsert
    const result = sbs.saveData("DailyWorkAssignment", payload);
  }
}