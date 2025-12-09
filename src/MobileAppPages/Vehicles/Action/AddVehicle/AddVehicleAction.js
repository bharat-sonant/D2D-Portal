import * as common from "../../../../common/common";
import * as service from "../../Services/VehicleService/VehicleService";

export const handleChange = (type, value, setVehicleName, setError) => {
    if (type === "name") {
        setVehicleName(value);

        if (value.trim() === "") {
            setError("Please provide vehicle name.");
        } else {
            setError("");
        };
    };
};

export const handleSave = (vehicleName, setError, setLoader, setVehicleName, setShowModal, setVehicleList, vehicleId) => {
    if (vehicleName.trim() === "") {
        setError("Please provide vehicle name.");
        return;
    };
    setLoader(true);
    service.saveVehicleData(vehicleName, "").then((response) => {
        if (response.status === 'success') {
            setLoader(false);
            handleClearAll(setVehicleName, setError);
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
                            vehicleId: response.data.vehicleId,
                            name: vehicleName,
                            status: "active"
                        },
                        ...prev
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

            // if (vehicleId) {
            //     setSelectedTask((prev) => ({
            //         ...prev,
            //         name: displayName
            //     }));
            // }
            setShowModal(false);
            common.setAlertMessage('success', 'Vehicle data saved successfully.');
        } else {
            setLoader(false);
        }
    });
};

export const handleClearAll = (setVehicleName, setError) => {
    setVehicleName('');
    setError('');
};