
import { setAlertMessage } from '../../common/common';
import * as sbs from '../../services/supabaseServices';
import dayjs from 'dayjs';

export const uploadWardBoundaryJson = (
  file,
  setWardBoundaryGeoJsonData,
  setIsWardBoundaryMapPopupOpen,
  setHoldArray
) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // ✅ Check custom format
      if (!data.points || !Array.isArray(data.points)) {
        setAlertMessage('error', "Invalid Ward Boundary File");
        return;
      }

      // ✅ Convert string to number
      const coordinates = data.points.map(([lat, lng]) => [
        parseFloat(lat),
        parseFloat(lng),
      ]);

      // ✅ Google Maps format
      const polygonPaths = coordinates.map(([lat, lng]) => ({
        lat,
        lng,
      }));

      setWardBoundaryGeoJsonData(polygonPaths);
      setIsWardBoundaryMapPopupOpen(true);
      setHoldArray(coordinates);

    } catch (err) {
      setAlertMessage('error', "Invalid JSON File");
    }
  };

  reader.readAsText(file);
};



export const saveWardBoundaryGeojsonInDb = async (wardId, cityId, holdArray, setHoldArray, setIsWardBoundaryMapPopupOpen) => {
  const loggedInUserName = localStorage.getItem("name");
  const points = holdArray.map(([lat, lng]) => [
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
  await sbs.upsertByConflictKeys("WardsBoundaries", tableData, "ward_id,boundary_updated_at");
  setIsWardBoundaryMapPopupOpen(false);
  setAlertMessage('success', 'Ward boundary updated successfully');
  setHoldArray([]);
};

export const uploadWardMapJson = (
  file,
  setWardMapGeoJsonData,
  setIsWardLinePopOpen,
  setHoldArray
) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const geoJson = JSON.parse(e.target.result);

      // ✅ Case 1: FeatureCollection
      if (geoJson.type === "FeatureCollection") {
        convertWardGeoJSON(
          geoJson,
          setWardMapGeoJsonData,
          setIsWardLinePopOpen,
          setHoldArray
        );
      }

      // ✅ Case 2: Direct LineString
      else if (geoJson.type === "LineString") {
        convertWardGeoJSON(
          {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: geoJson
              }
            ]
          },
          setWardMapGeoJsonData,
          setIsWardLinePopOpen,
          setHoldArray
        );
      }

      // ✅ Case 3: Custom single-line format: { points: [[lat, lng], ...] }
      else if (Array.isArray(geoJson.points)) {
        const points = geoJson.points.map(([lat, lng]) => [
          parseFloat(lat),
          parseFloat(lng),
        ]);

        const hasInvalidPoint = points.some(
          ([lat, lng]) => Number.isNaN(lat) || Number.isNaN(lng)
        );
        if (hasInvalidPoint || points.length < 2) {
          setAlertMessage('error', "Invalid Ward Map File");
          return;
        }

        const totalWardLength = calculateLineLength(points);
        const polylinePath = points.map(([lat, lng]) => ({ lat, lng }));

        const output = {
          1: {
            points,
            Houses: [],
            lineLength: totalWardLength,
          },
          totalLines: 1,
          totalWardLength,
          totalHouseCount: 0,
        };

        setWardMapGeoJsonData([polylinePath]);
        setHoldArray(output);
        setIsWardLinePopOpen(true);
      }

      // ✅ Case 4: Already saved ward-line format { "1": {points:...}, totalLines... }
      else if (geoJson && typeof geoJson === "object") {
        const numericKeys = Object.keys(geoJson).filter((key) => !isNaN(key));
        const polylinePaths = [];
        let totalWardLength = 0;
        let totalHouseCount = 0;
        const output = {};

        numericKeys.forEach((key, idx) => {
          const line = geoJson[key];
          if (!Array.isArray(line?.points)) return;

          const points = line.points.map(([lat, lng]) => [
            parseFloat(lat),
            parseFloat(lng),
          ]);

          const hasInvalidPoint = points.some(
            ([lat, lng]) => Number.isNaN(lat) || Number.isNaN(lng)
          );
          if (hasInvalidPoint || points.length < 2) return;

          const lineLength = Number(line?.lineLength) || calculateLineLength(points);
          const houses = Array.isArray(line?.Houses) ? line.Houses : [];
          totalWardLength += lineLength;
          totalHouseCount += houses.length;

          polylinePaths.push(points.map(([lat, lng]) => ({ lat, lng })));
          output[idx + 1] = {
            points,
            Houses: houses,
            lineLength,
          };
        });

        if (polylinePaths.length === 0) {
          setAlertMessage('error', "Unsupported GeoJSON Format");
          return;
        }

        output.totalLines = polylinePaths.length;
        output.totalWardLength = Number(geoJson.totalWardLength) || totalWardLength;
        output.totalHouseCount = Number(geoJson.totalHouseCount) || totalHouseCount;

        setWardMapGeoJsonData(polylinePaths);
        setHoldArray(output);
        setIsWardLinePopOpen(true);
      }

      else {
        setAlertMessage('error', "Unsupported GeoJSON Format");
      }

    } catch (err) {
      setAlertMessage('error', "Invalid JSON File");
    }
  };

  reader.readAsText(file);
};



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
  setHoldArray(output);
  setWardMapGeoJsonData(polylinePaths);
  setIsWardLinePopOpen(true);



}

export const saveWardMapData = async (wardId, cityId, HoldArray, setHoldArray, setIsWardLinePopOpen, setPreviousMapList, setSelectedDate) => {

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

  await sbs.upsertByConflictKeys("WardsMaps", tableData, "ward_id,map_updated_at");
  setIsWardLinePopOpen(false);
  setPreviousMapList((prev) => {
    const filtered = prev.filter(
      (item) => item.map_updated_at !== tableData.map_updated_at
    );

    return [tableData, ...filtered];
  });
  setSelectedDate(dayjs().format("YYYY-MM-DD"));
  setAlertMessage('success', 'Ward map updated successfully');
  setHoldArray([]);

};

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

export const getPrevousMapList = async (wardId, setPreviousMapList) => {
  const response = await sbs.getDataByColumnName("WardsMaps", "ward_id", wardId);
  if (response.success === true && Array.isArray(response.data)) {
    const sortedList = response.data
      .filter(item => item.map_updated_at)
      .sort(
        (a, b) =>
          new Date(b.map_updated_at) - new Date(a.map_updated_at)
      );
    setPreviousMapList(sortedList);
  }
};


export const getSelectWardBoundaryAndLine = async (
  wardId,
  selectedCity,
  date,
  setWardBoundaryGeoJsonData,
  setWardMapGeoJsonData,
  previoisMapList,
  setSelectedDate

) => {
  if (previoisMapList.length > 0 || date !== null) {
    let boundaryData = [];
    const latestBoundary = await sbs.getLatestDate(wardId);
    if (latestBoundary.data !== null) {
      boundaryData = await sbs.getGeoJsonFromStorage(
        `city_${selectedCity}/WardBoundaries/ward_${wardId}/${latestBoundary.data}`
      );
    }
    let latestDate = date !== null ? date : previoisMapList.reduce((latest, item) => { return !latest || new Date(item.map_updated_at) > new Date(latest) ? item.map_updated_at : latest; }, null);

    setSelectedDate(latestDate);
    const linesData = await sbs.getGeoJsonFromStorage(
      `city_${selectedCity}/WardHouseLine/ward_${wardId}/${latestDate}`
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

  }

};
