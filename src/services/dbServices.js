import { ref, get, onValue, onChildAdded, onChildChanged, onChildRemoved, update, set, remove, push } from "firebase/database";
import { ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import * as common from '../common/common'
import { getDatabaseInstance, getStorageInstance, waitForFirebaseReady } from "../firebase/firebaseService";
import { trackCall } from "../D2DMonitoring/Services/DbServiceTracker/serviceTracker";
 
/** ✅ Ensure Firebase Ready */
const getReadyDatabase = async () => {
  await waitForFirebaseReady();
  return getDatabaseInstance();
};
 
export const getReadyStorage = async () => {
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
 * 🔗 Get Download URL from Firebase Storage
 */
export const getDownloadURLFromStorage = async (filePath) => {
  try {
    const storage = await getReadyStorage();
    const storageRef = refStorage(storage, filePath);
    const url = await getDownloadURL(storageRef);
    trackCall(filePath, "storage", url);
    return url;
  } catch (error) {
    // object-not-found is expected (e.g. 2.png when only 1 duty cycle exists) — no log needed
    if (error?.code !== "storage/object-not-found") {
      console.error("Error getting download URL:", error);
    }
    return null;
  }
};
 
/**
 * 🔔 Subscribe to realtime updates — fires instantly from cache on revisit.
 * Returns an unsubscribe function; call it in useEffect cleanup.
 */
export const subscribeData = (path, callback) => {
  let unsubscribe = () => {};
  let cancelled = false;

  getReadyDatabase().then(database => {
    if (cancelled) return;
    unsubscribe = onValue(ref(database, path), (snapshot) => {
      const val = snapshot.val() ?? null;
      trackCall(path, "subscribeData", val);
      callback(val);
    });
  }).catch(() => {});

  return () => { cancelled = true; unsubscribe(); };
};

/**
 * 🔔 Subscribe to child-added + child-changed events (incremental).
 * onChildAdded fires once per existing child on attach, then for each new child.
 * onChildChanged fires when an existing child's value changes.
 * Each event carries only that one child — never re-downloads the full list.
 * Returns an unsubscribe function; call it in useEffect cleanup.
 */
export const subscribeChildEvents = (path, onAdded, onChanged, onRemoved) => {
  const database = getDatabaseInstance();
  if (!database) return () => {};
  const nodeRef = ref(database, path);
  const unsubAdded   = onChildAdded(nodeRef,   (snap) => onAdded(snap.key, snap.val()));
  const unsubChanged = onChildChanged(nodeRef, (snap) => onChanged(snap.key, snap.val()));
  const unsubRemoved = onChildRemoved(nodeRef, (snap) => onRemoved?.(snap.key));
  return () => { unsubAdded(); unsubChanged(); unsubRemoved(); };
};

/**
 * 📦 Get Data from Firebase Database
 */
export const getData = async (path) => {
  try {
    const database = await getReadyDatabase();
    const snapshot = await get(ref(database, path));
    const val = snapshot.val() ?? null;
    trackCall(path, "getData", val);
    return val;
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

/**
 * ➕ Push new entry with auto-generated Firebase key
 * Returns { success, key } where key is the generated push ID
 */
export const pushData = async (path, data) => {
  try {
    const database = await getReadyDatabase();
    const newRef = await push(ref(database, path), data);
    trackCall(path, "pushData", data);
    return { success: true, key: newRef.key };
  } catch (error) {
    return { success: false, message: error.message };
  }
};