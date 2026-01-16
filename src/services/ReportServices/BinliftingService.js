import axios from "axios";
import * as sbs from "../supabaseServices"
import { supabase } from "../../createClient";
import dayjs from "dayjs";



const dustbinAssignmentData = async (dbUrl, year, month, selectedDate) => {
try{
    const assignmentUrl = `${dbUrl}DustbinData/DustbinAssignment/${year}/${month}/${selectedDate}.json`;
  const result = await axios.get(assignmentUrl)
  
  if(result.status === 200) {
    return Object.values(result.data).reduce((acc, item) => {
      if (item?.planId) {
        acc[item.planId] = {
          vehicle: item.vehicle || null,
          driverId: item.driver || null,
          helperId: item.helper || null,
        };
      }
      return acc;
    }, {});
  }else{
    return {};
  }
}catch(error){
  return {};
}
}

export const getEmployeesName = async(dbUrl, employeeIds) => {
    if (!employeeIds.length) return {};

  try{
    const uniqueIds = [...new Set(employeeIds)];
   
    const requests = uniqueIds.map(id =>
      axios.get(`${dbUrl}Employees/${id}/GeneralDetails/name.json`)
        .then(res => ({ id, name: res.data || null }))
        .catch(() => ({ id, name: null }))
    );

    const responses = await Promise.all(requests);

    return responses.reduce((acc, { id, name }) => {
      acc[id] = name;
      return acc;
    }, {});
  }catch(error){

  }

}

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

    const [compResp, uncompResp, assingmentResp] = await Promise.all([
      axios.get(completedURL),
      axios.get(uncompletedURL),
      dustbinAssignmentData(dbUrl, year, month, selectedDate)
    ]);


    const normalizeData = (resp, status) => {
      if (!resp || typeof resp !== "object") return [];

      // Case : raw firebase object
      return Object.entries(resp)
        .filter(([_, planData]) => {
          // ❌ exclude if planName missing / empty
          const name = planData?.planName;
          return name && name.toString().trim().length > 0;
        })
        .map(([id, planData]) => {
          const assignment = assingmentResp[id] || {};
         return {
           plan_id: id,
          plan_name: planData.planName.trim(),
          status,
          bin_count : planData?.totalDustbin,
          vehicle : assignment?.vehicle ?? null,
          driver_id: assignment.driverId ?? null,
          helper_id: assignment.helperId ?? null,
         }
        });
    };
    const plans = [
      ...normalizeData(uncompResp?.data, "pending"),
      ...normalizeData(compResp?.data, "completed"),
    ];

    const employeeIds = plans.flatMap(p =>
      [p.driver_id, p.helper_id].filter(Boolean)
    );

    const employeeNameMap = await getEmployeesName(dbUrl, employeeIds);
    const driverIds = plans
    .map(p => p.driver_id)
    .filter(Boolean);

    // const inOutTimeMap = await getInOutTimeFromFirebase(
    //   dbUrl,
    //   year,
    //   month,
    //   selectedDate,
    //   driverIds
    // );
    let inOutTimeMap;
    const finalPlans = plans.map(p => {
      const timeInfo = inOutTimeMap[p.plan_id] || {};
      return{
      ...p,
      driver_name: employeeNameMap[p.driver_id] ?? null,
      helper_name: employeeNameMap[p.helper_id] ?? null,
      in_time: timeInfo.in_time ?? null,
      out_time: timeInfo.out_time ?? null,
      }
    });
    
    return {
      status : 'success',
      message : 'Binlifting data fetched successfully',
      data : finalPlans,
    };
  } catch (error) {
     return {
      status: "error",
      message: "Failed to fetch binlifting data",
      data: [],
    };
  }
};

// save binlifting data in supabase (BACKGROUND)
export const saveBinliftingData = (date, data, city_id) => {
  if (!date || !data.length) return;

  // 🔥 fire-and-forget async wrapper
  (async () => {
    try {
      const todayDate = dayjs().format("YYYY-MM-DD");
      const isToday = date === todayDate;

      // 1️⃣ DELETE only for today
      if (isToday) {
        await supabase
          .from("DustbinPickingPlans")
          .delete()
          .eq("date", date)
          .eq("city_id", city_id);

        await supabase
          .from("DustbinPickingPlanHistory")
          .delete()
          .eq("date", date)
          .eq("city_id", city_id);
      }

      const pendingPayloads = [];
      const completedPayloads = [];

      for (const row of data) {
        const payload = {
          date,
          plan_id: row.plan_id,
          plan_name: row.plan_name,
          city_id,
        };

        if (row.status === "pending") {
          pendingPayloads.push(payload);
        }

        if (row.status === "completed") {
          completedPayloads.push(payload);
        }
      }

      // 2️⃣ INSERT fresh data
      if (pendingPayloads.length) {
        await sbs.saveBulkData(
          "DustbinPickingPlans",
          pendingPayloads
        );
      }

      if (completedPayloads.length) {
        await sbs.saveBulkData(
          "DustbinPickingPlanHistory",
          completedPayloads
        );
      }
    } catch (err) {
      console.error("Background binlifting supabase sync failed:", err);
    }
  })();
};

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
