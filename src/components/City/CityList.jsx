import React, { useEffect } from "react";
import { useState } from 'react';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import styles from '../../Style/Common/CommonListLayout.module.css';
import { debounce } from "lodash";
import { filterCityAction, getwardList } from "../../Actions/City/cityAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";

const CityList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCityList, setFilteredCityList] = useState(props?.cityList || []);

  useEffect(() => {
    setFilteredCityList(filterCityAction(props?.cityList, searchTerm, props?.setSelectedCity, props?.selectedCity))
  }, [props?.cityList, searchTerm]);
  const handleSearch = debounce((e) => { setSearchTerm(e.target.value) }, 300);

  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div
        className={`${GlobalStyles.overlay}`}
        style={{ display: "block" }}
      >
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
          style={{
            display: "block",
          }}
          aria-labelledby="drop downMenuButton"
        >
          <div className={`${GlobalStyles.searchGroup}`}>
            <input
              className={`${GlobalStyles.inputSearch}`}
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
          <div className={`${styles.userListTitle}`}>Select Employee</div>
          <div className={styles.userScroll}>
            {props.loading ? (
              <WevoisLoader title="Loading user data..." />
            ) : filteredCityList?.length > 0 ? (
              filteredCityList.map((city, i) => (
                <li className={GlobalStyles.dropdownLi} key={city.CityId || i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem} ${props?.selectedCity?.CityId === city.CityId
                        ? GlobalStyles.selectedUser
                        : ""
                      }`}
                    style={{
                      backgroundColor:
                        props?.selectedCity?.CityId === city.CityId
                          ? "#3fb2f114"
                          : "transparent",
                    }}
                    onClick={() => {
                      props?.setSelectedCity(city);
                      getwardList(city.CityId, props.setWardList);
                    }}
                  >
                    <div className={GlobalStyles.userInfo}>
                      <span className={styles.employeeName}>
                        {city.CityName}
                      </span>

                      {city.Status === "inactive" && (
                        <span className={styles.redDot}></span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className={styles.noUserData}>
                <img
                  src={images.imgComingSoon}
                  className={`img-fluid ${styles.noUserImg}`}
                  alt="No City Found"
                />
                City not found
              </div>
            )}
          </div>

        </ul>
      </div>
    </div>
  )
}

export default React.memo(CityList);
