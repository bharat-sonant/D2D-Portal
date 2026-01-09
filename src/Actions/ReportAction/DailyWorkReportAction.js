import { supabase } from "../../createClient";
import { DailyWorkReportDataFromFirebase, getDailyWorkReport, getWardData, saveDailyWorkReportToSupabase } from "../../services/ReportServices/DailyWorkReportService"

export const getDailyWorkReportAction = async(date, wards, setReportData, setLoading, cityId) => {
    setLoading(true)

  try{
    let response = await getDailyWorkReport(date, cityId);

    if(response.status === 'success' && response.data.length === 0 && wards?.length > 0){
      
      response = await DailyWorkReportDataFromFirebase(date,wards,cityId)
      if(response.status === 'success' && response.data.length > 0){
        saveDailyWorkReportToSupabase(date, response.data)
      }
    }

    if(response.status === 'success' && response.data.length > 0){
      const sortedData = sortWards(response?.data, 'ward')
      setReportData(sortedData)
    }else{
      setReportData([]);
    }
  }catch(error){
    console.log(error)
    setReportData([]);
  }finally{
    setLoading(false);
  }
}
const normalize = (value = '') =>
  value.toString().replace(/[_-]/g, ' ').trim();

const startsWithNumber = (val) => /^\d/.test(val);
const isPureNumber = (val) => /^\d+$/.test(val);
const isNumericAlpha = (val) => /^\d+[A-Za-z-]+$/.test(val);

const getPriority = (rawVal = '') => {
  const val = rawVal.toString().trim();

  // 1️⃣ Starts with number
  if (startsWithNumber(val)) {
    if (isPureNumber(val)) return 1;    // 3, 11
    if (isNumericAlpha(val)) return 2;  // 54-A
    return 3;                           // 11-R2, 54-1-A
  }

  // 2️⃣ Starts with alphabet → ALWAYS plain text
  return 4;                             // A-54_ward, Ward_65, Bin Lifting
};

export const sortWards = (list = [], key = 'ward') => {
  return [...list].sort((a, b) => {
    const rawA = a?.[key];
    const rawB = b?.[key];

    const pA = getPriority(rawA);
    const pB = getPriority(rawB);

    if (pA !== pB) return pA - pB;

    // Same group → readable alphabetical order
    const A = normalize(rawA);
    const B = normalize(rawB);

    return A.localeCompare(B, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};

export const getWardDataAction = async(cityId, setWards) => {
  try{
    const result = await getWardData(cityId);

    if(result.status === "success"){
      const wardNames = result?.data.map((ward)=> ({
        wardName: ward.name,
        ward_display_name: ward.display_name, 
        ward_id: ward.id
      }));
      setWards(wardNames)
    }
  }catch(error){
    setWards([]);
  }
}
