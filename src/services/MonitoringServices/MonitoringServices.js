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
  const result = await sbs.getDataByColumnName('Wards', 'city_Id', cityId)
  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : 'Ward list fetched successfully',
    data : sortWards(result?.data)
  }
}

export const getDutyInTime = async (ward) => {
  try{
     if (!ward?.name) {
      throw new Error("Ward name is missing");
    }
    const path = `WasteCollectionInfo/${ward?.name}/${year}/${month}/${date}/Summary/dutyInTime`
    const response = await db.getData(path);
    
    return {
      success: true,
      data: response ?? null,
    };
  }catch (error) {
    return { success: false, error: error.message || "Failed to fetch duty in time" };
  };
};
