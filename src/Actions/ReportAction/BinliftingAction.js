import {getBinliftingPlanFromSupabase,getBinliftingPlanService,saveBinliftingData} from "../../services/ReportServices/BinliftingService";
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

export const sortPlanNames = (list = [], key = 'plan_name') => {
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


export const getBinliftingData = async (
  cityId,
  year,
  month,
  selectedDate,
  setBinliftingData,
  setLoading
) => {
  setLoading(true);
  try {
    // 1️⃣ Try Supabase first
    const supabaseResponse =
      await getBinliftingPlanFromSupabase(selectedDate, cityId);

    console.log("supabase", supabaseResponse);

    if (
      supabaseResponse?.status === "success" &&
      supabaseResponse?.data?.length > 0
    ) {
       const sortedData = sortPlanNames(
        supabaseResponse.data,
        "plan_name"
      );
      // ✅ Supabase has data
      setBinliftingData(sortedData);
      return;
    }

    // 2️⃣ Supabase empty → fetch from Firebase
    const firebaseResponse =
      await getBinliftingPlanService(cityId,year, month, selectedDate);

    console.log("firebase", firebaseResponse);

    if (
      firebaseResponse?.status === "success" &&
      firebaseResponse?.data?.length > 0
    ) {
      // Save into Supabase for future
      // await saveBinliftingData(
      //   selectedDate,
      //   firebaseResponse.data,
      //   cityId
      // );

      const sortedData = sortPlanNames(
        firebaseResponse.data,
        "plan_name"
      );
      // Set UI data
      setBinliftingData(sortedData);
    } else {
      // No data anywhere
      setBinliftingData([]);
    }
  } catch (error) {
    console.error("Binlifting data fetch error:", error);
    setBinliftingData([]);
  }finally{
    setLoading(false);
  }
};
