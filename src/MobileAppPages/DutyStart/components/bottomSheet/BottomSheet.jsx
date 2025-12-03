import React, { useMemo, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import sheetStyles from '../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css'; 
import { Sheet } from 'react-modal-sheet';
import {images} from '../../../../assets/css/imagePath'

const BottomSheet = ({ isOpen, onClose, items = [], selectedItem = null, onSelect, title = '', loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const snapPoints = [0, 0.4, 1];

  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const q = searchTerm.trim().toLowerCase();
    return items.filter(i => (i || '').toLowerCase().includes(q));
  }, [items, searchTerm]);

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
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
                    {filteredItems?.length > 0 ? (
                      filteredItems.map((item, index) => {
                        const isSelected =
                          item === selectedItem;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            className={`${sheetStyles.vehicleItem} ${
                              isSelected ? sheetStyles.activeVehicle : ""
                            }`}
                          >
                            <span>{item || "N/A"}</span>

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
          {/* <Sheet.Backdrop onTap={onClose} /> */}
        </Sheet>
  );
};

export default BottomSheet;
