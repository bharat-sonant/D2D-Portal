import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCityFirebaseConfig } from "../configurations/cityDBConfig";
import { connectFirebase } from "../firebase/firebaseService";
import axios from "axios";

// CityDetails.json — Firebase Storage se fetch hota hai (ek baar, phir cache)
const CITY_DETAILS_URL =
  "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/CityDetails%2FCityDetails.json?alt=media";

let _cityDetailsCache = null;

const getMonitoringFirebaseConfig = async (city) => {
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
    const {
      apiKey, authDomain, databaseURL, projectId, storageBucket,
      messagingSenderId, appId, firebaseStoragePath, storageCity, latLng,
    } = detail;

    // Storage info localStorage mein save karo — getWards ke liye zaruri
    const storagePath = firebaseStoragePath ||
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/`;
    localStorage.setItem("storagePath", storagePath);
    localStorage.setItem("storageCity", storageCity || "");
    localStorage.setItem("cityLatLng", latLng || "");

    return { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId };
  }
  // Fallback to .env config
  return getCityFirebaseConfig(city);
};

const CityContext = createContext();

const DEFAULT_CITY = {
  city: localStorage.getItem("city") || "DevTest",
  cityId: localStorage.getItem("cityId") || "74",
  cityLogo: localStorage.getItem("logoUrl") || "",
}

export const CityProvider = ({ children }) => {
  const [cityState, setCityState] = useState(DEFAULT_CITY);
  const location = useLocation();

  const setCityContext = ({ city, cityId, cityLogo = "" }) => {
    if (!city || !cityId) return;
    setCityState({ city, cityId, cityLogo })
  }

  useEffect(() => {
    const { city, cityId, cityLogo } = cityState;

    localStorage.setItem("city", city);
    localStorage.setItem("cityId", cityId);
    localStorage.setItem("logoUrl", cityLogo);

    // Route: /:city/d2dMonitoring/monitoring — city URL param se dynamic Firebase
    const monitoringMatch = location.pathname.match(/^\/([^/]+)\/d2dMonitoring\/monitoring/);
    const monitoringCity = monitoringMatch?.[1];

    // Hamesha CityDetails se config fetch karo (cache hit hone par instant hai)
    // Agar city CityDetails mein nahi mili toh getCityFirebaseConfig fallback karta hai
    const targetCity = monitoringCity || city;
    getMonitoringFirebaseConfig(targetCity).then((firebaseConfig) => {
      if (firebaseConfig?.databaseURL) {
        connectFirebase(firebaseConfig, targetCity);
      }
    });

    // Update browser title
    // document.title = `D2D : ${city}`;

  }, [cityState, location.pathname]);

  return (
    <CityContext.Provider value={{
      ...cityState,
      setCityContext
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
