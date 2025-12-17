import React, { useState, useMemo } from 'react';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../Styles/Vehicle/Vehicle.module.css';

const VehicleList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleVehicleSelect = (item) => {
    props.onSelectVehicle(item);
  };

  // 🔍 Filter + sort vehicles (active first, inactive last)
  const filteredVehicles = useMemo(() => {
    return [...props.vehicleList]
      .filter(vehicle =>
        vehicle.vehicles_No
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.status === 'inactive' && b.status !== 'inactive') return 1;
        if (a.status !== 'inactive' && b.status === 'inactive') return -1;
        return 0;
      });
  }, [props.vehicleList, searchTerm]);

  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div className={`${GlobalStyles.overlay}`} style={{ display: "block" }}>
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
          style={{ display: "block" }}
          aria-labelledby="drop downMenuButton"
        >
          {/* 🔍 Search box */}
          <div className={GlobalStyles.searchGroup}>
            <input
              className={GlobalStyles.inputSearch}
              type="text"
              placeholder="Search vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={`${styles.userListTitle}`}>Select Vehicles</div>
          <div className={`${styles.userScroll}`}>
            {props.loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.cityLoaderWrapper}>
                  <div className={styles.cityLoader}></div>
                  <img
                    src={images.wevoisLogo}
                    alt="loader icon"
                    className={styles.centerIcon}
                  />
                </div>
                <div className={styles.loaderText}>
                  Please wait... Loading vehicle data.
                </div>
              </div>
            ) : filteredVehicles.length > 0 ? (
              filteredVehicles.map((item, i) => (
                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem} 
                      ${props.selectedVehicleId === item.id ? GlobalStyles.selectedUser : ""}`}
                    style={{
                      backgroundColor:
                        props.selectedVehicleId === item.id
                          ? "#3fb2f114"
                          : "transparent"
                    }}
                    onClick={() => handleVehicleSelect(item)}
                  >
                    <div className={`${GlobalStyles.userInfo}`} style={{ color: '#000000' }}>
                      <span className={`${styles.employeeName}`}>
                        {item.vehicles_No}
                      </span>
                      {item.status === 'inactive' && (
                        <span className={styles.redDot}></span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className={`${styles.noUserData}`}>
                <img
                  src={images.imgComingSoon}
                  className={`img-fluid ${styles.noUserImg}`}
                  title="No Vehicle Found"
                  alt="No Vehicle Found"
                />
                No vehicle data found
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default VehicleList;
