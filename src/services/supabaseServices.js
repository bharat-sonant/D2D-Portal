import { decryptValue } from "../common/common";
import { supabase } from "../createClient";


export const fetchUsers = async (table) => {
const { data, error } = await supabase
.from(table)
.select('*')
.order('created_at', { ascending: false });
if (error) throw error;
return data;
};


export const createUser = async (table,payload) => {
const { error } = await supabase.from(table).insert([payload]);
if (error) throw error;
};


export const updateUser = async (id, payload) => {
const { error } = await supabase.from('users').update(payload).eq('id', id);
if (error) throw error;
};


export const deleteUser = async (id) => {
const { error } = await supabase.from('users').delete().eq('id', id);
if (error) throw error;
};




export const updateUserStatus = async (userId, currentStatus) => {
      const newStatus = currentStatus === 'active' ? 'inactive' :'active';
  const { error } = await supabase
    .from('users')
    .update({ status: newStatus })
    .eq('id', userId);

  if (error) {
    console.error('Status update error:', error.message);
    throw error;
  }

  return newStatus;
};


export const login = async (username, password) => {
  // DB se user fetch karo
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) throw new Error('User not found');

  // status check
  if (data.status !== 'active') {
    throw new Error('Your account is currently inactive. Please contact the administrator.');
  }

  // password decrypt + verify
  const decryptedPassword = decryptValue(data.password);
  if (decryptedPassword !== password) {
    throw new Error('Incorrect password');
  }

  return data;
};


export const saveCityWithLogo = async (cityData, logoFile) => {
  let logo = null;

  if (logoFile) {
    logo = await uploadAttachment(
     logoFile,
      'CityLogo',
    );
  }

  //2️⃣ Insert city data with logo URL
    cityData.logo_image=logo?.url || null
  const { data, error } = await supabase
    .from('Cities')
    .insert([
      cityData
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};



export const uploadAttachment = async (file,bucket) => {
 
  if (!file) return null;

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const filePath = fileName;

  // Upload file to Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: false });

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
};
