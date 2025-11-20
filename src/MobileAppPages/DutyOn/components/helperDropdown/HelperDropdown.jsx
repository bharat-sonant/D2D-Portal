import { ChevronDown, Truck, Search, Check, AlertCircle, UserRound } from "lucide-react";
import styles from '../../../DailyAssignments/StartAssignment/styles/StartAssignment.module.css';
import React, { useState, useMemo, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import sheetStyles from "../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css";
import { images } from "../../../../assets/css/imagePath";


const HelperDropdown = ({loading, helpers, selectedHelper, setSelectedHelper}) => {
  const [isOpen, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
        if (searchTerm) {
          // setErrors((prev) => ({ ...prev, driver: "" }));
        }
      }, [searchTerm]);
  
    const snapPoints = [0, 0.7, 1];
  
     // Filter vehicles based on search input
     const filteredHelpers = useMemo(() => {
    let list = helpers || [];
  
    // filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(d => 
        d?.name?.toLowerCase().includes(term)
      );
    }
  
    // sort alphabetically
    return [...list].sort((a, b) =>
      a?.name?.localeCompare(b?.name, undefined, { sensitivity: "base" })
    );
  }, [searchTerm, helpers]);
  
      // Handle vehicle selection
      const handleSelect = (helper) => {
        setSelectedHelper(helper);
        // setErrors((prev) => ({ ...prev, driver: "" }));
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
              {selectedHelper?.name || "Please Select Helper"}
            </span>
          </div>
          <ChevronDown className={styles.dropdownIcon} size={16} />
        </button>

        {/* {driverError && (
          <div className={styles.errorMessage}>
            <AlertCircle size={14} /> {driverError}
          </div>
        )} */}

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
                  <p className={sheetStyles.loadingText}>Loading helpers...</p>
                </div>
              ) : (
                <div className={sheetStyles.sheetContent}>
                  <div className={sheetStyles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search helper..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={sheetStyles.searchInput}
                    />
                  </div>

                  <ul className={sheetStyles.vehicleList}>
                    {filteredHelpers?.length > 0 ? (
                      filteredHelpers.map((helper, index) => {
                        const isHelperSelected =
                          helper?.name === selectedHelper.name;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(helper)}
                            className={`${sheetStyles.vehicleItem} ${
                              isHelperSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                          <div className={sheetStyles.row}>
                            {/* LEFT: Driver name */}
                            <span className={sheetStyles.driverName}>{helper?.name}</span>

                            {/* RIGHT: Device id */}
                            <span className={sheetStyles.driverName}>{`DEV${helper?.Id}`}</span>
                          </div>

                            {isHelperSelected && 
                            <Check
                              size={18}
                              color="#22c55e"
                              className={sheetStyles.checkIcon}
                            />}
                          
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
                        No helper found
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* {!loading && (
                <div className={sheetStyles.refreshBox}>
                <span>If driver is not in the list, please refresh.</span>

                <RefreshCcw onClick={handleRefresh}/>
              </div>
              )} */}
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop onTap={() => setOpen(false)} />
        </Sheet>
      </div>
    </div>
  )
}

export default HelperDropdown
