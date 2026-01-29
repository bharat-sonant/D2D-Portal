import { useEffect, useMemo, useState } from "react";
import styles from "./DefaultCitySelection.module.css";
import modalStyles from "../../assets/css/popup.module.css";
import { MapPin, X, Check, Search } from "lucide-react";
import cityNotFound from "../../assets/images/icons/cityNotFound.gif";
import { getAvailableCityList } from "../../Actions/commonActions";
import { useCity } from "../../context/CityContext";
import { changeDefaultCityAction } from "../../Actions/DefaultCitySelection/defaultCitySelectionAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import { getCityFirebaseConfig } from "../../services/CityService/firebaseConfigService";
import NoResult from "../NoResultFound/NoResult";
import LogoImage from "../Common/Image/LogoImage";
import GlobalSpinnerLoader from "../Common/Loader/GlobalSpinnerLoader";

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

  const handleSubmit = async (site) => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await getCityFirebaseConfig(site?.site_id);
      await changeDefaultCityAction(site, setDefault, setCityContext, onClose);
    } catch (err) {
      console.error("Error fetching firebase config:", err);
    } finally {
      setSaving(false);
    }
  };

  useMemo(() => {
    if (cityList?.length > 0 && city) {
      let detail = cityList.find((item) => item?.site_name === city);
      setSelectedCity(detail);
    }
  }, [cityList, city]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cityList;

    return cityList.filter((c) =>
      c.site_name.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div className={modalStyles.headerTextRight}>
                <h2 className={modalStyles.modalTitle}>
                  {defaultCityExist ? "Select Site" : "Set your default site"}
                </h2>
                <p className={modalStyles.modalSubtitle}>
                  Choose your preferred site location
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
                placeholder="Search sites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={modalStyles.searchInput}
              />
            </div>
          </div>

          {/* Body */}
          <div className={`${modalStyles.modalBody} ${styles.modalBody}`}>
            {loading ? (
              <WevoisLoader title={"loading sites"} height="250px" />
            ) : filteredCities.length === 0 ? (
              <NoResult
                title="No Sites Found"
                query={searchQuery}
                gif={cityNotFound}
              />
            ) : (
              <div className={styles.cityRow}>
                {filteredCities.map((site) => (
                  <div
                    key={site.site_id}
                    className={`${styles.cityCard} ${
                      selectedCity?.site_id === site?.site_id
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => setSelectedCity(site)}
                  >
                    {/* <div className={styles.logoWrapper}> */}
                    <LogoImage image={site?.logoUrl} />
                    {/* </div> */}

                    <div className={styles.cityName}>{site.site_name}</div>
                    {selectedCity?.site_id === site?.site_id && (
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
                      selectedCity?.site_id
                    );
                    setCityContext({
                      city: selectedCity?.site_name,
                      cityId: selectedCity?.site_id,
                      cityLogo: selectedCity?.logoUrl,
                    });

                    onClose();
                  } catch (err) {
                    console.error("Error fetching firebase config:", err);
                  }
                }}
              >
                {saving ? (
                  <GlobalSpinnerLoader />
                ) : (
                  <>
                    <Check size={18} style={{ marginRight: "6px" }} />
                    Change Site
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
