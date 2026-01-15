
import { setAlertMessage } from '../../common/common';
import  * as sbs from  '../../services/supabaseServices'
import dayjs from 'dayjs';

export const uploadWardBoundaryJson = (
  file,
  setWardBoundaryGeoJsonData,
  setIsWardBoundaryMapPopupOpen,
  setHoldArray
) => {
  if (!file) return;

  const reader = new FileReader();
 

  reader.onload = async (e) => {
    try {
      const geojson = JSON.parse(e.target.result);

      // 1️⃣ Basic validation
      if (
        geojson.type !== "FeatureCollection" ||
        !geojson.features?.length
      ) {
     
       setAlertMessage('error',"Invalid GeoJSON");
        return;
      }

      const feature = geojson.features[0];

      if (feature.geometry.type !== "Polygon") {
       setAlertMessage('error',"Only Polygon supported");
        return;
      }

      const coordinates = feature.geometry.coordinates[0]; // outer ring

      /**
       * 2️⃣ MAP USE (Google Maps Polygon)
       * GeoJSON: [lng, lat]
       * Google Maps: { lat, lng }
       */
      const polygonPaths = coordinates.map(([lng, lat]) => ({
        lat,
        lng,
      }));

      // 👉 THIS is what map will consume
      setWardBoundaryGeoJsonData(polygonPaths);
        setIsWardBoundaryMapPopupOpen(true)
      /**
       * 3️⃣ STORAGE USE (your existing format)
       */
     setHoldArray(coordinates)

    } catch (err) {
       setAlertMessage('error',"Invalid GeoJSON");
    }
  };

  reader.readAsText(file);
};


export const saveWardBoundaryGeojsonInDb=async (wardId,cityId,holdArray,setHoldArray,setIsWardBoundaryMapPopupOpen)=>{
      const loggedInUserName = localStorage.getItem("name");
        const points = holdArray.map(([lng, lat]) => [
        String(lat),
        String(lng),
      ]);

      const parsedData = { points };
      const jsonString = JSON.stringify(parsedData, null, 2);

      const jsonFile = new File(
        [jsonString],
        `ward_${wardId}_points.json`,
        { type: "application/json" }
      );

      const filePath = `city_${cityId}/WardBoundaries/ward_${wardId}/${dayjs().format(
        "YYYY-MM-DD"
      )}`;

      await sbs.uploadAttachment(jsonFile, "WardMaps", filePath);

      const tableData = {
        ward_id: wardId,
        boundary_updated_at: dayjs().format("YYYY-MM-DD"),
        updated_by: loggedInUserName,
      };
      await sbs.upsertByConflictKeys("WardsBoundaries", tableData,"ward_id,boundary_updated_at");
      setIsWardBoundaryMapPopupOpen(false)
      setAlertMessage('success','Ward boundary updated successfully')
      setHoldArray([])
}

export const uploadWardMapJson=(file,setWardMapGeoJsonData,setIsWardLinePopOpen,setHoldArray)=>{
  
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const geoJson = JSON.parse(e.target.result);
       console.log(geoJson)
      // basic validation
      if (!geoJson.features || !Array.isArray(geoJson.features)) {
        setAlertMessage('error',"Invalid GeoJSON file");
        return;
      }

      convertWardGeoJSON(geoJson,setWardMapGeoJsonData,setIsWardLinePopOpen,setHoldArray);
    } catch (err) {
      setAlertMessage('error',"Invalid GeoJSON file");
    }
  };

  reader.readAsText(file);
}


