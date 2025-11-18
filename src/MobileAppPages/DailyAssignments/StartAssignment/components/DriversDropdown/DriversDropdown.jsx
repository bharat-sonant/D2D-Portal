import React, { useEffect, useMemo, useState } from 'react'
import styles from '../../styles/StartAssignment.module.css'
import { Sheet } from 'react-modal-sheet';
import sheetStyles from "../VehiclesDropdown/VehicleSheet.module.css";
import { AlertCircle, Check, ChevronDown, RefreshCcw, UserRound } from 'lucide-react';
import {images} from '../../../../../assets/css/imagePath'
import { mapDeviceWithActiveDriver } from '../../../../services/StartAssignmentService/StartAssignment';

const DriversDropdown = ({loading, selectedDriver, setSelectedDriver, driverError, setErrors, drivers, onRefresh, availableDevices, onDeviceMapped}) => {
  const [isOpen, setOpen] = useState(false);
  const [deviceListOpen, setDeviceListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceSearch, setDeviceSearch] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

  useEffect(() => {
      if (searchTerm) {
        setErrors((prev) => ({ ...prev, driver: "" }));
      }
    }, [searchTerm]);

  const snapPoints = [0, 0.7, 1];

   // Filter vehicles based on search input
   const filteredDrivers = useMemo(() => {
  let list = drivers || [];

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
}, [searchTerm, drivers]);

 const filteredDevices = useMemo(() => {
  let list = availableDevices || [];

  // filter
  if (deviceSearch) {
    const term = deviceSearch.toLowerCase();
    list = list.filter(d => 
      d?.DeviceName?.toLowerCase().includes(term) ||
      d?.DeviceId?.toLowerCase().includes(term)
    );
  }

  // sort alphabetically
  return [...list].sort((a, b) =>
    a?.DeviceName?.localeCompare(b?.DeviceName, undefined, { sensitivity: "base" })
  );
}, [deviceSearch, availableDevices]);

  
    // Handle vehicle selection
    const handleSelect = (driver) => {
      setSelectedDriver(driver);
      setErrors((prev) => ({ ...prev, driver: "" }));
      setOpen(false);
    };

    const handleRefresh = async() => {
      onRefresh();
      setSelectedDriver({})
    }

    const handleDeviceSelect = async (device) => {
      setSelectedDevice(device.DeviceId);

      if (!selectedDriver || !selectedDriver.Id) return;

      const response = await mapDeviceWithActiveDriver(selectedDriver.Id, device);

      if (response.status === "success") {
        onDeviceMapped(selectedDriver.Id, device);
      }
      setDeviceListOpen(false);
    };


    const handleMapDevice = async(driver) => {
      setSelectedDriver(driver)
      setDeviceListOpen(true);
    }

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
                        const isDeviceSelected =
                          driver?.name === selectedDriver.name;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(driver)}
                            className={`${sheetStyles.vehicleItem} ${
                              isDeviceSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                          <div className={sheetStyles.row}>
                            {/* LEFT: Driver Name */}
                            <span className={sheetStyles.driverName}>{driver?.name}</span>

                            {/* RIGHT: Device Name OR Map Device button */}
                            {driver?.DeviceName && driver?.DeviceId ? (
                              <span className={sheetStyles.deviceName}>
                                {driver?.DeviceName}
                              </span>
                            ) : (
                              <button
                                className={sheetStyles.mapBtn}
                                onClick={(e) => {
                                  e.stopPropagation(); // stop row click
                                  handleMapDevice(driver);
                                }}
                              >
                                Map Device
                              </button>
                            )}
                          </div>

                          {isDeviceSelected && (
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

              {!loading && (
                <div className={sheetStyles.refreshBox}>
                <span>If driver is not in the list, please refresh.</span>

                <RefreshCcw onClick={handleRefresh}/>
              </div>
              )}
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop onTap={() => setOpen(false)} />
        </Sheet>

         <Sheet
          isOpen={deviceListOpen}
          onClose={() => setDeviceListOpen(false)}
          initialSnap={1}
          snapPoints={snapPoints}
          disableDrag={true} 
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <div
                className={sheetStyles.btnClose}
                onClick={() => setDeviceListOpen(false)}
              >
                Close
              </div>
              {loading ? (
                // 🔹 Loader shown only inside sheet
                <div className={sheetStyles.loadingContainer}>
                  <div className={sheetStyles.loader}></div>
                  <p className={sheetStyles.loadingText}>Loading devices...</p>
                </div>
              ) : (
                <div className={sheetStyles.sheetContent}>
                  <div className={sheetStyles.searchBox}>
                    <input
                      type="text"
                      placeholder="Search device..."
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                      className={sheetStyles.searchInput}
                    />
                  </div>

                  <ul className={sheetStyles.vehicleList}>
                    {/* {console.log('available', availableDevices)} */}
                    {filteredDevices?.length > 0 ? (
                      filteredDevices.map((device, index) => {
                        const isDeviceSelected =
                          device?.DeviceId === selectedDevice;
                        return (
                          <li
                            key={device.DeviceId}
                            onClick={() => handleDeviceSelect(device)}
                            className={`${sheetStyles.vehicleItem}`}
                          >
                          <div className={sheetStyles.row}>
                            {/* LEFT: device Name */}
                            <span className={sheetStyles.driverName}>{device?.DeviceName}</span>

                             {isDeviceSelected && (
                            <Check
                              size={18}
                              color="#22c55e"
                              className={sheetStyles.checkIcon}
                            />
                          )}
                          </div>

                         
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
                        No device found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop onTap={() => setDeviceListOpen(false)} />
        </Sheet>
      </div>
    </div>
  );
}

export default DriversDropdown
