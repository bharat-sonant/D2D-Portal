import * as sbs from '../supabaseServices';
import axios from 'axios';
import dayjs from "dayjs";

export const getWardDailySummary = async (wardList, date, cityId) => {
  try {

    if (!validateInput(wardList, date, cityId)) {
      return { status: "error", message: "Invalid parameters" };
    }

    const today = dayjs().format("YYYY-MM-DD");
    const isToday = date === today;

    let cachedData = [];
    let wardsToFetch = wardList;

    if (!isToday) {
      cachedData = await getCachedSummaries(date);
      wardsToFetch = getMissingWards(wardList, cachedData);
      if (!wardsToFetch.length) {
        return {status: "success",source: "supabase",data: cachedData};
      }
    }

    const firebaseUrlResp = await sbs.getFirebase_db_url(cityId);
    if (!firebaseUrlResp?.status) {
      return { status: "error", message: "Firebase URL not found" };
    }

    const firebaseData = await fetchSummariesFromFirebase(wardsToFetch,date,firebaseUrlResp?.data);
    let savedSummary = await saveSummariesBulk(firebaseData);
    const map = new Map();
    [...cachedData, ...(savedSummary?.data || [])].forEach(row => { map.set(row.ward_id, row)});
    const final = Array.from(map.values());
    return {...savedSummary,data:final};

  } catch (error) {
    console.error("getWardDailySummary error:", error);
    return { status: "error", message: "Internal server error" };
  }
};
const saveSummariesBulk = async (payloadArray) => {
  if (!payloadArray.length) return {success:true,data:[]};
  const resp = await sbs.upsertBulkData("WardDailySummary", payloadArray,"ward_id,date");
  return resp;
};

const fetchSummariesFromFirebase = async (wards, date, firebaseBaseUrl) => {
  const year = dayjs(date).year();
  const monthName = dayjs(date).format("MMMM");

  const promises = wards.map(async (ward) => {
    try {
      const url = `${firebaseBaseUrl}WasteCollectionInfo/${ward?.name}/${year}/${monthName}/${date}/Summary.json?alt=media`;
      const resp = await axios.get(url);

      if (!resp?.data) return null;

      const {
        workPercentage = 0,
        completedLines = 0,
        skippedLines = 0,
        dutyInTime = "",
        dutyOutTime = "",
        wardReachedOn = "",
        trip = 0,
        vehicleCurrentLocation = "",
        wardCoveredDistance = 0,
      } = resp.data;

      return {
        ward_id: ward.id,
        date,
        work_percentage: workPercentage,
        completed_lines: completedLines,
        skipped_lines: skippedLines,
        duty_in_time: dutyInTime,
        duty_out_time: dutyOutTime,
        ward_reach_time: wardReachedOn,
        trip_count: trip,
        vehicle_current_status: vehicleCurrentLocation,
        ward_covered_distance: wardCoveredDistance,
      };

    } catch (err) {
      console.error(`Firebase fetch failed for ${ward.name}`, err.message);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

const getMissingWards = (wardList, cachedData) => {
  const cachedWardIds = cachedData.map(d => d?.ward_id);
  return wardList.filter(w => !cachedWardIds.includes(w?.id));
};

const getCachedSummaries = async (date) => {
  const result = await sbs.getDataByColumns("WardDailySummary", { date });
  if (result.success) {
    return result.data || [];
  }
  return [];
};
const validateInput = (wardList, date, cityId) => {
  if (!wardList?.length || !date || !cityId) {
    return false;
  }
  return true;
};



