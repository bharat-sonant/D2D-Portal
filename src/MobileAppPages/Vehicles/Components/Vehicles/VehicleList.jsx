import NoResult from "../../../../components/NoResultFound/NoResult";
import styles from "./VehicleList.module.css";
import { ChevronRight } from "lucide-react";
import vehicle from "../..//../../assets/images/icons/vehicle.gif";
import { useState } from "react";
const VehicleList = (props) => {
  // Row click → select vehicle only

  const [searchQuery, setSearchQuery] = useState("");
  const capitalizeWords = (text = "") =>
    text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

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

  return (
    <>
      {props.loading ? (
        <div className={styles.loaderContainer}>Loading...</div>
      ) : props.vehicleList.length > 0 ? (
        props.vehicleList.map((item, i) => (
          <div className={styles.vehicleLayout}>
            <div
              className={styles.vehicleBox}
              key={i}
              onClick={() => handleVehicleSelect(item)}
            >
              {/* <div
              className={`dropdown-item ${styles.dropdownItem}
                ${
                  props.selectedVehicleId === item.id
                    ? styles.selectedUser
                    : ""
                }`}
      
            > */}
              <div className={styles.vehicleLeft}>
                {capitalizeWords(item.vehicles_No)}
              </div>
              <div className={styles.vehicleRight}>
                {item.status === "inactive" && (
                  <span className={styles.redDot}></span>
                )}
                <div
                  className={styles.iconEdit}
                  onClick={(e) => handleThreeDotClick(e, item)}
                >
                  <ChevronRight size={16} />
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        ))
      ) : (
        <NoResult
          title="No vehicle data found"
          query={searchQuery}
          gif={vehicle}
        />
      )}
    </>
  );
};

export default VehicleList;
