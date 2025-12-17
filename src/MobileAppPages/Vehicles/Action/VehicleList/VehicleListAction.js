import { ArrowRight } from "lucide-react";
import * as service from "../../../../MobileAppPages/Vehicles/Services/VehicleService/VehicleService";

/* =========================
   Fetch all vehicles
========================= */
export const getVehicles = async (setVehicleList, setLoading) => {
  if (setLoading) setLoading(true);

  try {
    const resp = await service.getAllVehicles();

    if (resp.status === "success") {
      // Map Supabase data to standard fields
      const vehicleList = resp.data
        .map((v) => ({
          id: v.id,
          vehicles_No: v.vehicles_No,
          chassis_no: v.chassis_no || "",  // include chassis_no if exists
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

/* =========================
   Fetch vehicle details
========================= */
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

/* =========================
   Format history events
========================= */
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

/* =========================
   Fetch vehicle history (optional)
========================= */
export const getHistoryData = async (vehicleId, setVehicleHistory) => {
  if (!vehicleId) return;

  // Uncomment and implement if history API is ready
  /*
  try {
    const resp = await service.getVehicleUpdateHistory(vehicleId);
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
