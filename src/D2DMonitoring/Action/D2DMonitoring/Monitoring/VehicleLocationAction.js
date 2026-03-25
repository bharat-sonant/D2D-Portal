import { getVehicleCurrentLocation } from "../../../Services/VehicleLocationService/VehicleLocationService";

export const subscribeVehicleLocationAction = (wardId, onUpdate) =>
    getVehicleCurrentLocation(wardId, onUpdate);
