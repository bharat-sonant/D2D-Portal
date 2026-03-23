import { subscribeVehicleLocation } from "../../../Services/VehicleLocationService/VehicleLocationService";

export const subscribeVehicleLocationAction = (wardId, onUpdate) =>
    subscribeVehicleLocation(wardId, onUpdate);
