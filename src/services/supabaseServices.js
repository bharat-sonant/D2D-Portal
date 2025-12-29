import { decryptValue, generateHash } from "../common/common";
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
    const { data, error } = await supabase.from(tableName).insert([tableData]).select().single();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {

    return { success: false, error: err };
  }
};

export const updateData = async (tableName, key, id, columnData) => {
  try {
    const { data, error } = await supabase.from(tableName).update(columnData).eq(key, id).select().single();
    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err, err };
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
      
    if (error || !data) throw error;

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};

export const checkDuplicayInDb = async (cityId,wardName,wardId) => {
  let query = supabase.from('Wards').select('id').eq('city_Id', cityId).ilike('name', wardName);
  if (wardId) {
    query = query.neq('id', wardId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Duplicate check failed:', error);
    throw error;
  }
  return data.length > 0;
};
export const login = async (email, password) => {
  // DB se user fetch karo
  const hashCode = generateHash(email?.toLowerCase().trim());
  const { data, error } = await supabase.from("Users").select("*").eq("hashCode", hashCode).maybeSingle();
  if (error || !data) throw new Error("User not found");
  // status check
  if (data.status !== "active") {
    throw new Error(
      "Your account is currently inactive. Please contact the administrator."
    );
  }

  // password decrypt + verify
  const decryptedPassword = decryptValue(data?.password);
  if (decryptedPassword !== password) {
    throw new Error("Incorrect password");
  }
  return data;
};

export const uploadAttachment = async (file, bucket,filePath) => {
  if (!file) return null;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return {
    url: data.publicUrl,
    path: filePath,
  };
};


export const storageUrl = `https://tayzauotsjxdgvfadcby.supabase.co/storage/v1/object/public`
