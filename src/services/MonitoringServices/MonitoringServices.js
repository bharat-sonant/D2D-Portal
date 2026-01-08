import dayjs from 'dayjs';
import * as sbs from '../supabaseServices';
import * as db from '../dbServices'

const year = dayjs().format('YYYY');
const month = dayjs().format('MMMM');
const date = dayjs().format('YYYY-MM-DD');

const normalize = (value = '') =>
  value.toString().replace(/_/g, ' ').trim();

const isPureNumber = (val) => /^\d+$/.test(val);
const isAlphaNumeric = (val) => /^\d+[A-Za-z0-9-]+$/.test(val);

const sortWards = (list = []) => {
  return [...list].sort((a, b) => {
    const A = normalize(a?.name);
    const B = normalize(b?.name);

    // 1️⃣ Pure numbers
    if (isPureNumber(A) && isPureNumber(B)) return Number(A) - Number(B);
    if (isPureNumber(A)) return -1;
    if (isPureNumber(B)) return 1;

    // 2️⃣ Alphanumeric (54-A)
    if (isAlphaNumeric(A) && isAlphaNumeric(B))
      return A.localeCompare(B, undefined, { numeric: true });

    if (isAlphaNumeric(A)) return -1;
    if (isAlphaNumeric(B)) return 1;

    // 3️⃣ Text
    return A.localeCompare(B, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};

export const getWardData = async(cityId) => {
   let filters ={city_Id:cityId,show_realtime:'Yes'}
  const result = await sbs.getDataByColumns('Wards',filters)
  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : 'Ward list fetched successfully',
    data : sortWards(result?.data)
  }
}

export const getDutySummary = async (ward) => {
  try{
     if (!ward?.name) {
      throw new Error("Ward name is missing");
    }
    const path = `WasteCollectionInfo/${ward?.name}/${year}/${month}/${date}`
    const response = await db.getData(path);
    
    if (!response) {
      return { success: true, data: null };
    }

    const summary = response.Summary;
    const workerDetails = response.WorkerDetails;

    const data = {
      dutyInTime : summary?.dutyInTime || null,
      dutyOutTime : summary?.dutyOutTime || null,
      wardReachedOn : summary?.wardReachedOn || null,
      driverName : workerDetails?.driverName || null,
      helperName : workerDetails?.helperName || null,
    }
    return {
      success: true,
      data,
    };
  }catch (error) {
    return { success: false, error: error.message || "Failed to fetch duty in time" };
  };
};
