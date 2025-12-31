// firebasePrimary.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase ,ref,set} from "firebase/database";
import { getCityFirebaseConfig } from "../configurations/cityDBConfig";

let city = localStorage.getItem("city");

if (!city || city.trim() === "" || city.trim() === "N/A") {
  city = "DevTest";
  console.warn("⚠️ No city found in localStorage, falling back to DevTest");
}


const firebaseConfig = getCityFirebaseConfig(city);
console.log('fir',firebaseConfig)
// Prevent duplicate default app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);
export const database = getDatabase(app);

const testRef = ref(database, "connectionTest");
set(testRef, {
  status: "connected",
  timestamp: new Date().toISOString(),
})
  .then(() => console.log("✅ Firebase connected successfully"))
  .catch((err) => console.error("❌ Firebase connection failed:", err));

// export const messaging = getMessaging(app);

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