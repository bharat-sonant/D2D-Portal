import { getAllWards } from "../../services/WardsServices/WardsService";

export const getAllWardsList = async (setWards) => {
    try {
        const response = await getAllWards();

        if (response?.status === "success" && Array.isArray(response?.data)) {
            const filteredWards = response.data.filter(
                (ward) => ward !== null && ward !== undefined && ward !== ""
            );
            setWards(filteredWards);
            return filteredWards; // ✅ Return the list
        } else {
            setWards([]);
            return [];
        }
    } catch (error) {
        console.error("Error fetching wards: - DailyAssignmentAction.js:18", error);
        setWards([]);
        return [];
    }
};
