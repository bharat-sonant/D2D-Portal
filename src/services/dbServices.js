import { ref, get, update, set, remove } from "firebase/database";
import { ref as refStorage, uploadBytes } from "firebase/storage";
import * as common from '../common/common'
import { getDatabaseInstance, getStorageInstance, waitForFirebaseReady } from "../firebase/firebaseService";
 
/** ✅ Ensure Firebase Ready */
const getReadyDatabase = async () => {
  await waitForFirebaseReady();
  return getDatabaseInstance();
};
 
const getReadyStorage = async () => {
  await waitForFirebaseReady();
  return getStorageInstance();
};
 
/**
 * 📸 Upload Image to Firebase Storage
 */
export const uploadImageToStorage = async (image, filePath) => {
  try {
    const storage = await getReadyStorage();
    const storageRef = refStorage(storage, filePath);
    await uploadBytes(storageRef, image);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
 
/**
 * 📦 Get Data from Firebase Database
 */
export const getData = async (path) => {
  try {
    const database = await getReadyDatabase();
    const snapshot = await get(ref(database, path));
    return snapshot.val() ?? null;
  } catch (error) {
    return null;
  }
};
 
/**
 * 💾 Update Data
 */
export const saveData = async (path, data) => {
  try {
    const database = await getReadyDatabase();
    await update(ref(database, path), data);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
 
/**
 * 🧩 Set/Replace Data
 */
export const setData = async (path, value) => {
  try {
    const database = await getReadyDatabase();
    await set(ref(database, path), value);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
 
/**
 * 🗑 Delete Data
 */
export const removeData = async (path) => {
  try {
    const database = await getReadyDatabase();
    await remove(ref(database, path));
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
 
/**
 * 🔑 Get Last Key Value
 */
export const getLastKey = async (path, val) => {
  if (!path) {
    return common.setResponse("Fail", "Invalid Params !!", { service: "getLastKey" });
  }
 
  try {
    if (val === "") {
      let lastKey = 1;
      const data = await getData(path);
 
      if (data) lastKey += Number(data);
      return lastKey;
    }
    return val;
  } catch (error) {
    return common.setResponse("Fail", error.message, { service: "getLastKey" });
  }
};
 
/**
 * 🔑 Update Last Key Value
 */
export const setLastKey = async (path, val) => {
  if (!path || val === undefined || val === null) {
    return common.setResponse("Fail", "Invalid Params !!", { service: "setLastKey" });
  }
 
  try {
    const res = await saveData(path, { value: val });
    if (res.success) return { success: true, message: "Last key updated successfully" };
    return res;
  } catch (error) {
    return { success: false, message: error.message };
  }
};