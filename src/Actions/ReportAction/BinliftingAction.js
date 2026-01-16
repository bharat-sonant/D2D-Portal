import {getBinliftingPlanFromSupabase,getBinliftingPlanService,saveBinliftingData} from "../../services/ReportServices/BinliftingService";

export const getBinliftingData = async (
  cityId,
  year,
  month,
  selectedDate,
  setBinliftingData,
  setLoading
) => {
  console.log('cityid',cityId)
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
      // ✅ Supabase has data
      setBinliftingData(supabaseResponse.data);
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

      // Set UI data
      setBinliftingData(firebaseResponse.data);
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
