import { ChevronDown, Truck, Search, Check, AlertCircle } from "lucide-react";
import styles from '../../styles/DutyOn.module.css'
import React, { useState, useMemo, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import sheetStyles from "../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css";
import { images } from "../../../../assets/css/imagePath";
import { fetchAllVehicles } from "../../actions/DutyOnAction";


const VehicleDropdown = ({ selectedVehicle, setSelectedVehicle, vehicleError, setErrors}) => {
  const [isOpen, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [loading, setLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

   useEffect(() => {
        if (searchTerm) {
          setErrors((prev) => ({ ...prev, vehicleError: "" }));
        }
      }, [searchTerm]);

    const filteredVehicles = useMemo(() => {
     let list = activeVehicles || [];
   
     // filter
     if (searchTerm) {
       const term = searchTerm.toLowerCase();
       list = list.filter(d => 
         d?.vehicleNo?.toLowerCase().includes(term)
       );
     }
   
     // sort alphabetically
     return [...list].sort((a, b) =>
       a?.name?.localeCompare(b?.name, undefined, { sensitivity: "base" })
     );
   }, [searchTerm, activeVehicles]);

      const handleSelect = (vehicleNo) => {
    setSelectedVehicle(vehicleNo);
    setErrors((prev) => ({ ...prev, vehicle: "" }));
    setOpen(false);
  };

   const handleOpen = () => {
        setOpen(true);
  
        if (!hasFetched) {
        fetchAllVehicles(setLoading, setActiveVehicles);
        setHasFetched(true);
      }
      }
  

  const snapPoints = [0, 0.7, 1];
   return (
    <div className={styles.vehicleCard}>

      {/* Vehicle Selector */}
      <div className={styles.dropdownWrapper}>
        <button
          className={styles.dropdownDisplay}
          onClick={handleOpen}
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
                <div className={sheetStyles.loadingContainer}>
                  <div className={sheetStyles.loader}></div>
                  <p className={sheetStyles.loadingText}>Loading vehicles...</p>
                </div>
              ) : (
                <div className={sheetStyles.sheetContent}>
                  <div className={sheetStyles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search vehicle..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={sheetStyles.searchInput}
                    />
                  </div>

                  <ul className={sheetStyles.vehicleList}>
                    {filteredVehicles?.length > 0 ? (
                      filteredVehicles.map((vehicle, index) => {
                        const isSelected =
                          vehicle.vehicleNo === selectedVehicle;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(vehicle.vehicleNo)}
                            className={`${sheetStyles.vehicleItem} ${
                              isSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                            <span>{vehicle?.vehicleNo || "N/A"}</span>

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
}

export default VehicleDropdown






 
