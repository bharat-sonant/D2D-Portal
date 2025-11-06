// firebasePrimary.js
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase ,ref,set} from "firebase/database";
import { getCityFirebaseConfig } from "../configurations/cityDBConfig";

let app = null;
let database = null;
let storage = null;

export const initFirebase = async(cityParam) => {
  const city = cityParam || localStorage.getItem("city") || "DevTest";
  console.log("🚀 Initializing Firebase for city:", city);

  const firebaseConfig = getCityFirebaseConfig(city);

   // 🔥 Destroy old app instance if exists
  if (getApps().length > 0) {
    console.log("🧹 Cleaning up old Firebase app...");
    await deleteApp(getApp());
  }

  // ✅ Fresh initialization for the new city
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  storage = getStorage(app);

  const testRef = ref(database, "connectionTest");
  set(testRef, {
    status: "connected",
    city,
    timestamp: new Date().toISOString(),
  })
    .then(() => console.log(`✅ Firebase connected successfully for ${city}`))
    .catch((err) => console.error(`❌ Firebase connection failed for ${city}:`, err));

  return { app, database, storage };
}

export const getDatabaseInstance = () => {
  if (!database) throw new Error("⚠️ Firebase not initialized! Call initFirebase(city) first.");
  return database;
};

export const getStorageInstance = () => {
  if (!storage) throw new Error("⚠️ Firebase not initialized! Call initFirebase(city) first.");
  return storage;
};

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            // const messaging = getMessaging();

            // const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

            // const token = await getToken(messaging, {
            //     vapidKey: 'BFj6KMrHQ6X_-7-c8SibdnXLkxJAJ8Nsk2cB0krDzUxzRmzqAJIIF8BDowCdeJYsVgYi3FPz-5b22XZetMzTsNg',
            //     serviceWorkerRegistration: swRegistration,
            // });
            // return token;
        }
        else {
            return null;
        }
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             console.log('db',payload)
//             resolve(payload);
//         });
//     });