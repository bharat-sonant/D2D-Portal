// src/utils/firebaseService.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getCityFirebaseConfig } from "../configurations/cityDBConfig";
 
let registry = new Map();
let activeKey = null;
// 🧠 Promise-based readiness system
let firebaseReadyPromise = null;
let firebaseReadyResolve = null;
let firebaseReadyLogged = false;
let waitingLogged = false;
 
const createReadyPromise = () => {
    firebaseReadyPromise = new Promise((resolve) => {
        firebaseReadyResolve = resolve;
    });
};
 
// initialize on load
createReadyPromise();
 
 
/**
 * ✅ Dynamically connect Firebase for a city or user
 * @param {object} config Firebase config from login
 * @returns {object} { success, message, data? }
 */
export const connectFirebase = (config, city) => {
    try {
        if (!config || !config.databaseURL) {
            console.log("❌ Invalid Firebase configuration");
            return { success: false, message: "Missing Firebase databaseURL in config" };
        }
 
        const key = city || config.databaseURL;
 
        // 🧹 If switching cities → clear previous connection
        if (activeKey && activeKey !== key) {
            cleanupPreviousConnection();
        }
 
        // ⚡ Reuse if already connected
        if (registry.has(key)) {
            activeKey = key;
            firebaseReadyResolve?.(); // mark ready (reuse case)
            // console.log(`⚡ Reusing Firebase connection for ${config.cityName}`);
            return {
                success: true,
                message: `Reusing Firebase connection for ${config.cityName}`,
                data: registry.get(key),
            };
        }
 
        // 🚀 Initialize Firebase dynamically
        const existingApp = getApps().find((a) => a.name === key);

        const app =
            existingApp ||
            initializeApp(
                {
                    apiKey: config.apiKey,
                    authDomain: config.authDomain,
                    databaseURL: config.databaseURL,
                    projectId: config.projectId,
                    storageBucket: config.storageBucket,
                    messagingSenderId: config.messagingSenderId,
                    appId: config.appId,
                },
                key
            );
 
        const connection = {
            app,
            cityName: city || "Unknown City",
            databaseURL: config.databaseURL,
            config,
        };
 
        registry.set(key, connection);
        activeKey = key;
        firebaseReadyResolve?.();
        console.log(`✅ Firebase connected for city: ${connection.cityName}`);
        return {
            success: true,
            message: `Firebase connected for city: ${connection.cityName}`,
            data: connection,
        };
    } catch (err) {
        console.error("❌ Firebase initialization failed:", err.message);
        return { success: false, message: `Firebase init failed: ${err.message}` };
    }
};
 
/**
 * 🔍 Checks Firebase connection; reconnects if missing or changed.
 * @param {object} config Firebase config
 * @returns {object} { success, message }
 */
export const checkFirebaseConnection = (config) => {
    try {
        if (!activeKey) {
            console.warn("⚠️ No active Firebase app, reconnecting...");
            const res = connectFirebase(config);
            return { success: res.success, message: "Reconnected Firebase (was inactive)" };
        }
 
        const current = registry.get(activeKey);
        if (!current || current.databaseURL !== config.databaseURL) {
            console.log("⚠️ Firebase config changed, reconnecting...");
            const res = connectFirebase(config);
            return { success: res.success, message: "Reconnected Firebase (config changed)" };
        }
 
        // console.log("✅ Firebase connection healthy");
        return { success: true, message: "Firebase connection healthy" };
    } catch (err) {
        console.log("❌ Firebase check failed:", err.message);
        return { success: false, message: `Connection check failed: ${err.message}` };
    }
};
 
/**
 * 📦 Returns the active Firebase Database instance.
 */
export const getDatabaseInstance = () => {
    if (!activeKey) return null;
    return getDatabase(registry.get(activeKey).app);
};
 
/**
 * 🗂 Returns the active Firebase Storage instance.
 */
export const getStorageInstance = () => {
    if (!activeKey) return null;
    return getStorage(registry.get(activeKey).app);
};
 
/**
 * 🧩 Returns current active connection
 */
export const getActiveConnection = () =>
    activeKey ? registry.get(activeKey) : null;
 
/**
 * 🧹 Removes previous Firebase app when switching cities
 */
const cleanupPreviousConnection = () => {
    if (activeKey && registry.has(activeKey)) {
        console.log(`🔁 Switching Firebase connection from: ${activeKey}`);
        registry.delete(activeKey);
        activeKey = null;
        waitingLogged = false;
        firebaseReadyLogged = false;
        createReadyPromise();
    }
};
 
/**
 * 🧠 Restore Firebase connection automatically after refresh
 * If a saved config is found in localStorage.
 */
export const restoreFirebaseConnection = () => {
    try {
        const savedConfigStr = localStorage.getItem("firebaseConfig");
        if (!savedConfigStr) {
            console.log("⚠️ No saved Firebase config found in localStorage");
            return { success: false, message: "No saved config" };
        }
 
        const savedConfig = JSON.parse(savedConfigStr);
        if (!savedConfig?.databaseURL) {
            console.log("⚠️ Firebase restore failed, removing invalid config");
            localStorage.removeItem("firebaseConfig");
            return { success: false, message: "No databaseURL in saved config" };
        }
        const key = savedConfig.cityName || savedConfig.city || savedConfig.projectId;
 
        // 🟢 Check if an app already exists before calling connectFirebase
        const existingApp = getApps().find((a) => a.name === key);
        if (existingApp) {
            // console.log(`♻️ Reusing existing Firebase connection for ${key}`);
            const connection = {
                app: existingApp,
                cityName: savedConfig.cityName || "Unknown City",
                databaseURL: savedConfig.databaseURL,
                config: savedConfig,
            };
 
            // Restore internal tracking
            registry.set(key, connection);
            activeKey = key;
            firebaseReadyResolve?.(); // Firebase already exists — immediately mark ready

            return {
                success: true,
                message: `Reused existing Firebase app for ${key}`,
                data: connection,
            };
        }
 
        // 🚀 If no existing app → initialize new one
        const result = connectFirebase(savedConfig);
        if (result.success) {
            // console.log(`🔄 Firebase connection restored and initialized for ${key}`);
            return { success: true, message: "Firebase initialized from saved config", data: result.data };
        } else {
            console.log("⚠️ Firebase restore failed, removing invalid config");
            localStorage.removeItem("firebaseConfig");
            return { success: false, message: "Failed to restore Firebase" };
        }
    } catch (err) {
        console.log("❌ Error restoring Firebase:", err.message);
        return { success: false, message: err.message };
    }
};
 
export const waitForFirebaseReady = async () => {
    if (!activeKey && !waitingLogged) {
        console.log("⏳ Waiting for Firebase to connect...");
        waitingLogged = true;
    }
    await firebaseReadyPromise;
    if (!firebaseReadyLogged) {
        console.log("✅ Firebase is ready to use.");
        firebaseReadyLogged = true;
    }
};