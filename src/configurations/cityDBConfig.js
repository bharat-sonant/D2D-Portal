export const cityDbConfig = {
  DevTest : process.env.REACT_APP_FIREBASE_DATABASE_URL_DEVTEST,
  Reengus : process.env.REACT_APP_FIREBASE_DATABASE_URL_REENGUS,
  Ajmer : process.env.REACT_APP_FIREBASE_DATABASE_URL_AJMER,
  Bundi : process.env.REACT_APP_FIREBASE_DATABASE_URL_BUNDI,
}

export const getCityFirebaseConfig = (city) => {
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