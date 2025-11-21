import React, { useEffect, useMemo, useState } from 'react'
import {images} from '../../../../assets/css/imagePath'
import { AlertCircle, Check, ChevronDown, RefreshCcw, UserRound } from 'lucide-react';
import { Sheet } from 'react-modal-sheet';
import styles from '../../styles/DutyOn.module.css'
import sheetStyles from "../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css";
import { fetchAllActiveDrivers } from '../../actions/DutyOnAction';

const DriverDropdown = ({selectedDriver, setSelectedDriver, driverError, setErrors}) => {
  const [isOpen, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceDropdownDriver, setDeviceDropdownDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDrivers, setActiveDrivers] = useState([])
  const [hasFetched, setHasFetched] = useState(false);

 
  useEffect(() => {
      if (searchTerm) {
        setErrors((prev) => ({ ...prev, driverError: "" }));
      }
    }, [searchTerm]);

  const snapPoints = [0, 0.7, 1];

   // Filter vehicles based on search input
   const filteredDrivers = useMemo(() => {
  let list = activeDrivers || [];

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
}, [searchTerm, activeDrivers]);

    // Handle vehicle selection
    const handleSelect = (driver) => {
      setSelectedDriver(driver);
      setErrors((prev) => ({ ...prev, driver: "" }));
      setOpen(false);
    };

    // const handleRefresh = async() => {
    //   onRefresh();
    //   setSelectedDriver({})
    // }

    const handleMapDevice = async(driver) => {
      setDeviceDropdownDriver(driver)
    }

    //  const handleDeviceMapped = (driverId, device) => {
    //   onDeviceMapped(driverId, device);
    //   setDeviceDropdownDriver(null);
    // }

    const handleOpen = () => {
      setOpen(true);

      if (!hasFetched) {
      fetchAllActiveDrivers(setLoading, setActiveDrivers);
      setHasFetched(true);
    }
    }

    return (
    <div className={styles.vehicleCard}>

      {/* Vehicle Selector */}
      <div className={styles.dropdownWrapper}>
        <button
          className={styles.dropdownDisplay}
          onClick={handleOpen}
        >
          <div className={styles.leftGroup}>
            <UserRound color="#22c55e" size={24} className={styles.truckIcon} />
            <span className={styles.vehicleLabel}>
              {selectedDriver?.name || "Please Select Driver"}
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
                        const isDriverSelected =
                          driver?.name === selectedDriver.name;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(driver)}
                            className={`${sheetStyles.vehicleItem} ${
                              isDriverSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                          <div className={sheetStyles.row}>
                            {/* LEFT: Driver name */}
                            <span className={sheetStyles.driverName}>{driver?.name}</span>

                            {/* RIGHT: Device id */}
                            <span className={sheetStyles.driverName}>{`DEV${driver?.Id}`}</span>
                          </div>

                            {isDriverSelected && 
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
                        No driver found
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
  );
}

export default DriverDropdown
