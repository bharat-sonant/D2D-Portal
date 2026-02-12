import { getWardData } from "../../services/MonitoringServices/MonitoringServices";

export const getWardListAction = async (cityId, selectedWardId = null) => {
  try {
    const response = await getWardData(cityId);
    if (response.status !== "success" || !Array.isArray(response.data)) {
      return { wardList: [], selectedWard: null };
    }

    const wardList = response.data;
    const selectedWard =
      wardList.find((item) => item?.id === selectedWardId) || wardList[0] || null;

    return { wardList, selectedWard };
  } catch (error) {
    return { wardList: [], selectedWard: null };
  }
};

export const filterWardAction = (wardList = [], searchTerm = "") => {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return wardList;

  return wardList.filter((item) =>
    (item?.display_name || item?.name || "").toLowerCase().includes(term)
  );
};

