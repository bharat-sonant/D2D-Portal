import React, { useMemo, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import sheetStyles from '../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css'; 
import { Sheet } from 'react-modal-sheet';
import {images} from '../../../../assets/css/imagePath'
import { getActiveDrivers, getActiveHelpers, getAllActiveVehicles } from '../../../services/DutyStartService/DutyStart';

const BottomSheet = ({ isOpen, onClose, mode, setMode, selectedDriver, setSelectedDriver, selectedVehicle, setSelectedVehicle, selectedHelper, setSelectedHelper }) => {
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const snapPoints = [0, 0.7, 1];

  useEffect(() => {
    if(!isOpen) return;

    if(mode === 'vehicle') fetchVehicles();
    if(mode === 'driver') fetchDrivers();
    if(mode === 'helper') fetchHelpers();
  },[isOpen, mode])

  const fetchVehicles = async() => {
    setLoading(true);
    const result = await getAllActiveVehicles();
    setVehicles(result.data || [])
    setLoading(false)
  }

  const fetchDrivers = async () => {
    setLoading(true)
    const result = await getActiveDrivers();
    setDrivers(result.data || [])
    setLoading(false)
  }

  const fetchHelpers = async() => {
    setLoading(true)
    const result = await getActiveHelpers();
    setHelpers(result.data || [])
    setLoading(false)
  }

   const items = mode === "vehicle"
    ? vehicles
    : mode === "driver"
    ? drivers
    : helpers;

  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

 const getDisplayName = (item) => {
  if (mode === "vehicle") return item;
  return item?.name || "";
};



  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
return items.filter(i => getDisplayName(i).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm, mode]);

  const handleSelect = (item) => {
   if (mode === "vehicle") {
      setSelectedVehicle(item);
      setMode("driver");
      onClose();
    }

    else if (mode === "driver") {
      setSelectedDriver(item);
      setMode("helperConfirmation");
      onClose();
    }

    else if (mode === "helper") {
      setSelectedHelper(item);
      setMode('comingSoon')
      onClose(); // last step
    }

  };
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
              {/* <div
                className={sheetStyles.btnClose}
                onClick={onClose}
              >
                Close
              </div> */}
              {loading ? (
                <div className={sheetStyles.loadingContainer}>
                  <div className={sheetStyles.loader}></div>
                  <p className={sheetStyles.loadingText}>Loading {mode}...</p>
                </div>
              ) : (
                <div className={sheetStyles.sheetContent}>
                  <div className={sheetStyles.searchBox}>
                    <input
                      type="text"
                      placeholder={`Search ${mode}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={sheetStyles.searchInput}
                    />
                  </div>

                  <ul className={sheetStyles.vehicleList}>
                    {filteredItems?.length > 0 ? (
                      filteredItems.map((item, index) => {
                        const isSelected =
                      (mode === "vehicle" && item === selectedVehicle) ||
                      (mode === "driver" && item.Id === selectedDriver?.Id) ||
                      (mode === "helper" && item.Id === selectedHelper?.Id);
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            className={`${sheetStyles.vehicleItem} ${
                              isSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                            <span>{getDisplayName(item) || "N/A"}</span>

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
                        No {mode} found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </Sheet.Content>
          </Sheet.Container>
          {/* <Sheet.Backdrop onTap={onClose} /> */}
        </Sheet>
  );
};

export default BottomSheet;
