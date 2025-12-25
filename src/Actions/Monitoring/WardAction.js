import { getWardData } from "../../services/MonitoringServices/MonitoringServices";

export const getWardList = async (
  setSelectedWard,
  setWardList,
  selectedWard
) => {
  const response = await getWardData();
  console.log('response',response)
  if (response.status === "success") {
    let currentSelected = response.data?.find(
      (item) => item?.CityId === selectedWard?.CityId
    );
    setSelectedWard(currentSelected || response.data[0]);
    setWardList(response.data);
  } else {
    setSelectedWard(null);
    setWardList([]);
  }
};
