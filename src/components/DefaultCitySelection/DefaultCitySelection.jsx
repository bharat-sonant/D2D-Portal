
import { useEffect, useState } from 'react';
import styles from '../../assets/css/DefaultCitySelection/defaultCitySelection.module.css'
import { getCityList } from '../../Actions/commonActions';
import { useCity } from '../../context/CityContext';
import { changeDefaultCityAction } from '../../Actions/DefaultCitySelection/defaultCitySelectionAction';

const DefaultCitySelection = ({ onClose }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [setDefault, setSetDefault] = useState(JSON.parse(localStorage.getItem('defaultCity'))?false:true);
  const [cityList,setCityList] = useState([]);
  const {city,setCity} = useCity();

  useEffect(()=>{
    getCityList(setCityList,'active');
  },[]);

  const handleSubmit = (city) => {
    changeDefaultCityAction(city,setDefault,setCity,onClose)
  };

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
              <h5 className={styles.headerTitle}>{city}</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            {/* Body */}
            <div className={`modal-body ${styles.body}`}>
              <div className="row g-3">
                {cityList?.map((city) => (
                  <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={city?.CityId}>
                    <div className={`${styles.cityCard} ${selectedCity?.CityId === city?.CityId ? styles.selected : "" }`}
                      onClick={() => handleSubmit(city)}
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
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <input
                  className={`${styles.checkBoxStyle}`}
                  type="checkbox"
                  // disabled={!selectedCity}
                  checked={setDefault}
                  onChange={(e) => setSetDefault(e.target.checked)}
                />
                <label className="form-check-label">Set as default city</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default DefaultCitySelection