import * as common from "../../../../common/common";
import * as service from "../../../../MobileAppPages/Vehicles/Services/VehicleService/VehicleService";

/* =========================================================
   HANDLE INPUT CHANGE
========================================================= */
export const handleChange = (type, value, setVehicleName, setError) => {
  if (type === "name") {
    setVehicleName(value);

    if (value.trim() === "") {
      setError("Please provide vehicle name.");
    } else {
      setError("");
    }
  }
};

/* =========================================================
   SAVE OR UPDATE VEHICLE
========================================================= */
export const handleSave = async (
  vehicleName,
  setError,
  setLoader,
  setVehicleName,
  setShowModal,
  setVehicleList,
  vehicleId,
  setVehicleDetails,
  setVehicleId,
  historyData // optional callback to refresh list/history
) => {
  if (vehicleName.trim() === "") {
    setError("Please provide vehicle name.");
    return;
  }

  setLoader(true);

  try {
    let response;

    if (vehicleId) {
      // UPDATE VEHICLE
      response = await service.updateVehicle(vehicleId, { vehicles_No: vehicleName });
    } else {
      // ADD VEHICLE
      response = await service.addVehicle({ vehicles_No: vehicleName, city_id: 1 }); // adjust city_id as needed
    }

    if (response.status === "success") {
      setLoader(false);
      handleClearAll(setVehicleName, setError, setVehicleId);

      setVehicleList((prev) => {
        let updatedList;

        if (vehicleId) {
          updatedList = prev.map((item) =>
            item.vehicleId === vehicleId
              ? { ...item, name: vehicleName }
              : item
          );
        } else {
          updatedList = [
            {
              vehicleId: response.data.id,
              name: vehicleName,
              status: "active",
            },
            ...prev,
          ];
        }

        return updatedList.sort((a, b) => {
          const weight = (status) => (status === "inactive" ? 1 : 0);
          if (weight(a.status) !== weight(b.status)) {
            return weight(a.status) - weight(b.status);
          }
          return a.name.localeCompare(b.name);
        });
      });

      if (vehicleId) {
        setVehicleDetails((prev) => ({
          ...prev,
          name: vehicleName,
        }));
      }

      setShowModal(false);
      if (historyData) historyData();

      common.setAlertMessage(
        "success",
        vehicleId
          ? "Vehicle data updated successfully."
          : "Vehicle data saved successfully."
      );
    } else {
      setLoader(false);
      common.setAlertMessage("warn", response.message || "Something went wrong!");
    }
  } catch (err) {
    setLoader(false);
    console.error("Error saving vehicle:", err);
    common.setAlertMessage("warn", "Exception occurred while saving vehicle!");
  }
};

/* =========================================================
   CLEAR INPUTS
========================================================= */
export const handleClearAll = (setVehicleName, setError, setVehicleId) => {
  setVehicleName("");
  setError("");
  setVehicleId(null);
};

/* =========================================================
   TOGGLE VEHICLE STATUS
========================================================= */
export const ActiveInactiveVehicles = async (props, setToggle, toggle) => {
  const newStatus = toggle ? "inactive" : "active";
  setToggle(!toggle);

  try {
    const response = await service.changeVehicleStatus(
      props.vehicleDetails.vehicleId,
      newStatus
    );

    if (response.status === "success") {
      props.setVehicleDetails((prev) => ({
        ...prev,
        status: newStatus,
      }));

      props.setVehicleList((prev) => {
        const updatedList = prev.map((item) =>
          item.vehicleId === props.vehicleDetails.vehicleId
            ? { ...item, status: newStatus }
            : item
        );

        return updatedList.sort((a, b) => {
          if (a.status !== b.status) return a.status === "active" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      });

      common.setAlertMessage(
        "success",
        toggle ? "Vehicle inactive successfully" : "Vehicle active successfully"
      );

      if (props.historyData) props.historyData();
    } else {
      common.setAlertMessage("warn", response.message || "Error updating status");
    }
  } catch (err) {
    console.error("Error updating status", err);
    common.setAlertMessage("warn", "Exception occurred while updating status!");
  }
};

/* =========================================================
   DELETE VEHICLE (SOFT DELETE)
========================================================= */
export const deleteVehicle = async (
  vehicleId,
  setVehicleList,
  setConfirmModal,
  setSelectedVehicleId,
  setVehicleDetails
) => {
  setVehicleList((prevList) => {
    const index = prevList.findIndex((v) => v.vehicleId === vehicleId);
    const updatedList = prevList.filter((v) => v.vehicleId !== vehicleId);

    if (updatedList.length > 0) {
      const nextIndex = index >= updatedList.length ? updatedList.length - 1 : index;
      setSelectedVehicleId(updatedList[nextIndex].vehicleId);
    } else {
      setSelectedVehicleId(null);
      setVehicleDetails(null);
    }

    return updatedList;
  });

  setTimeout(() => setConfirmModal(false), 200);

  try {
    const response = await service.deleteVehicle(vehicleId);

    if (response.status === "success") {
      common.setAlertMessage("success", "Vehicle deleted successfully");
    } else {
      common.setAlertMessage("warn", response.message || "Something went wrong!");
    }
  } catch (err) {
    console.error("Error deleting vehicle", err);
    common.setAlertMessage("warn", "Exception occurred while deleting vehicle!");
  }
};
