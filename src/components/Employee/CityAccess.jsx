import { useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import employeeStyles from "../../assets/css/Employee/CityPage.module.css";
import { permissionAccessForCity } from "../../services/City/CityService";
import { setAlertMessage } from "../../common/common";

const CityAccess = (props) => {
  const [loading, setLoading] = useState(false);
  const loggedInUserId = 'Admin';

  const handleToggleAccess = async (index) => {
    const updatedCities = [...props.cityList];
    updatedCities[index].access = !updatedCities[index].access;
    props.setCityList(updatedCities);

    setLoading(true);
    try {
      const selectedCityIds = updatedCities.filter((city) => city.access).map((city) => city.id);
      const cityString = selectedCityIds.join(",");

      const res = await permissionAccessForCity(props.empCode, cityString, loggedInUserId);

      if (res?.status === "success") {
        setAlertMessage('success', `✅ Access for ${updatedCities[index].cityName} given successfully!`);
      }

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className={`${GlobalStyles.card} ${employeeStyles.cityAccessCard}`}>
      <h5 className={GlobalStyles.cardTitle}>City Access</h5>

      <div className={employeeStyles.cityList}>
        {props.cityList.map((city, index) => (
          <div key={index} className={employeeStyles.cityRow}>
            <div className={employeeStyles.cityLeft}>
              <input
                type="checkbox"
                checked={city.access}
                onChange={() => handleToggleAccess(index)}
                disabled={loading} // optional, prevent multiple clicks during save
              />
              <span className={employeeStyles.cityName}>{city.cityName}</span>
            </div>
            <div className={employeeStyles.cityRight}>
              <span>{city.access ? "Access Granted" : "No Access"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityAccess;
