import { ArrowRight } from "lucide-react";
import * as common from "../../common/common";
import * as service from "../../services/VehicleServices/VehicleServices";

/* =========================================================
   HANDLE INPUT CHANGE
========================================================= */
export const handleChange = (type, value, setVehicleName, setChassisNo, setError) => {
  if (type === "name") {
    setVehicleName(value);

    if (value.trim() === "") {
      setError("Please provide vehicle name.");
    } else {
      setError("");
    }
  } else if (type === "chassis") {
    setChassisNo(value);

    if (value.trim() === "") {
      setError("Please provide chassis number.");
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
  chassisNo,
  setError,
  setLoader,
  setVehicleName,
  setChassisNo,
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
  if (chassisNo.trim() === "") {
    setError("Please provide chassis number.");
    return;
  }

  setLoader(true);

  try {
    let response;

    if (vehicleId) {
      // UPDATE VEHICLE
      response = await service.updateVehicleData(vehicleId, {
        vehicles_No: vehicleName,
        chassis_no: chassisNo
      });
    } else {
      // ADD VEHICLE
      response = await service.saveVehicleData({
        vehicles_No: vehicleName,
        chassis_no: chassisNo,
        city_id: 1,
        created_by: 'Ansh'
      });
    }

    if (response.status === "success") {
      setLoader(false);
      handleClearAll(setVehicleName, setChassisNo, setError, setVehicleId);

      setVehicleList((prev) => {
        let updatedList;

        if (vehicleId) {
          updatedList = prev.map((item) =>
            item.id === vehicleId
              ? { ...item, name: vehicleName, chassis_no: chassisNo }
              : item
          );
        } else {
          updatedList = [
            {
              // Adjusting to match standard structure if needed, or rely on fetch
              id: response.data.id,
              vehicles_No: vehicleName,
              chassis_no: chassisNo,
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
          return (a.vehicles_No || a.name).localeCompare(b.vehicles_No || b.name);
        });
      });

      if (vehicleId) {
        setVehicleDetails((prev) => ({
          ...prev,
          vehicles_No: vehicleName,
          chassis_no: chassisNo,
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
export const handleClearAll = (setVehicleName, setChassisNo, setError, setVehicleId) => {
  setVehicleName("");
  if (setChassisNo) setChassisNo("");
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
    const response = await service.updateVehicleStatus(
      props.vehicleDetails.id,
      newStatus
    );

    if (response.status === "success") {
      props.setVehicleDetails((prev) => ({
        ...prev,
        status: newStatus,
      }));

      props.setVehicleList((prev) => {
        const updatedList = prev.map((item) =>
          item.id === props.vehicleDetails.id
            ? { ...item, status: newStatus }
            : item
        );

        return updatedList.sort((a, b) => {
          if (a?.status !== b?.status) return a?.status === "active" ? -1 : 1;
          return a?.vehicles_No.localeCompare(b?.vehicles_No);
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
    const index = prevList.findIndex((v) => v.id === vehicleId);
    const updatedList = prevList.filter((v) => v.id !== vehicleId);

    if (updatedList.length > 0) {
      const nextIndex = index >= updatedList.length ? updatedList.length - 1 : index;
      setSelectedVehicleId(updatedList[nextIndex].id);
    } else {
      setSelectedVehicleId(null);
      setVehicleDetails(null);
    }

    return updatedList;
  });

  setTimeout(() => setConfirmModal(false), 200);

  try {
    const response = await service.deleteVehicleData(vehicleId);

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

/* =========================================================
   FETCH ALL VEHICLES
========================================================= */
export const getVehicles = async (setVehicleList, setLoading) => {
  if (setLoading) setLoading(true);

  try {
    const resp = await service.getVehicleData();

    if (resp.status === "success") {
      // Map Supabase data to standard fields
      const vehicleList = resp.data
        .map((v) => ({
          id: v.id,
          vehicles_No: v.vehicles_No,
          chassis_no: v.chassis_no || "",  
          status: v.status,
        }))
        .sort((a, b) => {
          if (a.status === "active" && b.status === "inactive") return -1;
          if (a.status === "inactive" && b.status === "active") return 1;
          return a.vehicles_No.localeCompare(b.vehicles_No);
        });

      setVehicleList(vehicleList);
    } else {
      setVehicleList([]);
    }
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    setVehicleList([]);
  }

  if (setLoading) setLoading(false);
};

/* =========================================================
   FETCH VEHICLE DETAILS
========================================================= */
export const vehicleDetails = async (vehicleId, setVehicleDetails) => {
  if (!vehicleId) return;

  try {
    const resp = await service.getVehicleById(vehicleId);

    if (resp.status === "success") {
      // Return full vehicle details including chassis_no
      setVehicleDetails(resp.data);
    } else {
      setVehicleDetails(null);
    }
  } catch (err) {
    console.error("Error fetching vehicle details:", err);
    setVehicleDetails(null);
  }
};

/* =========================================================
   FORMAT HISTORY EVENTS
========================================================= */
export const formatEvent = (eventText) => {
  const getStatusColor = (status) => {
    if (!status) return "#333";
    return status.toLowerCase() === "active" ? "#10b981" : "#e11d48"; // green/red
  };

  // Vehicle Created
  if (/Vehicle Created/i.test(eventText)) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontWeight: "600", textTransform: "capitalize" }}>Vehicle Created</span>
      </div>
    );
  }

  // Vehicle Name Changed
  const nameMatch = eventText.match(/Vehicle name changed from (.*?) to (.*)/i);
  if (nameMatch) {
    const oldValue = nameMatch[1];
    const newValue = nameMatch[2];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "capitalize" }}>
        <span>Vehicle Update</span>
        <span style={{ color: "#666363ff" }}>{oldValue}</span>
        <ArrowRight size={18} />
        <span style={{ fontWeight: "600" }}>{newValue}</span>
      </div>
    );
  }

  // Vehicle Status Changed
  const statusMatch = eventText.match(/Vehicle status changed from (.*?) to (.*)/i);
  if (statusMatch) {
    const oldStatus = statusMatch[1];
    const newStatus = statusMatch[2];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "capitalize" }}>
        <span>Vehicle Status</span>
        <span style={{ fontWeight: "500", color: getStatusColor(oldStatus) }}>{oldStatus}</span>
        <ArrowRight size={18} />
        <span style={{ fontWeight: "600", color: getStatusColor(newStatus) }}>{newStatus}</span>
      </div>
    );
  }

  return eventText;
};

/* =========================================================
   FETCH VEHICLE HISTORY (optional)
========================================================= */
export const getHistoryData = async (vehicleId, setVehicleHistory) => {
  if (!vehicleId) return;

  // Uncomment and implement if history API is ready
  /*
  try {
      const resp = await service.getVehicleHistory(vehicleId);
      if (resp.status === "success") {
          setVehicleHistory(resp.data);
      } else {
          setVehicleHistory([]);
      }
  } catch (err) {
      console.error("Error fetching vehicle history:", err);
      setVehicleHistory([]);
  }
  */
};
