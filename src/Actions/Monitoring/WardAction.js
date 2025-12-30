import { getWardData } from "../../services/MonitoringServices/MonitoringServices";

export const getWardList = async (
  setSelectedWard,
  setWardList,
  selectedWard,
  setLoading,
  cityId
) => {
  try{
    setLoading(true);
    const response = await getWardData(cityId);

    if (response.status === 'success') {
      let currentSelected = response.data?.find(
        (item) => item?.id === selectedWard?.id
      );
      setSelectedWard(currentSelected || response.data[0]);
      setWardList(response.data);
    } else {
      setSelectedWard(null);
      setWardList([]);
    }
  }catch(error){
    setWardList([]);
    setSelectedWard(null)
  }finally{
    setLoading(false);
  }
};


export const filterWardAction=(wardList,searchTerm,setSelectedWard,selectedWard)=>{
    const term = searchTerm?.trim().toLowerCase();
    if (!term) {
        let currentSelected = wardList?.find(item=>item?.id===selectedWard?.id);
        setSelectedWard(currentSelected || wardList[0] || null);
        return wardList;
    }
    let list = wardList?.filter((item) => item?.name?.trim().toLowerCase().includes(term));
    let currentSelected = list?.find(item=>item?.id===selectedWard?.id);

    setSelectedWard(currentSelected || list[0] || null);

    return list;
}
