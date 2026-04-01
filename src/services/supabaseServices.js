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

export const saveBulkData = async (tableName, tableDataArray) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(tableDataArray)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Bulk insert error:", err);
    return { success: false, error: err };
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

// Sirf check karo ki row exist karta hai ya nahi — koi data transfer nahi (HEAD request)
export const checkExists = async (table, filters = {}) => {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    Object.entries(filters).forEach(([column, value]) => {
      if (value !== undefined && value !== null) query = query.eq(column, value);
    });
    const { count, error } = await query;
    if (error) throw error;
    return { success: true, exists: count > 0, count: count ?? 0 };
  } catch (err) {
    return { success: false, exists: false, count: 0, error: err.message || err };
  }
};

// Sirf specific columns fetch karo (e.g. 'id' for upsert lookups)
export const getDataByColumnsSelect = async (table, filters = {}, select = '*') => {
  try {
    let query = supabase.from(table).select(select);
    Object.entries(filters).forEach(([column, value]) => {
      if (value !== undefined && value !== null) query = query.eq(column, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: data || [] };
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


export const upsertByConflictKeys = async (tableName,data,conflictKeys) => {
  if (!tableName || !data || !conflictKeys) {
    return {
      success: false,
      message: "Missing required parameters",
    };
  }

  const { data: result, error } = await supabase
    .from(tableName)
    .upsert(data, {
      onConflict: conflictKeys,
      ignoreDuplicates: false,
    }).select()
    .single();

  if (error) {
    console.error("Upsert failed:", error);
    return {
      success: false,
      message: error.message || "Upsert failed",
    };
  }

  return {
    success: true,
    data: result,
  };
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

/**
 * City-wise Supabase bucket mein file upload karta hai.
 * Bucket exist na kare to automatically create karta hai.
 * Bucket name: city ka naam lowercase mein (e.g. "sikar", "ajmer", "bharatpur")
 * @param {File}   file      - upload karne wali file
 * @param {string} cityName  - city ka naam (e.g. "Sikar", "Ajmer")
 * @param {string} filePath  - bucket ke andar file ka path (e.g. "WardBoundaries/ward_1/2025-01-01")
 * @returns {{ success: bool, url: string, path: string, bucketName: string }}
 */
export const uploadAttachmentCityWise = async (file, cityName, filePath) => {
  if (!file || !cityName || !filePath) {
    return { success: false, error: "file, cityName aur filePath required hain" };
  }

  const bucketName = String(cityName).toLowerCase().trim();

  // Bucket exist karta hai ya nahi check karo
  const { data: existing } = await supabase.storage.getBucket(bucketName);

  if (!existing) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['application/json', 'image/*'],
      fileSizeLimit: 10485760, // 10 MB
    });
    if (createError) {
      return { success: false, error: createError.message, bucketName, cityName };
    }
  }

  // File upload karo
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { success: false, error: uploadError.message, bucketName };
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return { success: true, url: data.publicUrl, path: filePath, bucketName };
};

/**
 * Employee ki profile image city-wise bucket mein upload karta hai.
 * Path: ${cityName}/EmployeeImages/${employeeId}/profileImage.jpg
 * @param {File}   imageFile  - image file
 * @param {string} cityName   - city ka naam (e.g. "Sikar")
 * @param {string} employeeId - employee ka unique ID
 * @returns {{ success: bool, url: string, path: string, bucketName: string }}
 */
export const uploadEmployeeProfileImage = async (imageFile, cityName, employeeId) => {
  if (!imageFile || !cityName || !employeeId) {
    return { success: false, error: "imageFile, cityName aur employeeId required hain" };
  }

  const filePath = `EmployeeImages/${employeeId}/profileImage.jpg`;
  return uploadAttachmentCityWise(imageFile, cityName, filePath);
};

/**
 * Check karta hai ki employee ki profile image Supabase mein already exist karti hai ya nahi.
 * @param {string} cityName   - city ka naam (e.g. "Sikar")
 * @param {string} employeeId - employee ka unique ID
 * @returns {{ exists: bool, url: string|null }}
 */
export const checkEmployeeImageExists = async (cityName, employeeId) => {
  if (!cityName || !employeeId) return { exists: false, url: null };

  const bucketName = String(cityName).toLowerCase().trim();
  const filePath = `EmployeeImages/${employeeId}/profileImage.jpg`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(`EmployeeImages/${employeeId}`);

  if (error || !data || data.length === 0) return { exists: false, url: null };

  const found = data.some(f => f.name === 'profileImage.jpg');
  if (!found) return { exists: false, url: null };

  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return { exists: true, url: urlData.publicUrl };
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
    .subscribe(() => {});

  return channel;
};

export const getFirebase_db_url = async(city_id) => {
  const result = await getDataByColumnName('Sites','site_id',city_id);
  if(!result.success){
    return {status : 'error', message : result?.error}
  }
  
  return {
    status: 'success',
    data: result.data[0].firebase_db_path
  };
}

export const getLatestDate = async (wardId) => {
  try {
    const { data, error } = await supabase
      .from('WardsBoundaries')
      .select('boundary_updated_at')
      .eq('ward_id', wardId)
      .order('boundary_updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(); 

    if (error) throw error;

    return {
      success: true,
      data: data ? data.boundary_updated_at : null
    };

  } catch (err) {
    console.error('getLatestDate error:', err.message);

    return {
      success: false,
      data: null,
      error: err.message
    };
  }
};

export const getGeoJsonFromStorage = async (filePath) => {

  const cleanPath = filePath.trim(); // 🔥 IMPORTANT

  const { data } = supabase.storage
    .from("WardMaps")
    .getPublicUrl(cleanPath);

  const res = await fetch(data.publicUrl);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch GeoJSON: ${res.status}`);
  }

  return await res.json();
};
export const upsertBulkData = async (tableName, dataArray, conflictKeys) => {
  if (!tableName || !dataArray?.length || !conflictKeys) {
    return {
      success: false,
      message: "Missing required parameters",
    };
  }

  const { data, error } = await supabase
    .from(tableName)
    .upsert(dataArray, {
      onConflict: conflictKeys,
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    console.error("Bulk upsert failed:", error);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data,
  };
};





export const storageUrl = `https://tayzauotsjxdgvfadcby.supabase.co/storage/v1/object/public`

/**
 * MonitoringEmployees table se multiple employees ek hi query mein fetch karo.
 * Returns a Map: String(id) → row
 */
export const getMonitoringEmployeesBatch = async (employeeIds) => {
  if (!employeeIds?.length) return new Map();
  const ids = employeeIds.map(id => Number(id)).filter(Number.isFinite);
  if (!ids.length) return new Map();
  try {
    const { data, error } = await supabase
      .from('MonitoringEmployees')
      .select('*')
      .in('id', ids);
    if (error) throw error;
    return new Map((data || []).map(e => [String(e.id), e]));
  } catch {
    return new Map();
  }
};

/**
 * MonitoringEmployees table se employee data fetch karo by Firebase employee ID.
 */
export const getMonitoringEmployee = async (employeeId) => {
  try {
    const { data, error } = await supabase
      .from('MonitoringEmployees')
      .select('*')
      .eq('id', Number(employeeId))
      .maybeSingle();
    if (error) throw error;
    return { success: true, data: data || null };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * MonitoringEmployees table mein employee data upsert karo (id = Firebase employee ID).
 */
export const upsertMonitoringEmployee = async (employeeId, payload) => {
  try {
    const { data, error } = await supabase
      .from('MonitoringEmployees')
      .upsert({ id: Number(employeeId), ...payload }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Check if driver and helper data exists in Employees table for a given ward's assignment.
 * @param {string} driverId  - driver_id from ward assignment
 * @param {string} helperId  - helper_id from ward assignment
 * @returns {{ driverExists: bool, helperExists: bool, missingIds: string[] }}
 */
export const checkWardEmployeesExist = async (driverId, helperId) => {
  try {
    const idsToCheck = [driverId, helperId].filter(Boolean);

    if (idsToCheck.length === 0) {
      return { success: true, driverExists: false, helperExists: false, missingIds: [] };
    }

    const { data, error } = await supabase
      .from('Employees')
      .select('id')
      .in('id', idsToCheck);

    if (error) throw error;

    const foundIds = new Set((data || []).map(emp => emp.id));
    const driverExists = driverId ? foundIds.has(driverId) : null;
    const helperExists = helperId ? foundIds.has(helperId) : null;

    const missingIds = idsToCheck.filter(id => !foundIds.has(id));

    return { success: true, driverExists, helperExists, missingIds };
  } catch (err) {
    return { success: false, error: err.message || err };
  }
};
