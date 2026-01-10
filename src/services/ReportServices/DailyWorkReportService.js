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

export const getWardTripCountFromFirebase = async(year, monthName, date, wardName) => {
  try{
    const url = `https://reengus.firebaseio.com/WardTrips/${year}/${monthName}/${date}/${wardName}.json?alt=media`;

    const resp = await axios.get(url);
    const data = resp?.data;

    if (!data || typeof data !== "object") {
      return 0;
    }

    return data.filter(Boolean).length;
  }catch(erroe){
    return 0;
  }
}

export const DailyWorkReportDataFromFirebase = async(date, wards, cityId) => {
    if(!date || !wards.length) {
    return { status: 'success', data: [] };
  }

  const [year, monthNum] = date.split('-');
  const monthName = MONTH_NAMES[Number(monthNum) - 1];
    const dbResp = await sbs.getFirebase_db_url(cityId);

  if (dbResp.status !== 'success' || !dbResp.data) {
    return {
      status: 'error',
      message: 'Unable to fetch Firebase DB URL',
      data: []
    };
  }

  const dbUrl = dbResp.data;

  const requests = wards.map(async(ward)=>{
    try{
    const summaryURL = `${dbUrl}WasteCollectionInfo/${ward.wardName}/${year}/${monthName}/${date}/Summary.json?alt=media`;
    const workerURL = `${dbUrl}WasteCollectionInfo/${ward.wardName}/${year}/${monthName}/${date}/WorkerDetails.json?alt=media`;
    const [summaryResp, workerResp, tripCount] = await Promise.all([
      axios.get(summaryURL),
      axios.get(workerURL),
      getWardTripCountFromFirebase(year, monthName, date, ward.wardName)
    ]);

    const summary = summaryResp?.data;
    const workerDetails = workerResp?.data;

    if (!summary && !workerDetails && tripCount === 0) return null;

    return {
      ward_id: ward.ward_id || null,
      wardName: ward.wardName || null,
      ward_display_name: ward.ward_display_name || null,
      duty_on_time: summary ? normalizeTime(summary?.dutyInTime, "first") : null,
      duty_off_time: summary ? normalizeTime(summary.dutyOutTime, "last") : null,
      ward_reach_time: summary ? normalizeTime(summary.wardReachedOn, "first") : null,
      cityId,
      trip_count: tripCount,
      vehicle: workerDetails?.vehicle ?? null,
      driver_id: workerDetails?.driver ?? null,
      driver_name: workerDetails?.driverName ?? null,
      helper_id: workerDetails?.helper ?? null,
      helper_name: workerDetails?.helperName ?? null,
      second_helper_id: workerDetails?.secondHelper ?? null,
      second_helper_name: workerDetails?.secondHelperName ?? null,
    };
  }catch(err){
    console.error(`Firebase error for ward ${ward.wardName}`, err);
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
      ward_id: row.ward_id,
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
      second_helper_name: row.second_helper_name ?? null,
      trip_count: row.trip_count ?? null
    };

    // background upsert
    const result = sbs.saveData("DailyWorkAssignment", payload);
  }
}