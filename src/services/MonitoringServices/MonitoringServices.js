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
    const A = normalize(a?.display_name);
    const B = normalize(b?.display_name);

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