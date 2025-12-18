import { decryptValue } from "../common/common";
import { supabase } from "../createClient";

export const fetchUsers = async (tableName) => {
  try {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};

export const createUser = async (tableName, tableData) => {
  try {
    const { data, error } = await supabase.from(tableName).insert([tableData]);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};

export const updateUser = async (tableName, id, payload) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(payload)
      .eq("id", id)
      .select(); // updated row data wapas laane ke liye

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};

// Delete record
export const deleteUser = async (tableName, id) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select(); // deleted row data wapas laane ke liye (optional)

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};


export const getDataByColumnName = async (table, column, columnValue) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(column, columnValue)
      .single();

    if (error || !data) throw error;

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};






















































































































export const updateUserStatus = async (userId, currentStatus) => {
  const newStatus = currentStatus === "active" ? "inactive" : "active";
  const { error } = await supabase
    .from("users")
    .update({ status: newStatus })
    .eq("id", userId);

  if (error) {
    console.error("Status update error:", error.message);
    throw error;
  }

  return newStatus;
};

export const login = async (username, password) => {
  // DB se user fetch karo
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) throw new Error("User not found");

  // status check
  if (data.status !== "active") {
    throw new Error(
      "Your account is currently inactive. Please contact the administrator."
    );
  }

  // password decrypt + verify
  const decryptedPassword = decryptValue(data.password);
  if (decryptedPassword !== password) {
    throw new Error("Incorrect password");
  }
  return data;
};

export const saveCityWithLogo = async (cityData, logoFile) => {
  let logo = null;

  if (logoFile) {
    logo = await uploadAttachment(logoFile, "CityLogo");
  }

  //2️⃣ Insert city data with logo URL
  cityData.logo_image = logo?.url || null;
  const { error } = await supabase.from("Cities").insert([cityData]);
  if (error) throw error;

  // data return nahi kar rahe
};

export const uploadAttachment = async (file, bucket) => {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const filePath = fileName;

  // Upload file to Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: false });

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
};
