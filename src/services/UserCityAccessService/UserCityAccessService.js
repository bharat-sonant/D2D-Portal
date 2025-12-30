import { supabase } from "../../createClient";
import * as sbs from "../supabaseServices";

export const getUsersByCity = async (cityId) => {
  if (!cityId) {
    return { status: "error", message: "City id is required" };
  }
  const accessResult = await sbs.getDataByColumnName(
    "UserCityAccess",
    "city_id",
    cityId
  );

  if (!accessResult.success) {
    return { status: "error", message: accessResult.error };
  }
  const userIds = (accessResult.data || []).map(row => row.user_id);
  if (userIds.length === 0) {
    return { status: "success", data: [] };
  }

  // Use raw supabase client to handle "IN" query which sbs.getDataByColumnName doesn't support
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .in("id", userIds);

  if (!error) {
    return {
      status: "success",
      message: "Users fetched successfully",
      data: data || [],
    };
  } else {
    return { status: "error", message: error.message || error };
  }
};
