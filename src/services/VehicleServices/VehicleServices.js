import * as sbs from "../supabaseServices";

/**
 * Save a new vehicle
 */
export const saveVehicleData = async (vehicleDetail) => {
    const result = await sbs.saveData("Vehicle", vehicleDetail);
    if (result.success) {
        return { status: "success", message: "Vehicle saved successfully", data: result.data };
    } else {
        return { status: "error", message: result.error };
    }
};

/**
 * Update vehicle data
 */
export const updateVehicleData = async (vehicleId, vehicleDetail) => {
    if (!vehicleId) return { status: "error", message: "Vehicle id is required" };

    const result = await sbs.updateData("Vehicle", vehicleId, vehicleDetail);
    if (result.success) {
        return { status: "success", message: "Vehicle updated successfully", data: result.data };
    } else {
        return { status: "error", message: result.error };
    }
};

/**
 * Get all vehicles
 */
export const getVehicleData = async () => {
    const result = await sbs.getData("Vehicle");
    if (result.success) {
        const sortedData = [...result.data].sort((a, b) =>
            (a.vehicles_No || "").localeCompare(b.vehicles_No || "")
        );
        return { status: "success", message: "Vehicles fetched successfully", data: sortedData };
    } else {
        return { status: "error", message: result.error };
    }
};

/**
 * Update vehicle status (active/inactive)
 */
export const updateVehicleStatus = async (vehicleId, newStatus) => {
    if (!vehicleId) return { status: "error", message: "Vehicle id is required" };

    const result = await sbs.updateData("Vehicle", vehicleId, { status: newStatus });
    if (result.success) {
        return { status: "success", message: "Vehicle status updated successfully", data: result.data };
    } else {
        return { status: "error", message: result.error };
    }
};

/**
 * Delete vehicle
 */
export const deleteVehicleData = async (vehicleId) => {
    if (!vehicleId) return { status: "error", message: "Vehicle id is required" };

    const result = await sbs.deleteData("Vehicle", vehicleId);
    if (result.success) {
        return { status: "success", message: "Vehicle deleted successfully", data: result.data };
    } else {
        return { status: "error", message: result.error };
    }
};

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (vehicleId) => {
    if (!vehicleId) return { status: "error", message: "Vehicle id is required" };

    const result = await sbs.getDataByColumnName("Vehicle", "id", vehicleId);
    if (result.success) {
        return { status: "success", data: result.data };
    } else {
        return { status: "error", message: result.error };
    }
};
