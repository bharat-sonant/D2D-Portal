import dayjs from 'dayjs';
import * as sbs from '../supabaseServices';
import * as db from '../dbServices'
import axios from 'axios';

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const normalizeTime = (value, mode = "first") => {
  if (!value) return null;

  // Convert to array
  let times = [];

  if (Array.isArray(value)) {
    times = value;
  } else if (typeof value === "string") {
    times = value.split(",").map(t => t.trim()).filter(Boolean);
  } else {
    return value; // fallback for unexpected types
  }

  if (!times.length) return null;

  return mode === "last"
    ? times[times.length - 1]
    : times[0];
};



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
  if(cityId !== 95) return;
  if(!date || !wards.length) {
    return { status: 'success', data: [] };
  }

  const [year, monthNum] = date.split('-');
  const monthName = MONTH_NAMES[Number(monthNum) - 1];

  const requests = wards.map(async(wardName)=>{
    try{
    const summaryURL = `https://reengus.firebaseio.com/WasteCollectionInfo/${wardName}/${year}/${monthName}/${date}/Summary.json?alt=media`;
    const workerURL = `https://reengus.firebaseio.com/WasteCollectionInfo/${wardName}/${year}/${monthName}/${date}/WorkerDetails.json?alt=media`;

    const [summaryResp, workerResp] = await Promise.all([
      axios.get(summaryURL),
      axios.get(workerURL)
    ]);

    const summary = summaryResp?.data;
    const workerDetails = workerResp?.data;

    if (!summary && !workerDetails) return null;

    return {
      ward: wardName || null,
      duty_on_time: normalizeTime(summary?.dutyInTime, "first") || null,
      duty_off_time: normalizeTime(summary.dutyOutTime, "last") || null,
      ward_reach_time: normalizeTime(summary.wardReachedOn, "first") || null,
      cityId,
      vehicle: workerDetails?.vehicle ?? null,
      driver_id: workerDetails?.driver ?? null,
      driver_name: workerDetails?.driverName ?? null,
      helper_id: workerDetails?.helper ?? null,
      helper_name: workerDetails?.helperName ?? null,
      second_helper_id: workerDetails?.secondHelper ?? null,
      second_helper_name: workerDetails?.secondHelperName ?? null,
    };
  }catch(err){
    console.error(`Firebase error for ward ${wardName}`, err);
    return null;
  }
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
      duty_on_time: row.duty_on_time ?? null,
      ward_reach_time: row.ward_reach_time ?? null,
      duty_off_time: row.duty_off_time ?? null,
      city_id: row.cityId ?? null,
      vehicle: row.vehicle ?? null,
      driver_id: row.driver_id ?? null,
      driver_name: row.driver_name ?? null,
      helper_id: row.helper_id ?? null,
      helper_name: row.helper_name ?? null,
      second_helper_id: row.second_helper_id ?? null,
      second_helper_name: row.second_helper_name ?? null
    };

    // background upsert
    const result = sbs.saveData("DailyWorkAssignment", payload);
  }
}