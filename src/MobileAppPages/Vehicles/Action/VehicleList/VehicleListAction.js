import * as service from "../../Services/VehicleService/VehicleService"

export const getVehicles = (setVehicleList, setLoading) => {
    service.getAllVehicleData().then((resp) => {
        if (resp.status === 'success') {
            let vehicleList = [...resp.data];
            vehicleList.sort((a, b) => {
                if (a.status === "active" && b.status === "inactive") return -1;
                if (a.status === "inactive" && b.status === "active") return 1;
                return 0;
            });
            setVehicleList(vehicleList);
        } else {
            setVehicleList([]);
        };
        setLoading(false);
    });
}

export const vehicleDetails = (vehicleId, setVehicleDetails) => {
    service.getVehicleDetails(vehicleId).then((resp) => {
        if (resp.status === 'success') {
            setVehicleDetails(resp.data.details);
        } else {
            setVehicleDetails(null);
        };
    });
};