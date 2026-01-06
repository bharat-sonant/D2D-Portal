
import { useEffect, useMemo, useState } from 'react';
import styles from '../../assets/css/DefaultCitySelection/defaultCitySelection.module.css'
import { getAvailableCityList } from '../../Actions/commonActions';
import { useCity } from '../../context/CityContext';
import { changeDefaultCityAction } from '../../Actions/DefaultCitySelection/defaultCitySelectionAction';
import WevoisLoader from '../Common/Loader/WevoisLoader';
import { getCityFirebaseConfig } from '../../services/CityService/firebaseConfigService';

const DefaultCitySelection = ({ onClose }) => {
  let defaultCityExist = JSON.parse(localStorage.getItem('defaultCity')) ? true : false;
  const { city, setCityContext } = useCity();
  const [selectedCity, setSelectedCity] = useState(null);

  const [setDefault, setSetDefault] = useState(!defaultCityExist);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getAvailableCityList(setCityList, 'active', setLoading, userId);
  }, []);


  const handleSubmit = async (city) => {
    if (saving) return;
    setSaving(true);

    try {
      const res = await getCityFirebaseConfig(city?.CityId);
      console.log(
        "🔥 Firebase Config (Default City):",
        res?.data
      );
      await changeDefaultCityAction(
        city,
        setDefault,
        setCityContext,
        onClose
      );
    } catch (err) {
      console.error("Error fetching firebase config:", err);
    } finally {
      setSaving(false);
    }
  };


  useMemo(() => {
    if (cityList?.length > 0 && city) {
      let detail = cityList.find(item => item?.CityName === city);
      setSelectedCity(detail)
    }
  }, [cityList, city])



  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className={`modal fade show ${styles.modal}`}
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className={styles.headerTitle}>{defaultCityExist ? 'Select City' : 'Set your default city'}</h5>
              {defaultCityExist && <button className="btn-close" onClick={onClose} />}
            </div>

            {/* Body */}
            <div className={`modal-body ${styles.body}`}>
              {loading ? (
                <WevoisLoader title={'loading cities'} height={'100%'} />
              ) : cityList?.length === 0 ? (
                <div className={styles.emptyState}>
                  <h5>No City Access</h5>
                  <p>
                    You don’t have access to any city yet. <br />
                    Please contact the administrator.
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {cityList?.map((city) => (
                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={city?.CityId}>
                      <div className={`${styles.cityCard} ${selectedCity?.CityId === city?.CityId ? styles.selected : ""}`}
                        onClick={() => setSelectedCity(city)}
                      >
                        <div className={styles.logoWrapper}>
                          <img
                            src={city?.logoUrl}
                            alt={city.name}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </div>
                        <div className={styles.cityName}>{city?.CityName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-end">
              {defaultCityExist ? (
                <button
                  className="btn btn-primary"
                  disabled={!selectedCity || saving}
                  onClick={async () => {
                    try {
                      const res = await getCityFirebaseConfig(selectedCity?.CityId);
                      console.log(
                        "🔥 Firebase Config (Change City):",
                        res?.data
                      );
                      setCityContext({
                        city: selectedCity?.CityName,
                        cityId: selectedCity?.CityId,
                        cityLogo: selectedCity?.logoUrl
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
                    `Change City`
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
      </div>
    </>
  );
};


export default DefaultCitySelection