import { ChevronDown, Truck, Search, Check, AlertCircle } from "lucide-react";
import styles from "../../styles/StartAssignment.module.css";
import React, { useState, useMemo, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import sheetStyles from "./VehicleSheet.module.css";
import {images} from "../../../../../assets/css/imagePath.js";

const VehiclesDropdown = ({
  ward,
  user,
  city,
  loading,
  selectedVehicle,
  setSelectedVehicle,
  activeVehicles,
  vehicleError, 
  setErrors
}) => {
  const [isOpen, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter vehicles based on search input
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return activeVehicles || [];
    return activeVehicles?.filter((v) =>
      v?.vehcileNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeVehicles]);

  // Handle vehicle selection
  const handleSelect = (vehicleNo) => {
    setSelectedVehicle(vehicleNo);
     setErrors((prev) => ({ ...prev, vehicle: "" })); 
    setOpen(false);
  };

  // 🔹 Auto-clear error when typing in search
  useEffect(() => {
    if (searchTerm) {
      setErrors((prev) => ({ ...prev, vehicle: "" }));
    }
  }, [searchTerm]);

  const snapPoints = [0, 0.7, 1];

    // 🔹 Validate on open-close if needed
//   const handleDropdownClick = () => {
//   setErrors((prev) => ({ ...prev, vehicle: "" }));
//   setOpen(true);
// };



  return (
    <div className={styles.vehicleCard}>
      {/* Info Header (Ward, User, City) */}
      <div className={styles.infoHeader}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Ward:</span>
          <span className={styles.infoValue}>{ward || "-"}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>User:</span>
          <span className={styles.infoValue}>{user || "-"}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>City:</span>
          <span className={styles.infoValue}>{city || "-"}</span>
        </div>
      </div>

      {/* Vehicle Selector */}
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownDisplay}
            onClick={() => setOpen(true)}
          >
            <div className={styles.leftGroup}>
              <Truck color="#22c55e" size={24} className={styles.truckIcon} />
              <span className={styles.vehicleLabel}>
                {selectedVehicle || "Please Select vehicle"}
              </span>
            </div>
            <ChevronDown className={styles.dropdownIcon} size={16} />
          </button>

{/* Inline Error Message */}
          {vehicleError && (
    <div className={styles.errorMessage}>
      <AlertCircle size={14} /> {vehicleError}
    </div>
  )}

          {/* Bottom Sheet */}
          <Sheet
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            initialSnap={1}
            snapPoints={snapPoints}
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                  <div className={sheetStyles.sheetTitle}>Vehicle List</div>
               {loading ? (
                // 🔹 Loader shown only inside sheet
                <div className={sheetStyles.loadingContainer}>
                  <div className={sheetStyles.loader}></div>
                  <p className={sheetStyles.loadingText}>Loading vehicles...</p>
                </div>
              ) : (
                <div className={sheetStyles.sheetContent}>

                  {/* Search Box */}
                  <div className={sheetStyles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search vehicle..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={sheetStyles.searchInput}
                    />
                  </div>

                  {/* Vehicle List */}
                  <ul className={sheetStyles.vehicleList}>
                    {filteredVehicles?.length > 0 ? (
                      filteredVehicles.map((vehicle, index) => {
                        const isSelected =
                          vehicle.vehcileNo === selectedVehicle;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(vehicle.vehcileNo)}
                            className={`${sheetStyles.vehicleItem} ${
                              isSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                            <span>{vehicle.vehcileNo || "N/A"}</span>

                            {/* ✅ Check icon for selected vehicle */}
                            {isSelected && (
                              <Check
                                size={18}
                                color="#22c55e"
                                className={sheetStyles.checkIcon}
                              />
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li className={sheetStyles.noResult}>
                        <img
                          src={images.imgComingSoon}
                          className={sheetStyles.noResultImg}
                          alt=""
                        />
                        No vehicle found
                      </li>
                    )}
                  </ul>
                </div>
              )}

                
              </Sheet.Content>
            </Sheet.Container>
             <Sheet.Backdrop onTap={() => setOpen(false)} />
          </Sheet>
        </div>
    </div>
  );
};

export default VehiclesDropdown;
