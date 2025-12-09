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

export const handleSave = (vehicleName, setError, setLoader, setVehicleName, setShowModal) => {
    if (vehicleName.trim() === "") {
        setError("Please provide vehicle name.");
        return;
    };
    setLoader(true);
    service.saveVehicleData(vehicleName, "").then((response) => {
        if (response.status === 'success') {
            setLoader(false);
            handleClearAll(setVehicleName, setError);
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