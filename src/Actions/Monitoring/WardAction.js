import { getDutySummary, getWardBoundryJson, getWardData } from "../../services/MonitoringServices/MonitoringServices";
import { DailyWorkReportDataFromFirebase } from "../../services/ReportServices/DailyWorkReportService";
import * as sbs from '../../services/supabaseServices';

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
    // const term = searchTerm?.trim().toLowerCase();
    // if (!term) {
        let currentSelected = wardList?.find(item=>item?.id===selectedWard?.id);
        setSelectedWard(currentSelected || wardList[0] || null);
        return wardList;
    // }
    // let list = wardList?.filter((item) => item?.name?.trim().toLowerCase().includes(term));
    // let currentSelected = list?.find(item=>item?.id===selectedWard?.id);

    // setSelectedWard(currentSelected || list[0] || null);

    // return list;
}

export const getWardDailyWorkSummaryAction = async( date, ward,cityId, setLoading) => {
  try{
    setLoading(true);
    if(!ward) return null;

    const response = await DailyWorkReportDataFromFirebase(date, [ward], cityId);
    if (
      response.status === 'success' &&
      response.data &&
      response.data.length > 0
    ) {
      return response.data[0]; // ✅ single ward summary
    }

    return null;
  }catch(error){
    console.error('Ward daily summary error', error);
    return null;
  } finally {
    setLoading(false);
  }
}

export const getWardBoundryAction = async(cityId, wardId, setWardBoundaryGeoJsonData,setWardLineGeoJsonData, setBoundryLoading) => {
  setBoundryLoading(true);
  try{
    const latestBoundary = await sbs.getLatestDate(wardId);
    let boundryData = null;
    let linesData = null;

    if(latestBoundary?.data){
      boundryData = await sbs.getGeoJsonFromStorage(`city_${cityId}/WardBoundaries/ward_${wardId}/${latestBoundary?.data}`)

      linesData = await sbs.getGeoJsonFromStorage(
      `city_${cityId}/WardHouseLine/ward_${wardId}/${latestBoundary?.data}`
    );
    }
    //ward boundry -> polygon
    if(boundryData?.points && Array.isArray(boundryData?.points)){
      const polygonPath = boundryData?.points?.map(([lat,lng]) => ({
        lat : Number(lat),
        lng : Number(lng)
      }))
      setWardBoundaryGeoJsonData(polygonPath)
    }else{
      setWardBoundaryGeoJsonData(null)
    }

    //ward lines -> polylines
  if(linesData && typeof linesData === 'object') {
    const polylinePaths = [];

    Object.keys(linesData).forEach((key) => {
      if(isNaN(key)) return;

      const line = linesData[key];
      if(!line?.points) return;

      const path = line.points.map(([lat, lng]) => ({
        lat : Number(lat),
        lng : Number(lng),
      }));

      polylinePaths.push(path);
    });
    setWardLineGeoJsonData(polylinePaths);
  }

  }catch(error){
    setWardBoundaryGeoJsonData(null);
  }finally{
    setBoundryLoading(false)
  }
}