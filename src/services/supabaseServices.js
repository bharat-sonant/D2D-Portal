import { decryptValue } from "../common/common";
import { supabase } from "../createClient";

export const getData = async (tableName) => {
  try {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};

export const saveData = async (tableName, tableData) => {
  try {
    const { data, error } = await supabase.from(tableName).insert([tableData]);
    if (error) throw error;
    return { success: true, data };
  } catch (err) {

    return { success: false, error: err};
  }
};

export const updateData = async (tableName, id,columnData) => {
  try {
    const { data, error } = await supabase.from(tableName).update(columnData).eq("id", id)
    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err,err };
  }
};

export const deleteData = async (tableName, id) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select();

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

export const login = async (username, password) => {
  // DB se user fetch karo
  const { data, error } = await supabase.from("users").select("*").eq("username", username).single();

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

export const uploadAttachment = async (file, bucket) => {
  if (!file) return null;

  const ext = file?.name?.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const filePath = fileName;

  // Upload file to Supabase Storage
  const { error } = await supabase.storage.from(bucket) .upload(filePath, file, { upsert: false });
  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
};
