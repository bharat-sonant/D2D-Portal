import React, { useMemo, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
// import sheetStyles from '../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css'; 
import { Sheet } from 'react-modal-sheet';
import {images} from '../../../../assets/css/imagePath'
import sheetStyles from "../../styles/BottomSheet2.module.css";

const BottomSheet2 = ({isOpen,
  onClose,
  assignedVehicle,
  setSelectedVehicle,
  openSheet,
  loading,
  mode,
  setMode}) => {
  const snapPoints = [0, 0.4, 1];

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
              {loading ? (
                <div className={sheetStyles.loadingContainer}>
                  <div className={sheetStyles.loader}></div>
                  <p className={sheetStyles.loadingText}>Loading vehicles...</p>
                </div>
              ) : (
               <div className={sheetStyles.sheetContent}>
                {mode === "driver" ? (
                <div className={sheetStyles.comingSoonBox}>
                  <p className={sheetStyles.comingSoonText}>Coming soon...</p>
                </div>

              ) : assignedVehicle ? (
                <>
                  <div className={sheetStyles.vehicleCard}>
                    <h3 className={sheetStyles.vehicleTitle}>Assigned Vehicle</h3>
                    <div className={sheetStyles.vehicleBox}>{assignedVehicle}</div>
                  </div>

                  <p className={sheetStyles.helperText}>
                    For this task, do you want to continue with the above vehicle or change it?
                  </p>

                  <div className={sheetStyles.btnRow}>
                    <button
                      className={sheetStyles.btnYes}
                      onClick={() => {
                        setSelectedVehicle(assignedVehicle);
                        setMode("driver");   // 👈 switch mode
                      }}
                    >
                      Yes, Continue
                    </button>

                    <button
                      className={sheetStyles.btnChange}
                      onClick={openSheet}
                    >
                      Change Vehicle
                    </button>
                  </div>
                </>
                ) : (
              <div className={sheetStyles.noVehicleBox}>
                <p className={sheetStyles.noVehicleText}>
                  No vehicle assigned for this task.
                </p>

                <button
                  className={sheetStyles.selectBtn}
                  onClick={openSheet}
                >
                  Select Vehicle
                </button>
              </div>
            )}

            </div>

              )}
            </Sheet.Content>
          </Sheet.Container>
          {/* <Sheet.Backdrop onTap={onClose} /> */}
        </Sheet>
  );
};

export default BottomSheet2;