export async function convertWardGeoJSON(
  geoJson,
  setWardMapGeoJsonData,
  setIsWardLinePopOpen,
  setHoldArray
) {
  let totalWardLength = 0;
  let lineIndex = 1;
  

  const polylinePaths = []; // 👉 MAP use

  const output = {}; // 👉 STORAGE use

  geoJson.features.forEach((feature) => {
    if (!feature.geometry || feature.geometry.type !== "LineString") return;

    /**
     * GeoJSON → lat/lng points
     */
    const points = feature.geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );

    const lineLength = calculateLineLength(points);
    totalWardLength += lineLength;

    // ✅ MAP: Polyline path
    polylinePaths.push(
      points.map(([lat, lng]) => ({ lat, lng }))
    );

    // ✅ STORAGE: same as before
    output[lineIndex] = {
      points,
      Houses: [],
      lineLength,
    };

    lineIndex++;
  });

  output.totalLines = lineIndex - 1;
  output.totalWardLength = totalWardLength;
  output.totalHouseCount = 0;

  // 👉 MAP STATE (Polyline paths)
  setHoldArray(output)
  setWardMapGeoJsonData(polylinePaths);
  setIsWardLinePopOpen(true)
  
 

}

export const saveWardMapData=async (wardId,cityId,HoldArray,setHoldArray,setIsWardLinePopOpen,setPreviousMapList)=>{
 
  const loggedInUserName = localStorage.getItem("name");
    const jsonString = JSON.stringify(HoldArray, null, 2);
  const jsonFile = new File(
    [jsonString],
    `ward_${wardId}_points.json`,
    { type: "application/json" }
  );

  const filePath = `city_${cityId}/WardHouseLine/ward_${wardId}/${dayjs().format(
    "YYYY-MM-DD"
  )}`;
  
  await sbs.uploadAttachment(jsonFile, "WardMaps", filePath);

  const tableData = {
    ward_id: wardId,
    map_updated_at: dayjs().format("YYYY-MM-DD"),
    updated_by: loggedInUserName,
  };

  await sbs.upsertByConflictKeys("WardsMaps", tableData,"ward_id,map_updated_at");
  setIsWardLinePopOpen(false)
 setPreviousMapList((prev) => {
  const filtered = prev.filter(
    (item) => item.map_updated_at !== tableData.map_updated_at
  );

  return [tableData, ...filtered];
});

  setAlertMessage('success','Ward map updated successfully')
  setHoldArray([])

}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateLineLength(points) {
  let total = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lon1] = points[i];
    const [lat2, lon2] = points[i + 1];
    total += haversineDistance(lat1, lon1, lat2, lon2);
  }

  return Math.round(total);
}





export const getPrevousMapList=async (wardId,setPreviousMapList)=>{
    let response = await sbs.getDataByColumnName('WardsMaps','ward_id',wardId)
     if(response.success===true){
    
       setPreviousMapList(response.data)
     }
}

export const getSelectWardBoundaryAndLine = async (
  wardId,
  selectedCity,
  date,
  setWardBoundaryGeoJsonData,
  setWardMapGeoJsonData,
  setIsWardLinePopOpen
) => {
   let  boundaryData =[]
  const latestBoundary = await sbs.getLatestDate(wardId)
  if(latestBoundary.data!==null){
      boundaryData = await sbs.getGeoJsonFromStorage(
    `city_${selectedCity}/WardBoundaries/ward_${wardId}/${latestBoundary.data}`
  );
  }
  const linesData = await sbs.getGeoJsonFromStorage(
    `city_${selectedCity}/WardHouseLine/ward_${wardId}/${date}`
  );

  if (boundaryData?.points && Array.isArray(boundaryData.points)) {
    const polygonPath = boundaryData.points.map(([lat, lng]) => ({
      lat: Number(lat),
      lng: Number(lng),
    }));
    setWardBoundaryGeoJsonData(polygonPath);
  }
  if (linesData && typeof linesData === "object") {
    const polylinePaths = [];

    Object.keys(linesData).forEach((key) => {
      if (isNaN(key)) return; 

      const line = linesData[key];
      if (!line?.points) return;

      const path = line.points.map(([lat, lng]) => ({
        lat: Number(lat),
        lng: Number(lng),
      }));

      polylinePaths.push(path);
    });

    // 👉 This will be used directly in <Polyline />
    setWardMapGeoJsonData(polylinePaths);
  }

  // 4️⃣ Open popup
  setIsWardLinePopOpen(true);
};
