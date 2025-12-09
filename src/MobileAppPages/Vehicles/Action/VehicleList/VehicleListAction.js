import { ArrowRight } from "lucide-react";
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

export const formatEvent = (eventText) => {
    const getStatusColor = (status) => {
        if (!status) return "#333";
        return status.toLowerCase() === "active" ? "#10b981" : "#e11d48"; // green / red
    };

    // --- Task Created Case ---
    const createdRegex = /Vehicle created(.*)/i;
    const createdMatch = eventText.match(createdRegex);

    if (createdMatch) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: "600", textTransform: "capitalize" }}>
                    Vehicle Created
                </span>
            </div>
        );
    }

    // --- Task Name Change ---
    const nameRegex = /Vehicle name changed from (.*?) to (.*)/i;
    const nameMatch = eventText.match(nameRegex);

    if (nameMatch) {
        const oldValue = nameMatch[1];
        const newValue = nameMatch[2];

        return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "capitalize" }}>
                <span>Vehicle Update</span>
                <span style={{ color: '#666363ff' }}>{oldValue}</span>
                <ArrowRight size={18} />
                <span style={{ fontWeight: "600" }}>{newValue}</span>
            </div>
        );
    }

    // --- Status Change ---
    const statusRegex = /Status changed from (.*?) to (.*)/i;
    const statusMatch = eventText.match(statusRegex);

    if (statusMatch) {
        const oldStatus = statusMatch[1];
        const newStatus = statusMatch[2];

        return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "capitalize" }}>
                <span>Vehicle status</span>

                <span style={{ fontWeight: "500", color: getStatusColor(oldStatus) }}>
                    {oldStatus}
                </span>

                <ArrowRight size={18} />

                <span style={{ fontWeight: "600", color: getStatusColor(newStatus) }}>
                    {newStatus}
                </span>
            </div>
        );
    }

    return eventText;
};

export const getHistoryData = (taskId, setVehicleHistory) => {
    service.getVehicleUpdateHistory(taskId).then((response) => {
        if (response.status === 'success') {
            setVehicleHistory(response.data)
        } else {
            setVehicleHistory([]);
        };
    });
};