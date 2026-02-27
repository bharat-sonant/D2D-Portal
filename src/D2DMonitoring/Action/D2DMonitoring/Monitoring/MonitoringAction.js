import dayjs from "dayjs";
import { getWardDutyOnTimeFromDB } from "../../../Services/D2DMonitoringService/D2DMonitoringDutyIn"
import { getWardLineStatus } from "../../../Services/MapSectionService/MapSectionService";
import { calculateWardLineLengthInMeter } from "../../../../common/common";

export const getDutyInTime = (ward, setShowDutyInTime) => {
    try {
        const year = dayjs().format("YYYY");
        const month = dayjs().format("MMMM");
        const day = dayjs().format("YYYY-MM-DD");

        getWardDutyOnTimeFromDB(year, month, day, ward).then((response) => {
            if (response.status === "Success") {
                const data = response.data;
                // If dutyInTime contains multiple records (object), join all values with ", "
                if (data && typeof data === "object" && !Array.isArray(data)) {
                    const values = Object.values(data).filter(Boolean);
                    setShowDutyInTime(values.length > 0 ? values.join(", ") : "");
                } else if (Array.isArray(data)) {
                    setShowDutyInTime(data.filter(Boolean).join(", "));
                } else {
                    setShowDutyInTime(data || "");
                }
            } else {
                setShowDutyInTime("");
            };
        });
    } catch (error) {
        console.error("Error fetching Duty In Time: ", error);
        setShowDutyInTime("");
    };
};

const toSafeObject = (value) => (value && typeof value === "object" ? value : {});
const toFiniteNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};
const normalizeStatus = (value = "") => String(value).trim().toLowerCase().replace(/[\s_-]+/g, "");
const COMPLETED_STATUSES = new Set(["linecompleted", "completed", "done"]);

export const hasWardStatusCache = (lineStatusByWard, wardId) => {
    const status = toSafeObject(lineStatusByWard)?.[wardId];
    return status && typeof status === "object" && Object.keys(status).length > 0;
};

export const getCurrentWardLineStatus = (lineStatusByWard, wardId) => (
    toSafeObject(lineStatusByWard)?.[wardId] || {}
);

export const fetchWardLineStatusCacheForToday = async (wardList = []) => {
    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");

    const entries = await Promise.all(
        wardList.map(async (ward) => {
            const wardId = ward?.id;
            if (!wardId) return { wardId, statusByLine: {} };
            const resp = await getWardLineStatus(wardId, year, month, date);
            return {
                wardId,
                statusByLine: resp?.status === "success" ? (resp?.data || {}) : {},
            };
        })
    );

    const statusByWard = {};
    entries.forEach(({ wardId, statusByLine }) => {
        if (wardId && statusByLine && typeof statusByLine === "object" && Object.keys(statusByLine).length > 0) {
            statusByWard[wardId] = statusByLine;
        }
    });

    return statusByWard;
};

export const fetchSingleWardLineStatusForToday = async (wardId) => {
    if (!wardId) return null;
    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");

    const resp = await getWardLineStatus(wardId, year, month, date);
    if (resp?.status !== "success" || !resp?.data || typeof resp.data !== "object") return null;
    return Object.keys(resp.data).length > 0 ? resp.data : null;
};

export const getWardLengthMetrics = (selectedWardLineGeoJson) => {
    const allFeatures = Array.isArray(selectedWardLineGeoJson?.features) ? selectedWardLineGeoJson.features : [];

    if (!allFeatures.length) {
        return { totalMeter: 0, lineLengthMeterById: {} };
    }

    const lineLengthMeterById = {};
    let totalMeter = 0;

    allFeatures.forEach((feature, index) => {
        const lineId = String(index + 1);
        const featureLengthInMeter = calculateWardLineLengthInMeter({
            type: "FeatureCollection",
            features: [feature],
        });
        const safeLengthInMeter = Math.max(toFiniteNumber(featureLengthInMeter, 0), 0);
        lineLengthMeterById[lineId] = safeLengthInMeter;
        totalMeter += safeLengthInMeter;
    });

    return { totalMeter: Math.max(totalMeter, 0), lineLengthMeterById };
};

export const getCompletedLengthKm = (currentWardLineStatus, wardLengthMetrics) => {
    const lineLengthMeterById = wardLengthMetrics?.lineLengthMeterById || {};
    let completedMeter = 0;

    Object.entries(lineLengthMeterById).forEach(([lineId, lineLengthInMeter]) => {
        const status = normalizeStatus(currentWardLineStatus?.[lineId]);
        if (COMPLETED_STATUSES.has(status)) {
            completedMeter += Math.max(toFiniteNumber(lineLengthInMeter, 0), 0);
        }
    });

    return Math.max(completedMeter / 1000, 0);
};

export const getTotalWardLengthKm = (wardLengthMetrics, selectedWardLengthInMeter) => {
    const staticTotalKm = Math.max(toFiniteNumber(wardLengthMetrics?.totalMeter, 0) / 1000, 0);
    if (staticTotalKm > 0) return staticTotalKm;
    return Math.max(toFiniteNumber(selectedWardLengthInMeter, 0) / 1000, 0);
};

export const getZoneCoveragePercent = (completedLengthKm, totalWardLengthKm) => {
    const safeTotal = Math.max(toFiniteNumber(totalWardLengthKm, 0), 0);
    const safeCompleted = Math.max(toFiniteNumber(completedLengthKm, 0), 0);
    if (safeTotal <= 0) return 0;
    const rawPercent = (safeCompleted / safeTotal) * 100;
    return Math.max(0, Math.min(100, Math.round(rawPercent)));
};

export const getRemainingLengthKm = (totalWardLengthKm, completedLengthKm) => (
    Math.max(
        Math.max(toFiniteNumber(totalWardLengthKm, 0), 0) -
        Math.min(Math.max(toFiniteNumber(completedLengthKm, 0), 0), Math.max(toFiniteNumber(totalWardLengthKm, 0), 0)),
        0
    )
);

export const buildCoverageStateItems = ({ isWardMetricsLoading, zoneCoveragePercent, totalWardLengthKm, completedLengthKm, remainingLengthKm }) => ([
    {
        variant: "coverageProgress",
        label: "Zone Coverage",
        liveTag: isWardMetricsLoading ? "UPDATING..." : "LIVE TRACKING",
        graphPercent: Math.max(0, Math.min(100, toFiniteNumber(zoneCoveragePercent, 0))),
        percentText: `${Math.max(0, Math.min(100, toFiniteNumber(zoneCoveragePercent, 0)))}`,
        totalLabel: "TOTAL LENGTH",
        completedLabel: "COMPLETED",
        totalValue: `${Math.max(toFiniteNumber(totalWardLengthKm, 0), 0).toFixed(2)} km`,
        completedValue: `${Math.max(toFiniteNumber(completedLengthKm, 0), 0).toFixed(2)} km`,
        remainingValue: `${Math.max(toFiniteNumber(remainingLengthKm, 0), 0).toFixed(2)} km`,
        color: "#3f5efb",
    },
]);

const normalizeLineStatus = (status = "") => String(status).trim().toLowerCase();
export const getLineColorByStatus = (status, DEFAULT_LINE_STYLE) => {
    const normalizedStatus = normalizeLineStatus(status);
    if (normalizedStatus === "linecompleted") return "#22c55e";
    if (normalizedStatus === "skipped") return "#ef4444";
    return DEFAULT_LINE_STYLE.strokeColor;
};
