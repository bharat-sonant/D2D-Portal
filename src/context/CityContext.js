import { createContext, useContext, useEffect, useState } from "react";
import { getCityFirebaseConfig } from "../configurations/cityDBConfig";
import { connectFirebase } from "../firebase/firebaseService";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(localStorage.getItem("city") || "DevTest");
  const [cityId, setCityId] = useState(localStorage.getItem("cityId") || '74');
  const [cityLogo,setCityLogo] = useState(localStorage.getItem("logoUrl") || '');
  useEffect(() => {
    // Save city globally
    if (!city) {
      setCity("DevTest");
      return;
    }
    localStorage.setItem("city", city);
    localStorage.setItem("cityId", cityId);
    localStorage.setItem("logoUrl", cityLogo);


    // Initialize Firebase ONCE per city
    const firebaseConfig = getCityFirebaseConfig(city);
    connectFirebase(firebaseConfig, city);

    // Update browser title
    document.title = `D2D : ${city}`;

  }, [city]);

  return (
    <CityContext.Provider value={{ city, cityId, setCity , setCityId,cityLogo,setCityLogo}}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
