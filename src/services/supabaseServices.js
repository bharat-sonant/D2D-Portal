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

export const getDataByColumns = async(table, filters = {}) => {
  try{
    let query = supabase.from(table).select('*');

    Object.entries(filters).forEach(([column, value])=>{
      if (value !== undefined && value !== null) {
        query = query.eq(column, value);
      }
    })

    const {data, error} = await query;

    if(error) throw error;

    return { success: true, data: data || [] };
  }catch(err){
    return { success: false, error: err.message || err };
  }
}

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
export const login = async (email, password, setEmailError, setPasswordError) => {
  // DB se user fetch karo
  const hashCode = generateHash(email?.toLowerCase().trim());
  const { data, error } = await supabase.from("Users").select("*").eq("hash_email", hashCode).maybeSingle();
  if (error || !data) {
    setEmailError("Email not registered !")
    return null;
  };
  // status check
  if (data.status !== "active") {
    setEmailError(
      "Your account is currently inactive. Please contact the administrator."
    );
    return null;
  }

  // password decrypt + verify
  const decryptedPassword = decryptValue(data?.password);
  if (decryptedPassword !== password) {
    setPasswordError("Incorrect password");
    return null;
  }
  return data;
};

export const upsertByConflictKeys =async (tableName,Detail,conflictKeys)=>{
  await supabase
  .from(tableName)
  .upsert(
      Detail,
    { onConflict: conflictKeys }
  );
}

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


export const fetchCalenderData = async (userId, year, month) => {
  try {
    const mm = String(month + 1).padStart(2, "0");
    const startDate = `${year}-${mm}-01`;
    const endDate = `${year}-${mm}-31`; 
    const { data, error } = await supabase
      .from("UserLoginHistory")
      .select("login_date")
      .eq("user_id", userId)
      .gte("login_date", startDate)
      .lte("login_date", endDate);
    if (error) {throw error;}
    return {success: true,data: data || []};
  } catch (err) {
    console.error("fetchCalenderData error:", err);
    return {success: false,message: err.message || "Failed to fetch calendar data"};
  }
};

export const subscribeUserPermissions = ({
  userId,
  setPermissionGranted
}) => {
  const channel = supabase
    .channel(`user-permissions-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "UserPortalAccess",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const { access_page, access_control } = payload.new || {};
        if (!access_page) return;
        setPermissionGranted((prev) => ({
          ...prev,
          [access_page]: access_control,
        }));
      }
    )
    .subscribe((status) => {
      console.log("📡 Realtime status:", status);
    });

  return channel;
};



export const storageUrl = `https://tayzauotsjxdgvfadcby.supabase.co/storage/v1/object/public`
