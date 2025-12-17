import * as common from "../../../../common/common";
import * as service from "../../Services/VehicleService/VehicleService";

export const handleChange = (type, value, setVehicleName, setError, setChassisNumber) => {
    const normalizeSpace = (value) => value.replace(/\s+/g, " ").trimStart();
    const normalizeChassis = (val) => val.replace(/\s/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17);

    if (type === "name") {
        const formattedValue = normalizeSpace(value);
        setVehicleName(formattedValue);
        setError((prev) => ({ ...prev, vehicleName: formattedValue ? "" : "Please provide vehicle name." }));
    };

    if (type === "chassisNumber") {
        const formattedChassis = normalizeChassis(value);
        setChassisNumber(formattedChassis);
        let errorMsg = "";

        if (!formattedChassis) {
            errorMsg = "Please provide chassis number.";
        } else if (/[IOQ]/.test(formattedChassis)) {
            errorMsg = "Chassis number cannot contain I, O or Q.";
        } else if (formattedChassis.length < 17) {
            errorMsg = "Chassis number must be 17 characters long.";
        }
        setError((prev) => ({
            ...prev,
            chassisNumber: errorMsg,
        }));
    };
};

export const handleSave = (vehicleName, setError, setLoader, setVehicleName, setShowModal, setVehicleList, vehicleId, setVehicleDetails, setVehicleId, historyData, chassisNumber, setChassisNumber) => {

    const trimmedVehicleName = vehicleName?.trim();
    const trimmedChassisNumber = chassisNumber?.trim();

    let errors = {
        vehicleName: "",
        chassisNumber: ""
    };

    if (!trimmedVehicleName) {
        errors.vehicleName = "Please provide vehicle name.";
    }

    if (!trimmedChassisNumber) {
        errors.chassisNumber = "Please provide chassis number.";
    }

    setError(errors);

    if (errors.vehicleName || errors.chassisNumber) {
        return;
    }

    setLoader(true);
    service.saveVehicleData(vehicleName, chassisNumber, vehicleId).then((response) => {
        if (response.status === 'success') {
            setLoader(false);
            handleClearAll(setVehicleName, setError, setVehicleId, setChassisNumber);
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