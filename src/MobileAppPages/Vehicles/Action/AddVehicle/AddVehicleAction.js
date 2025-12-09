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

export const handleSave = (vehicleName, setError, setLoader, setVehicleName, setShowModal, setVehicleList, vehicleId, setVehicleDetails, setVehicleId, historyData) => {
    if (vehicleName.trim() === "") {
        setError("Please provide vehicle name.");
        return;
    };
    setLoader(true);
    service.saveVehicleData(vehicleName, vehicleId).then((response) => {
        if (response.status === 'success') {
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

            if (vehicleId) {
                setVehicleDetails((prev) => ({
                    ...prev,
                    name: vehicleName
                }));
            }
            setShowModal(false);
            historyData();
            common.setAlertMessage('success', vehicleId ? "Vehicle data updated successfully." : 'Vehicle data saved successfully.');
        } else {
            setLoader(false);
        }
    });
};

export const handleClearAll = (setVehicleName, setError, setVehicleId) => {
    setVehicleName('');
    setError('');
    setVehicleId(null);
};

export const ActiveInactiveVehicles = (props, setToggle, toggle) => {
    const newStatus = toggle ? "inactive" : "active";

    setToggle(!toggle);

    service.activeInactiveVehicles(props.vehicleDetails.vehicleId, newStatus).then(() => {

        props.setVehicleDetails(prev => ({
            ...prev,
            status: newStatus
        }));

        props.setVehicleList(prev => {
            const updatedList = prev.map(item =>
                item.vehicleId === props.vehicleDetails.vehicleId
                    ? { ...item, status: newStatus }
                    : item
            );

            return updatedList.sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status === "active" ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
        });

        common.setAlertMessage('success', toggle ? 'Vehicle inactive successfully' : 'Vehicle active successfully');
        props.historyData();
    }).catch((err) => {
        console.log("Error updating status", err);
    });
};

export const deleteVehicle = (vehicleId, setVehicleList, setConfirmModal, setSelectedVehicleId, setVehicleDetails) => {

    setVehicleList(prevList => {
        const index = prevList.findIndex(v => v.vehicleId === vehicleId);
        const updatedList = prevList.filter(v => v.vehicleId !== vehicleId);
        if (updatedList.length > 0) {
            const nextIndex = index >= updatedList.length ? updatedList.length - 1 : index;
            setSelectedVehicleId(updatedList[nextIndex].taskId);
        } else {
            setSelectedVehicleId(null);
            setVehicleDetails(null);
        }
        return updatedList;
    });
    setTimeout(() => {
        setConfirmModal(false);
    }, 200);

    service.deleteInactiveVehicle(vehicleId).then((response) => {
        if (response.status === 'success') {
            common.setAlertMessage('success', 'Vehicle deleted successfully');
        } else {
            common.setAlertMessage('warn', "Something went wrong !!!");
        };
    });
};