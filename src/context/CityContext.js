import { createContext, useContext, useEffect, useState } from "react";
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

  const setCityContext = ({ city, cityId, cityLogo = "" }) => {
    if (!city || !cityId) return;
    setCityState({ city, cityId, cityLogo })
  }

  useEffect(() => {
    const { city, cityId, cityLogo } = cityState;

    localStorage.setItem("city", city);
    localStorage.setItem("cityId", cityId);
    localStorage.setItem("logoUrl", cityLogo);

    // Initialize Firebase ONCE per city
    const firebaseConfig = getCityFirebaseConfig(city);
    connectFirebase(firebaseConfig, city);

    // Update browser title
    // document.title = `D2D : ${city}`;

  }, [cityState]);

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
