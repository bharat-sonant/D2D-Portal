import React, { useEffect, useMemo, useState } from 'react'
import styles from '../../styles/StartAssignment.module.css'
import { Sheet } from 'react-modal-sheet';
import sheetStyles from "../VehiclesDropdown/VehicleSheet.module.css";
import { AlertCircle, Check, ChevronDown, UserRound } from 'lucide-react';
import {images} from '../../../../../assets/css/imagePath'

const DriversDropdown = ({loading, selectedDriver, setSelectedDriver, driverError, setErrors, drivers}) => {
  const [isOpen, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  console.log('drivers', drivers)

  useEffect(() => {
      if (searchTerm) {
        setErrors((prev) => ({ ...prev, driver: "" }));
      }
    }, [searchTerm]);

  const snapPoints = [0, 0.7, 1];

   // Filter vehicles based on search input
    const filteredDrivers = useMemo(() => {
      if (!searchTerm) return drivers || [];
      return drivers?.filter((d) =>{
        const name = d?.GeneralDetails?.name?.toLowerCase() || "";
        const id = d?.empId?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();

        return name.includes(term) || id.includes(term);
    });
    }, [searchTerm, drivers]);
  
    // Handle vehicle selection
    const handleSelect = (empId) => {
      setSelectedDriver(empId);
      setErrors((prev) => ({ ...prev, driver: "" }));
      setOpen(false);
    };

    return (
    <div className={styles.vehicleCard}>

      {/* Vehicle Selector */}
      <div className={styles.dropdownWrapper}>
        <button
          className={styles.dropdownDisplay}
          onClick={() => setOpen(true)}
        >
          <div className={styles.leftGroup}>
            <UserRound color="#22c55e" size={24} className={styles.truckIcon} />
            <span className={styles.vehicleLabel}>
              {selectedDriver || "Please Select Driver"}
            </span>
          </div>
          <ChevronDown className={styles.dropdownIcon} size={16} />
        </button>

        {driverError && (
          <div className={styles.errorMessage}>
            <AlertCircle size={14} /> {driverError}
          </div>
        )}

        <Sheet
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          initialSnap={1}
          snapPoints={snapPoints}
          disableDrag={true} 
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <div
                className={sheetStyles.btnClose}
                onClick={() => setOpen(false)}
              >
                Close
              </div>
              {loading ? (
                // 🔹 Loader shown only inside sheet
                <div className={sheetStyles.loadingContainer}>
                  <div className={sheetStyles.loader}></div>
                  <p className={sheetStyles.loadingText}>Loading drivers...</p>
                </div>
              ) : (
                <div className={sheetStyles.sheetContent}>
                  <div className={sheetStyles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search driver..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={sheetStyles.searchInput}
                    />
                  </div>

                  <ul className={sheetStyles.vehicleList}>
                    {filteredDrivers?.length > 0 ? (
                      filteredDrivers.map((driver, index) => {
                        const isSelected =
                          driver.empId === selectedDriver;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(driver.empId)}
                            className={`${sheetStyles.vehicleItem} ${
                              isSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                            <span>{`${driver.empId} - ${driver.GeneralDetails?.name}` || "N/A"}</span>

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
                        No driver found
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
}

export default DriversDropdown
