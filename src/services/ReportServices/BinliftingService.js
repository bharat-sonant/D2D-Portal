import axios from "axios";
import * as sbs from "../supabaseServices"

export const getBinliftingPlanService = async (
  cityId,
  year,
  month,
  selectedDate
) => {
  try {
      const dbResp = await sbs.getFirebase_db_url(cityId);
    
      if (dbResp.status !== 'success' || !dbResp.data) {
        return {
          status: 'error',
          message: 'Unable to fetch Firebase DB URL',
          data: []
        };
      }
    
      const dbUrl = dbResp.data;

      const completedURL = `${dbUrl}DustbinData/DustbinPickingPlanHistory/${year}/${month}/${selectedDate}.json`;
      const uncompletedURL = `${dbUrl}DustbinData/DustbinPickingPlans/${selectedDate}.json`;
      console.log('url',completedURL)

    const [compResp, uncompResp] = await Promise.all([
      axios.get(completedURL),
      axios.get(uncompletedURL),
    ]);

    const normalizeData = (resp, status) => {
      if (!resp || typeof resp !== "object") return [];

      // Case : raw firebase object
      return Object.entries(resp).map(([id, planData]) => ({
        plan_id: id,
        plan_name: planData?.planName || "",
        status, // future use (completed / pending)
      }));
    }
    const completedPlans = normalizeData(compResp?.data, "completed");
    const uncompletedPlans = normalizeData(uncompResp?.data, "pending");
    
    return {
      status : 'success',
      message : 'Binlifting data fetched successfully',
      data : [...uncompletedPlans, ...completedPlans],
    };
  } catch (error) {
     return {
      status: "error",
      message: "Failed to fetch binlifting data",
      data: [],
    };
  }
};

//save binlifting data in supabase
export const saveBinliftingData = (date, data, city_id) => {
  if(!date || !data.length) return;
  const completedPayloads = [];
  const pendingPayloads = [];

  for(const row of data){
    const payload = {
      date,
      plan_id : row?.plan_id,
      plan_name : row?.plan_name,
      city_id
    }
    if (row.status === "completed") {
      completedPayloads.push(payload);
    } else if (row.status === "pending") {
      pendingPayloads.push(payload);
    }
}
  if(completedPayloads.length){
    sbs.saveBulkData('DustbinPickingPlanHistory',completedPayloads)
  }
  if(pendingPayloads.length){
    sbs.saveBulkData('DustbinPickingPlans',pendingPayloads)
  }
}

export const getBinliftingPlanFromSupabase = async(selectedDate, cityId) => {
  try{
  const pendingResp = await sbs.getDataByColumns('DustbinPickingPlans', {
        date: selectedDate,
        city_id: cityId,
      });
  const completedResp = await sbs.getDataByColumns('DustbinPickingPlanHistory', {
        date: selectedDate,
        city_id: cityId,
      });
      let pendingPlans = [];
    let completedPlans = [];

    if (pendingResp?.success) {
      pendingPlans = pendingResp.data.map((row) => ({
        ...row,
        status: "pending",
      }));
    }

    if (completedResp?.success) {
      completedPlans = completedResp.data.map((row) => ({
        ...row,
        status: "completed",
      }));
    }

    return {
      status: "success",
      message: "Binlifting plans fetched from Supabase",
      data: [...pendingPlans, ...completedPlans],
    };
  } catch (error) {
    console.error("Supabase binlifting fetch error:", error);
    return {
      status: "error",
      message: "Failed to fetch binlifting plans from Supabase",
      data: [],
    };
  }
}
