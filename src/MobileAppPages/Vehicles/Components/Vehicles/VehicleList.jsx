import React, { useState, useMemo } from 'react';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../Styles/Vehicle/Vehicle.module.css';
import { MoreVertical } from 'lucide-react';

const VehicleList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Row click → select vehicle only
  const handleVehicleSelect = (item) => {
    if (props.onSelectVehicle) {
      props.onSelectVehicle(item);
    }
  };

  // 3-dot click → open Add/Edit Vehicle Settings sidebar
  const handleThreeDotClick = (e, item) => {
    e.stopPropagation(); // prevent row click
    if (props.onEditVehicle) {
      props.onEditVehicle(item);
    }
  };

  // Filter + sort vehicles (active first, inactive last)
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
    <div className={props.isEmbedded ? '' : `dropdown ${GlobalStyles.dropDown}`}>
      <div
        className={props.isEmbedded ? '' : GlobalStyles.overlay}
        style={props.isEmbedded ? {} : { display: "block" }}
      >
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} 
          ${props.isEmbedded ? '' : GlobalStyles.dropdownDesktop} 
          ${props.isEmbedded ? '' : styles.pageDropdown}`}
          style={{
            display: "block",
            position: props.isEmbedded ? 'static' : 'absolute',
            width: '100%',
            border: props.isEmbedded ? 'none' : '',
            boxShadow: props.isEmbedded ? 'none' : ''
          }}
        >
          {/* Search */}
          <div className={GlobalStyles.searchGroup}>
            <input
              className={GlobalStyles.inputSearch}
              type="text"
              placeholder="Search vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {!props.isEmbedded && (
            <div className={styles.userListTitle}>Select Vehicles</div>
          )}

          <div style={props.isEmbedded ? { height: 'auto', maxHeight: '100%' } : { height: 'calc(100vh - 270px)', overflow: 'auto' }}>
            {props.loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.cityLoaderWrapper}>
                  <div className={styles.cityLoader}></div>
                  <img
                    src={images.wevoisLogo}
                    alt="loader"
                    className={styles.centerIcon}
                  />
                </div>
                <div className={styles.loaderText}>
                  Please wait... Loading vehicle data.
                </div>
              </div>
            ) : filteredVehicles.length > 0 ? (
              filteredVehicles.map((item, i) => (
                <li
                  className={GlobalStyles.dropdownLi}
                  key={i}
                  style={{ marginBottom: props.isEmbedded ? '0px' : '' }}
                >
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
                    <div
                      className={`${GlobalStyles.userInfo} d-flex justify-content-between align-items-start w-100`}
                      style={{ color: '#000000' }}
                    >
                      {/* Left side: Vehicle number */}
                      <span className={styles.employeeName}>
                        {item.vehicles_No}
                      </span>

                      {/* Right side: Red dot + 3-dot icon */}
                      <div className="d-flex align-items-center">
                        {item.status === 'inactive' && (
                          <span
                            className={styles.redDot}
                            style={{ marginRight: '8px' }}
                          ></span>
                        )}
                        <div
                          className={styles.editIconWrapper}
                          onClick={(e) => handleThreeDotClick(e, item)}
                          style={{ cursor: 'pointer', opacity: 1, pointerEvents: 'auto' }} // ✅ fully visible
                        >
                          <MoreVertical
                            size={16}
                            className={styles.editIcon}
                            style={{ color: '#000', opacity: 1 }} // ✅ fully visible
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div
                className={styles.noUserData}
                style={props.isEmbedded ? { height: "auto", padding: "20px 0" } : {}}
              >
                <img
                  src={images.imgComingSoon}
                  className={`img-fluid ${styles.noUserImg}`}
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
