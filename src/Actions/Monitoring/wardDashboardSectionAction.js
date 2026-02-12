import { DailyWorkReportDataFromFirebase } from "../../services/ReportServices/DailyWorkReportService";
import * as sbs from "../../services/supabaseServices";

const getNow = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

export const getWardDailyWorkSummaryAction = async (date, ward, cityId) => {
  const start = getNow();
  try {
    if (!ward) return null;

    const response = await DailyWorkReportDataFromFirebase(date, [ward], cityId);
    if (
      response.status === "success" &&
      response.data &&
      response.data.length > 0
    ) {
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error("Ward daily summary error", error);
    return null;
  } finally {
    console.log(
      `[timing] getWardDailyWorkSummaryAction ward=${ward?.id} took ${(getNow() - start).toFixed(1)}ms`
    );
  }
};

export const getWardBoundryAction = async (cityId, wardId) => {
  const totalStart = getNow();
  try {
    const latestDateStart = getNow();
    const latestBoundary = await sbs.getLatestDate(wardId);
    console.log(
      `[timing] getLatestDate ward=${wardId} took ${(getNow() - latestDateStart).toFixed(1)}ms`
    );
    if (!latestBoundary?.data) {
      return {
        wardBoundaryGeoJsonData: null,
        wardLineGeoJsonData: null,
      };
    }

    const boundaryPath = `city_${cityId}/WardBoundaries/ward_${wardId}/${latestBoundary.data}`;
    const linePath = `city_${cityId}/WardHouseLine/ward_${wardId}/${latestBoundary.data}`;

    const storageFetchStart = getNow();
    const [boundryData, linesData] = await Promise.all([
      sbs.getGeoJsonFromStorage(boundaryPath).catch(() => null),
      sbs.getGeoJsonFromStorage(linePath).catch(() => null),
    ]);
    console.log(
      `[timing] getGeoJsonFromStorage (boundary+line) ward=${wardId} took ${(getNow() - storageFetchStart).toFixed(1)}ms`
    );

    let wardBoundaryGeoJsonData = null;
    let wardLineGeoJsonData = null;

    if (boundryData?.points && Array.isArray(boundryData.points)) {
      wardBoundaryGeoJsonData = boundryData.points.map(([lat, lng]) => ({
        lat: Number(lat),
        lng: Number(lng),
      }));
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

      wardLineGeoJsonData = polylinePaths;
    }

    return {
      wardBoundaryGeoJsonData,
      wardLineGeoJsonData,
    };
  } catch (error) {
    return {
      wardBoundaryGeoJsonData: null,
      wardLineGeoJsonData: null,
    };
  } finally {
    console.log(
      `[timing] getWardBoundryAction ward=${wardId} took ${(getNow() - totalStart).toFixed(1)}ms`
    );
  }
};

export const getWardDashboardDataAction = async ({ date, ward, cityId }) => {
  const start = getNow();
  try {
    if (!ward || !cityId) {
      return {
        dutySummary: null,
        wardBoundaryGeoJsonData: null,
        wardLineGeoJsonData: null,
      };
    }

    const [dutySummary, boundaryData] = await Promise.all([
      getWardDailyWorkSummaryAction(date, ward, cityId),
      getWardBoundryAction(cityId, ward.id),
    ]);

    return {
      dutySummary,
      wardBoundaryGeoJsonData: boundaryData.wardBoundaryGeoJsonData,
      wardLineGeoJsonData: boundaryData.wardLineGeoJsonData,
    };
  } finally {
    console.log(
      `[timing] getWardDashboardDataAction ward=${ward?.id} took ${(getNow() - start).toFixed(1)}ms`
    );
  }
};
