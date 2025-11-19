import React, { useMemo, useState } from 'react'
import sheetStyles from '../VehiclesDropdown/VehicleSheet.module.css'
import { Sheet } from 'react-modal-sheet';
import { Check } from 'lucide-react';
import {images} from '../../../../../assets/css/imagePath'
import { mapDeviceWithActiveDriver } from '../../../../services/StartAssignmentService/StartAssignment';

const DeviceDropdown = ({driver,setSelectedDriver, availableDevices, onDeviceMapped, onClose, loading}) => {
  const [deviceSearch, setDeviceSearch] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

  const snapPoints = [0, 0.7, 1];

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

  const handleDeviceSelect = async (device) => {
    setSelectedDevice(device.DeviceId);

    if (!driver || !driver.Id) return;

    const response = await mapDeviceWithActiveDriver(driver.Id, device);

    if (response.status === "success") {
      onDeviceMapped(driver.Id, device);
      setSelectedDriver(driver);
    }
    onClose();
  };
  const isOpen = !!driver;
  
  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap={1}
      snapPoints={snapPoints}
      disableDrag={true} 
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div
            className={sheetStyles.btnClose}
            onClick={onClose}
          >
            Close
          </div>
          {loading ? (
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
                {filteredDevices?.length > 0 ? (
                  filteredDevices.map((device) => {
                    const isDeviceSelected = device?.DeviceId === selectedDevice;
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

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}

export default DeviceDropdown
