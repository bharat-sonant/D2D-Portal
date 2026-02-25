import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCityFirebaseConfig } from "../configurations/cityDBConfig";
import { connectFirebase } from "../firebase/firebaseService";

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
    const isMonitoringRoute = location.pathname === "/d2dMonitoring/monitoring"
    const firebaseCity = isMonitoringRoute ? "Sikar" : city;

    localStorage.setItem("city", city);
    localStorage.setItem("cityId", cityId);
    localStorage.setItem("logoUrl", cityLogo);

    // Keep Monitoring page pinned to Sikar Firebase.
    const firebaseConfig = getCityFirebaseConfig(firebaseCity);
    connectFirebase(firebaseConfig, firebaseCity);

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
