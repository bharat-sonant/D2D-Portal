// firebasePrimary.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase ,ref,set} from "firebase/database";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

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