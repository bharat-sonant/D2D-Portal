import { decryptValue } from "../common/common";
import { supabase } from "../createClient";


export const fetchUsers = async () => {
const { data, error } = await supabase
.from('users')
.select('*')
.order('created_at', { ascending: false });
if (error) throw error;
return data;
};


export const createUser = async (payload) => {
const { error } = await supabase.from('users').insert([payload]);
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
