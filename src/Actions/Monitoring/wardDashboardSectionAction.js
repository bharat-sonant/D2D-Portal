import { DailyWorkReportDataFromFirebase } from "../../services/ReportServices/DailyWorkReportService";
import * as sbs from "../../services/supabaseServices";

export const getWardDailyWorkSummaryAction = async (date, ward, cityId) => {
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
    return null;
  }
};

export const getWardBoundryAction = async (cityId, wardId) => {
  try {
    const latestBoundary = await sbs.getLatestDate(wardId);
    if (!latestBoundary?.data) {
      return {
        wardBoundaryGeoJsonData: null,
        wardLineGeoJsonData: null,
      };
    }

    const boundaryPath = `city_${cityId}/WardBoundaries/ward_${wardId}/${latestBoundary.data}`;
    const linePath = `city_${cityId}/WardHouseLine/ward_${wardId}/${latestBoundary.data}`;

    const [boundryData, linesData] = await Promise.all([
      sbs.getGeoJsonFromStorage(boundaryPath).catch(() => null),
      sbs.getGeoJsonFromStorage(linePath).catch(() => null),
    ]);

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
  }
};

export const getWardDashboardDataAction = async ({ date, ward, cityId }) => {
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
  } catch (error) {
    return {
      dutySummary: null,
      wardBoundaryGeoJsonData: null,
      wardLineGeoJsonData: null,
    };
  }
};
