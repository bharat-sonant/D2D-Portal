import React, { useMemo, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
// import sheetStyles from '../../../DailyAssignments/StartAssignment/components/VehiclesDropdown/VehicleSheet.module.css'; 
import { Sheet } from 'react-modal-sheet';
import {images} from '../../../../assets/css/imagePath'
import sheetStyles from "../../styles/BottomSheet2.module.css";
import { startAssignmentAction } from '../../../DutyOn/actions/DutyOnAction';

const BottomSheet2 = ({isOpen,
  onClose,
  ward,
  assignedData,
  selectedDriver,
  selectedVehicle,
  selectedHelper,
  setSelectedVehicle,
  setSelectedDriver,
  setselectedHelper,
  openSheet,
  closeSheet,
  loading,
  mode,
  setMode}) => {
    const[isSaving, setIsSaving] = useState(false);
  const snapPoints = [0, 0.4, 1];

  useEffect(() => {
  if (!isOpen) return;

  // NO assigned data at all (fresh task)
  const noVehicle = !assignedData?.vehicle;
  const noDriver = !assignedData?.driver;
  const noHelper = !assignedData?.helper;

  // CASE 1 → Completely unassigned: start with vehicle
  if (noVehicle && !selectedVehicle) {
    setMode("vehicle");
    openSheet();
    return;
  }

  // CASE 2 → Vehicle selected but driver not selected: open driver list
  if (selectedVehicle && !selectedDriver?.Id) {
    setMode("driver");
    openSheet();
    return;
  }

  // CASE 3 → Driver selected but helper not selected: open helper list
  if (selectedDriver?.Id && !selectedHelper?.Id) {
    setMode("helper");       // or helperConfirmation if needed
    openSheet();
    return;
  }
}, [
  isOpen,
  assignedData,
  selectedVehicle,
  selectedDriver,
  selectedHelper
]);


   const handleSubmit = async() => {
      const result = await startAssignmentAction(setIsSaving, ward, selectedVehicle, selectedDriver, selectedHelper);
      if(result.status === "success"){
        //  handleClear();
        onClose()
      }
    }

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
                {mode === "comingSoon" && (
                  <>
                    <p className={sheetStyles.loadingText}>Are you sure, you want to start assignment with this record ?</p>
                    <button
                      className={sheetStyles.submitButton}
                      onClick={handleSubmit}
                    >
                      Start Assignment
                    </button>
                  </>
                )}
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
                        setselectedHelper({
                          Id: assignedData.helper,
                          name: assignedData.helperName
                        });
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
                        setSelectedDriver({
                          Id: assignedData.driver,
                          name: assignedData.driverName
                        });
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
            </div>
            </Sheet.Content>
          </Sheet.Container>
          {/* <Sheet.Backdrop onTap={onClose} /> */}
        </Sheet>
  );
};

export default BottomSheet2;
