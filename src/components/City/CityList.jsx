import GlobalStyles from "../../assets/css/globleStyles.module.css";
import styles from "../../assets/css/City/CityList.module.css";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { images } from "../../assets/css/imagePath";
import { FaEdit } from "react-icons/fa";
import { changeCityStatusActiveAndInactive } from "../../services/City/CityService";
import { setAlertMessage } from "../../common/common";

const CityList = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = Array.isArray(props.cityData) ? props.cityData : [];
    if (searchTerm) {
      filtered = filtered.filter((city) =>
        city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    props.setFilteredCity(filtered);
    if (filtered.length > 0) {
      props.setCityId(filtered[0].id);
      props.setSelectedCityId(filtered[0].id);
    } else {
      props.setCityId("");
      props.setSelectedCityId('');
    }
  }, [searchTerm, props.cityData]);

  const handleSearch = (e) => {
    const term = e.target.value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, " ");
    setSearchTerm(term);
  };

  const handleToggleCity = (e, status) => {
    e.stopPropagation();
    const loggedInUserId = 'Admin';
    const newStatus = Number(status) === 1 ? 2 : 1;

    changeCityStatusActiveAndInactive(loggedInUserId, props.cityId, newStatus)
      .then((resp) => {
        if (resp.status === "success") {
          const removeEmployee = props.cityData.filter(
            (city) => city.id !== props.cityId
          );

          const updatedEmployees = props.allCityData.map((city) =>
            city.id === props.cityId ? { ...city, status: newStatus } : city
          );

          props.setFilteredCity(removeEmployee);
          props.setCityData(removeEmployee);
          props.setAllCityData(updatedEmployees);

          const statusText = newStatus === 1 ? "activated" : "deactivated";
          setAlertMessage("success", `City successfully ${statusText}.`);
        }
      })
      .catch(() => {
        setAlertMessage("error", "Error updating city status!");
      });
  };


  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div className={`${GlobalStyles.overlay} ${styles.overlayVisible}`}>
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown} ${styles.dropdownVisible}`}
          aria-labelledby="dropdownMenuButton"
        >
          <div className={`${GlobalStyles.searchGroup}`}>
            <input
              className={`${GlobalStyles.inputSearch}`}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className={`${styles.userListTitle}`}>Select City</div>
          <div className={`${styles.userScroll}`}>
            {props.loading ? (
              <div className={styles.loaderContainer}>
                <PulseLoader color="#3fb2f1" size={11} />
                <div className={`${GlobalStyles.loaderText}`}>
                  Loading cities, Please wait
                </div>
              </div>
            ) : props.filteredCity.length > 0 ? (
              props.filteredCity.map((city, i) => (
                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem} ${props.selectedCityId === city.id
                      ? `${GlobalStyles.selectedUser} ${styles.selectedCityItem}`
                      : styles.cityItem
                      }`}
                    onClick={() => props.handleSelectCity(city)}
                  >
                    <div className={`${GlobalStyles.userInfo} ${styles.cityInfo}`}>
                      <span className={`${styles.employeeName}`}>
                        {city.cityName}
                      </span>
                    </div>

                    {props.selectedCityId === city.id && (
                      <div className={styles.actionButtons}>
                        {Number(city.status) === 1 && (
                          <FaEdit
                            onClick={(e) => props.handleEditCity(e, city)}
                            className={styles.editIcon}
                            title="Edit City"
                          />
                        )}

                        <label
                          className={styles.toggleLabel}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={Number(city.status) === 1}
                            onChange={(e) => handleToggleCity(e, city.status)}
                            className={styles.toggleInput}
                          />
                          <span className={`${styles.toggleSlider} ${Number(city.status) !== 2 ? styles.toggleActive : styles.toggleInactive}`}>
                            <span className={`${styles.toggleCircle} ${Number(city.status) !== 2 ? styles.circleActive : styles.circleInactive}`}></span>
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className={`${styles.noUserData}`}>
                <img
                  src={images.noCityFound}
                  className={`img-fluid ${styles.noUserImg}`}
                  title="No User Found"
                  alt="Image"
                />
                No cities found !!!
              </div>
            )}
          </div>
          <div>
            <label className={`checkbox-container ${styles.inactiveCheckbox}`}>
              <input
                type="checkbox"
                onChange={(e) => props.handleActiveInactiveUser(e.target.checked)}
              />
              <span className={`checkmark ${styles.checkMark}`}></span>
              <span className="label-text">Show Inactive Cities</span>
            </label>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default CityList;