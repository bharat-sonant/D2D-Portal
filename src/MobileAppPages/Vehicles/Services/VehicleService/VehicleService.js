import { supabase } from "../../../../createClient";
import * as common from "../../../../../src/common/common";

/* =========================================================
   VEHICLE SERVICE - SUPABASE BASED
========================================================= */

/**
 * Add a new vehicle
 */
export const addVehicle = async ({ vehicles_No, chassis_no , city_id, created_by = "Admin" }) => {
  try {
    if (!vehicles_No || !city_id) {
      return common.setResponse("fail", "Invalid params", { vehicles_No, city_id });
    }

    const { data, error } = await supabase
      .from("Vehicle")
      .insert([{ vehicles_No, chassis_no, city_id, created_by, status: "active" }])
      .select()
      .single();

    if (error) {
      return common.setResponse("fail", "Error while adding vehicle", error);
    }

    return common.setResponse("success", "Vehicle added successfully", data);

  } catch (error) {
    return common.setResponse("fail", "Unexpected error while adding vehicle", error);
  }
};

/**
 * Get all vehicles
 */
export const getAllVehicles = async () => {
  try {
    const { data, error } = await supabase
      .from("Vehicle")
      .select("*")
      .order("vehicles_No", { ascending: true });

    if (error) return common.setResponse("fail", "Error fetching vehicles", error);
    if (!data || data.length === 0) return common.setResponse("fail", "No vehicles found", []);

    return common.setResponse("success", "Vehicles fetched successfully", data);

  } catch (error) {
    return common.setResponse("fail", "Unexpected error while fetching vehicles", error);
  }
};

/**
 * Get single vehicle details by ID
 */
export const getVehicleById = async (vehicleId) => {
  try {
    if (!vehicleId) return common.setResponse("fail", "Invalid vehicleId");

    const { data, error } = await supabase
      .from("Vehicle")
      .select("*")
      .eq("id", vehicleId)
      .single();

    if (error) return common.setResponse("fail", "Error fetching vehicle details", error);

    return common.setResponse("success", "Vehicle details fetched", data);

  } catch (error) {
    return common.setResponse("fail", "Unexpected error while fetching vehicle details", error);
  }
};

/**
 * Update vehicle data
 */
export const updateVehicle = async (vehicleId, updateData) => {
  try {
    if (!vehicleId || !updateData) return common.setResponse("fail", "Invalid params");

    const { data, error } = await supabase
      .from("Vehicle")
      .update(updateData)
      .eq("id", vehicleId)
      .select()
      .single();

    if (error) return common.setResponse("fail", "Error updating vehicle", error);

    return common.setResponse("success", "Vehicle updated successfully", data);

  } catch (error) {
    return common.setResponse("fail", "Unexpected error while updating vehicle", error);
  }
};

/**
 * Soft delete vehicle (mark inactive)
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    if (!vehicleId) return common.setResponse("fail", "Invalid vehicleId");

    const { data, error } = await supabase
      .from("Vehicle")
      .update({ status: "deleted" })
      .eq("id", vehicleId)
      .select()
      .single();

    if (error) return common.setResponse("fail", "Error deleting vehicle", error);

    return common.setResponse("success", "Vehicle deleted successfully", data);

  } catch (error) {
    return common.setResponse("fail", "Unexpected error while deleting vehicle", error);
  }
};

/**
 * Change vehicle status (active/inactive)
 */
export const changeVehicleStatus = async (vehicleId, status) => {
  try {
    if (!vehicleId || !status) return common.setResponse("fail", "Invalid params");

    const { data, error } = await supabase
      .from("Vehicle")
      .update({ status })
      .eq("id", vehicleId)
      .select()
      .single();

    if (error) return common.setResponse("fail", "Error updating vehicle status", error);

    return common.setResponse("success", "Vehicle status updated", data);

  } catch (error) {
    return common.setResponse("fail", "Unexpected error while updating vehicle status", error);
  }
};
