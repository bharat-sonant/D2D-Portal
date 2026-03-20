import axios from "axios";

const CITY_DETAILS_URL =
  "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/CityDetails%2FCityDetails.json?alt=media";

let _cityDetailsCache = null;

/**
 * CityDetails.json se Firebase config fetch karta hai.
 * Agar city wahan nahi mili toh .env fallback use karta hai.
 */
export const getCityFirebaseConfigAsync = async (city) => {
  if (!_cityDetailsCache) {
    try {
      const res = await axios.get(CITY_DETAILS_URL);
      _cityDetailsCache = res.data || [];
    } catch {
      _cityDetailsCache = [];
    }
  }
  const normalizedCity = city?.toString()?.trim()?.toLowerCase();
  const detail = _cityDetailsCache.find(
    (item) =>
      item?.city?.toString()?.trim()?.toLowerCase() === normalizedCity ||
      item?.cityName?.toString()?.trim()?.toLowerCase() === normalizedCity
  );
  if (detail) {
    const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } = detail;
    return { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId };
  }
  return getCityFirebaseConfig(city);
};

export const cityDbConfig = {
  Reengus: process.env.REACT_APP_FIREBASE_DATABASE_URL_REENGUS,
  Ajmer: process.env.REACT_APP_FIREBASE_DATABASE_URL_AJMER,
  Bundi: process.env.REACT_APP_FIREBASE_DATABASE_URL_BUNDI,
  Sikar: process.env.REACT_APP_FIREBASE_DATABASE_URL_Sikar,
}

export const getCityFirebaseConfig = (city) => {
  if (city === "DevTest") {
    return {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEVTEST,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEVTEST,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_DEVTEST,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEVTEST,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEVTEST,
      appId: process.env.REACT_APP_FIREBASE_APP_ID_DEVTEST,
      // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_DEVTEST,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL_DEVTEST,
    };
  }
  if (city === "Sikar") {
    return {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_Sikar,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_Sikar,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_Sikar,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_Sikar,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_Sikar,
      appId: process.env.REACT_APP_FIREBASE_APP_ID_Sikar,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_Sikar,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL_Sikar,
    };
  }
  if (city === "Reengus") {
    return {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_REENGUS,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_REENGUS,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_REENGUS,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_REENGUS,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_REENGUS,
      appId: process.env.REACT_APP_FIREBASE_APP_ID_REENGUS,
      // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_DEVTEST,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL_REENGUS,
    };
  }

  const baseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  }

  const dbURL = cityDbConfig[city];
  return {
    ...baseConfig,
    databaseURL: dbURL || process.env.REACT_APP_FIREBASE_DATABASE_URL_DEVTEST,
  };
}