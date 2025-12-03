import React, { useMemo, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
// import sheetStyles from '../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css'; 
import { Sheet } from 'react-modal-sheet';
import {images} from '../../../../assets/css/imagePath'
import sheetStyles from "../../styles/BottomSheet2.module.css";

const BottomSheet2 = ({isOpen,
  onClose,
  assignedData,
  setSelectedVehicle,
  setSelectedDriver,
  setselectedHelper,
  openSheet,
  closeSheet,
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
                  <p className={sheetStyles.loadingText}>Loading {mode}...</p>
                </div>
              ) : (
               <div className={sheetStyles.sheetContent}>

                {mode === "helperConfirmation" && (
                <>
                  <p className={sheetStyles.helperText}>
                    Whether you want to continue 
                  </p>

                  <div className={sheetStyles.btnRow}>
                    <button
                      className={sheetStyles.btnYes}
                      onClick={() => setMode("helper")}
                    >
                      With Helper
                    </button>

                    <button
                      className={sheetStyles.btnChange}
                      onClick={() => {
                        setselectedHelper(null);
                        setMode("comingSoon");
                      }}
                    >
                      Without Helper
                    </button>
                  </div>
                </>
              )}
                {mode === "comingSoon" && (<>coming soon...</>)}
                {mode === "helper" && assignedData?.helper && (
                  <>
                  <div className={sheetStyles.vehicleCard}>
                    <h3 className={sheetStyles.vehicleTitle}>Assigned Helper</h3>
                    <div className={sheetStyles.vehicleBox}>{assignedData.helperName}</div>
                  </div>

                  <p className={sheetStyles.helperText}>
                    For this task, do you want to continue with the above helper or change it?
                  </p>

                  <div className={sheetStyles.btnRow}>
                    <button
                      className={sheetStyles.btnYes}
                      onClick={() => {
                        setselectedHelper(assignedData.helperName);
                        setMode('comingSoon')
                      }}
                    >
                      Yes, Continue
                    </button>

                    <button
                      className={sheetStyles.btnChange}
                      onClick={openSheet}
                    >
                      Change Helper
                    </button>
                  </div>
                </>
                )}
                {mode === "driver" && assignedData?.driver && (
                <>
                  <div className={sheetStyles.vehicleCard}>
                    <h3 className={sheetStyles.vehicleTitle}>Assigned Driver</h3>
                    <div className={sheetStyles.vehicleBox}>{assignedData.driverName}</div>
                  </div>

                  <p className={sheetStyles.helperText}>
                    For this task, do you want to continue with the above driver or change it?
                  </p>

                  <div className={sheetStyles.btnRow}>
                    <button
                      className={sheetStyles.btnYes}
                      onClick={() => {
                        setSelectedDriver(assignedData.driverName);
                        setMode("helperConfirmation");   // 👈 switch mode
                      }}
                    >
                      Yes, Continue
                    </button>

                    <button
                      className={sheetStyles.btnChange}
                      onClick={openSheet}
                    >
                      Change Driver
                    </button>
                  </div>
                </>

              )} 
              {mode === 'vehicle' && assignedData?.vehicle && (
                <>
                  <div className={sheetStyles.vehicleCard}>
                    <h3 className={sheetStyles.vehicleTitle}>Assigned Vehicle</h3>
                    <div className={sheetStyles.vehicleBox}>{assignedData.vehicle}</div>
                  </div>

                  <p className={sheetStyles.helperText}>
                    For this task, do you want to continue with the above vehicle or change it?
                  </p>

                  <div className={sheetStyles.btnRow}>
                    <button
                      className={sheetStyles.btnYes}
                      onClick={() => {
                        setSelectedVehicle(assignedData.vehicle);
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
                )} 
                {!assignedData?.vehicle &&
                !assignedData?.driver &&
                !assignedData?.helper &&
                mode !== "comingSoon" &&
                mode !== "helperConfirmation" && (
                  <div className={sheetStyles.noVehicleBox}>
                    <p className={sheetStyles.noVehicleText}>
                      No {mode} assigned for this task.
                    </p>
                    <button className={sheetStyles.selectBtn} onClick={openSheet}>
                      Select {mode}
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
