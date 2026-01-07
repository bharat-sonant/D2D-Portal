import { useEffect, useMemo, useState } from "react";
import styles from "./DefaultCitySelection.module.css";
import modalStyles from "../../assets/css/popup.module.css";
import { MapPin, X, Check, Search } from "lucide-react";
import cityNotFound from "../../assets/images/icons/cityNotFound.gif"
import { getAvailableCityList } from "../../Actions/commonActions";
import { useCity } from "../../context/CityContext";
import { changeDefaultCityAction } from "../../Actions/DefaultCitySelection/defaultCitySelectionAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import { getCityFirebaseConfig } from "../../services/CityService/firebaseConfigService";
import NoResult from "../NoResultFound/NoResult";

const DefaultCitySelection = ({ onClose }) => {
  let defaultCityExist = JSON.parse(localStorage.getItem("defaultCity"))
    ? true
    : false;
  const { city, setCityContext } = useCity();
  const [selectedCity, setSelectedCity] = useState(null);
  const [setDefault, setSetDefault] = useState(!defaultCityExist);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const userId = localStorage.getItem("userId");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getAvailableCityList(setCityList, "active", setLoading, userId);
  }, []);

  const handleSubmit = async (city) => {
    if (saving) return;
    setSaving(true);

    try {
      const res = await getCityFirebaseConfig(city?.city_id);
      console.log("🔥 Firebase Config (Default City):", res?.data);
      await changeDefaultCityAction(city, setDefault, setCityContext, onClose);
    } catch (err) {
      console.error("Error fetching firebase config:", err);
    } finally {
      setSaving(false);
    }
  };

  useMemo(() => {
    if (cityList?.length > 0 && city) {
      let detail = cityList.find((item) => item?.city_name === city);
      setSelectedCity(detail);
    }
  }, [cityList, city]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cityList;

    return cityList.filter((c) =>
      c.city_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cityList, searchQuery]);
  return (
    <>
      <div className={modalStyles.overlay} aria-modal="true" role="dialog">
        <div className={`${modalStyles.modal} ${styles.modal}`}>
          {/* Header */}
          <div className={modalStyles.modalHeader}>
            <div className={modalStyles.headerLeft}>
              <div className={modalStyles.iconWrapper}>
                <MapPin className="map-icon" />
              </div>
              <div>
                <h2 className={modalStyles.modalTitle}>
                  {defaultCityExist ? "Select City" : "Set your default city"}
                </h2>
                <p className={modalStyles.modalSubtitle}>
                  Choose your preferred city location
                </p>
              </div>
            </div>
            <button className={modalStyles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          {/* Search Bar */}
          <div className={modalStyles.searchSection}>
            <div className={modalStyles.searchWrapper}>
              <Search size={18} className={modalStyles.searchIcon} />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={modalStyles.searchInput}
              />
            </div>
          </div>

          {/* Body */}
          <div className={`${modalStyles.modalBody} ${styles.modalBody}`}>
            {loading ? (
              <WevoisLoader title={"loading cities"} height="250px" />
            ) : filteredCities.length === 0 ? (
              <NoResult
                title="No Cities Found"
                query={searchQuery}
                gif={cityNotFound}
              />
            ) : (
              <div className={styles.cityRow}>
                {filteredCities.map((city) => (
                  <div
                    key={city.city_id}
                    className={`${styles.cityCard} ${
                      selectedCity?.city_id === city?.city_id
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => setSelectedCity(city)}
                  >
                    <div className={styles.logoWrapper}>
                      <img
                        src={city?.logoUrl}
                        alt={city.city_name}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>

                    <div className={styles.cityName}>{city.city_name}</div>

                    {selectedCity?.city_id === city?.city_id && (
                      <div
                        className={styles.checkMark}
                        style={{ "--bg-color": city.color }}
                      >
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={modalStyles.modalFooter}>
            {defaultCityExist ? (
              <button
                className={`${modalStyles.submitBtn} ${styles.submitBtn}`}
                disabled={!selectedCity || saving}
                onClick={async () => {
                  try {
                    const res = await getCityFirebaseConfig(
                      selectedCity?.city_id
                    );
                    console.log("🔥 Firebase Config (Change City):", res?.data);
                    setCityContext({
                      city: selectedCity?.city_name,
                      cityId: selectedCity?.city_id,
                      cityLogo: selectedCity?.logoUrl,
                    });

                    onClose();
                  } catch (err) {
                    console.error("Error fetching firebase config:", err);
                  }
                }}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <Check size={18} style={{ marginRight: "6px" }} />
                    Change City
                  </>
                )}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!selectedCity || saving}
                onClick={() => handleSubmit(selectedCity)}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  `Set`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultCitySelection;
