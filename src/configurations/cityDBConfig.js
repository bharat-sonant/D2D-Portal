export const cityDbConfig = {
  Reengus : process.env.REACT_APP_FIREBASE_DATABASE_URL_REENGUS,
  Ajmer : process.env.REACT_APP_FIREBASE_DATABASE_URL_AJMER,
  Bundi : process.env.REACT_APP_FIREBASE_DATABASE_URL_BUNDI,
}

export const getCityFirebaseConfig = (city) => {
  // ✅ If DevTest, use its own config entirely
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
  if (city === "Reengus"){
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