import * as db from "../dbServices";

export const getBinliftingPlanService = async (
  year,
  month,
  selectedDate
) => {
  try {
    const completedPath = `DustbinData/DustbinPickingPlanHistory/${year}/${month}/${selectedDate}`;
    const uncompletedPath = `DustbinData/DustbinPickingPlans/${selectedDate}`;

    const [compResp, uncompResp] = await Promise.all([
      db.getData(completedPath),
      db.getData(uncompletedPath),
    ]);

    const normalizeData = (resp, status) => {
      if (!resp) return [];

      // Case : raw firebase object
      if (typeof resp === "object") {
        return Object.entries(resp).map(([id, planData]) => ({
          id,
          status,
          ...planData,
        }));
      }

      return [];
    };

    const completedPlans = normalizeData(compResp, "completed");
    const uncompletedPlans = normalizeData(uncompResp, "pending");
    
    const mergerdData = [...uncompletedPlans, ...completedPlans];
    return {
      status : 'success',
      message : 'Binlifting data fetched successfully',
      data : mergerdData
    };
  } catch (error) {
    console.error("Binlifting service error:", error);
    return [];
  }
};
