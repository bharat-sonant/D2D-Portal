import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import {
  Truck,
  Clock,
  Users as UsersIcon,
  User as UserIcon,
  MapPin,
  Fuel,
  Wrench,
  Trophy,
  ArrowRight,
  LogOut,
  Flag,
} from "lucide-react";
import dayjs from "dayjs";
// import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import MapSection from "../../Components/D2DMonitoring/MapSection";

import { connectFirebase } from "../../../firebase/firebaseService";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import * as action from "../../Action/D2DMonitoring/Monitoring/MonitoringAction";
import { getWardListAction } from "../../Action/D2DMonitoring/Monitoring/WardListAction";
import { prefetchAllWardLines } from "../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import CompletionDashboard from "../../../components/CompletionDashboard/CompletionDashboard";
import HaltSummaryReplica from "../../../components/Monitoring/HaltSummaryReplica";
import vehicleGif from "../../../assets/images/icons/vehicle.gif";

// Component imports
import MonitoringSidebar from "../../Components/D2DMonitoring/MonitoringSidebar/MonitoringSidebar";
import LiveStatusBoard from "../../Components/D2DMonitoring/LiveStatusBoard/LiveStatusBoard";
import RemarksCard from "../../Components/D2DMonitoring/RemarksCard/RemarksCard";
import DutyComparisonReplica from "../../Components/D2DMonitoring/DutyComparisonReplica/DutyComparisonReplica";
import AppStatusModal from "../../Components/D2DMonitoring/Modals/AppStatusModal/AppStatusModal";
import VehicleJourneyModal from "../../Components/D2DMonitoring/Modals/VehicleJourneyModal/VehicleJourneyModal";
import TripExecutionModal from "../../Components/D2DMonitoring/Modals/TripExecutionModal/TripExecutionModal";
import VehicleAssignmentModal from "../../Components/D2DMonitoring/Modals/VehicleAssignmentModal/VehicleAssignmentModal";
import RemarkFormModal from "../../Components/D2DMonitoring/Modals/RemarkFormModal/RemarkFormModal";
import DutyCheckModal from "../../Components/D2DMonitoring/Modals/DutyCheckModal/DutyCheckModal";

import ZoneCoverageV2 from "../../Components/D2DMonitoring/ZoneCoverage/ZoneCoverageV2";
import ShiftStatusSection from "../../Components/D2DMonitoring/ShiftStatusSection";
// import ZoneCoverageV3 from "../../Components/D2DMonitoring/ZoneCoverage/ZoneCoverageV3";
// import ZoneCoverageV4 from "../../Components/D2DMonitoring/ZoneCoverage/ZoneCoverageV4";


const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const toStatusBadgeImage = (label, bg, fg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'><rect width='72' height='72' rx='12' fill='${bg}'/><text x='36' y='42' text-anchor='middle' font-size='13' font-family='Arial' font-weight='700' fill='${fg}'>${label}</text></svg>`,
  )}`;

const STATUS_IMAGE_BY_TYPE = {
  fuel: toStatusBadgeImage("FUEL", "#fff2f4", "#be185d"),
  dump: toStatusBadgeImage("DUMP", "#fff7ed", "#c2410c"),
  garage: toStatusBadgeImage("SERV", "#eef2ff", "#3730a3"),
  ward: toStatusBadgeImage("WARD", "#ecfdf5", "#047857"),
  transit: vehicleGif,
};

const getVehicleJourneyMeta = (rawStatus = "") => {
  const normalizedStatus = String(rawStatus || "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus.includes("petrol") ||
    normalizedStatus.includes("fuel") ||
    normalizedStatus.includes("pump")
  ) {
    return {
      title: toTitleCase(rawStatus || "Petrol Pump Stop"),
      description: "Stopped for refuelling",
      icon: Fuel,
      tone: "warning",
      imageSrc: STATUS_IMAGE_BY_TYPE.fuel,
    };
  }

  if (normalizedStatus.includes("dump")) {
    return {
      title: toTitleCase(rawStatus || "Dumping Yard Out"),
      description: "Vehicle is outside — returning to route",
      icon: Truck,
      tone: "danger",
      imageSrc: STATUS_IMAGE_BY_TYPE.dump,
    };
  }

  if (
    normalizedStatus.includes("garage") ||
    normalizedStatus.includes("service") ||
    normalizedStatus.includes("workshop")
  ) {
    return {
      title: toTitleCase(rawStatus || "Garage Stop"),
      description: "Vehicle is under inspection",
      icon: Wrench,
      tone: "neutral",
      imageSrc: STATUS_IMAGE_BY_TYPE.garage,
    };
  }

  if (
    normalizedStatus.includes("ward") ||
    normalizedStatus.includes("zone") ||
    normalizedStatus.includes("line")
  ) {
    return {
      title: toTitleCase(rawStatus || "In Ward"),
      description: "Collection is active on assigned route",
      icon: MapPin,
      tone: "success",
      imageSrc: STATUS_IMAGE_BY_TYPE.ward,
    };
  }

  return {
    title: toTitleCase(rawStatus || "Vehicle In Transit"),
    description: "Vehicle is moving on assigned route",
    icon: Truck,
    tone: "success",
    imageSrc: STATUS_IMAGE_BY_TYPE.transit,
  };
};

const getJourneyKindMeta = (kind = "") => {
  const normalized = String(kind || "")
    .trim()
    .toLowerCase();
  if (normalized.includes("fuel")) return { icon: Fuel, tone: "fuel" };
  if (normalized.includes("depart"))
    return { icon: ArrowRight, tone: "departed" };
  if (normalized.includes("exit")) return { icon: LogOut, tone: "exited" };
  if (normalized.includes("entry") || normalized.includes("enter"))
    return { icon: MapPin, tone: "entered" };
  if (normalized.includes("flag")) return { icon: Flag, tone: "checkpoint" };
  return { icon: MapPin, tone: "entered" };
};

const MonitoringList = () => {
  const { city } = useParams();
  const [wardList, setWardList] = useState([]);

  useEffect(() => {
    if (!city) return;
    getWardListAction(city).then((wards) => {
      setWardList(wards);
      if (wards.length > 0) setSelectedWard(wards[0]);
      prefetchAllWardLines(city, wards, (wardId, geoJson) => {
        setWardLinesGeoJsonById((prev) => ({ ...prev, [wardId]: geoJson }));
      });
      action.fetchWardLineStatusCacheForToday(wards).then((statusByWard) => {
        if (Object.keys(statusByWard || {}).length > 0) {
          setLineStatusByWard((prev) => ({ ...prev, ...statusByWard }));
        }
      });
    });
  }, [city]);
  const remarkTopicOptions = [
    "Performance Issue",
    "Route Observation",
    "Safety Alert",
    "Vehicle Issue",
    "Team Coordination",
    "Other",
  ];

  const [selectedWard, setSelectedWard] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(
    dayjs().format("DD MMM, hh:mm A"),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [activeStatusModal, setActiveStatusModal] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [dutyModal, setDutyModal] = useState(null); // "dutyIn" | "dutyOff" | null
  const [remarks, setRemarks] = useState([]);
  const [remarkForm, setRemarkForm] = useState({ topic: "", description: "" });
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showDutyInTime, setShowDutyInTime] = useState("");
  const [appStatusTab, setAppStatusTab] = useState("all");
  const [routeSnapshotView, setRouteSnapshotView] = useState("detail");
  const [selectedWardLengthInMeter, setSelectedWardLengthInMeter] = useState(0);
  const [wardLinesGeoJson, setWardLinesGeoJson] = useState(null);
  const [wardLinesGeoJsonById, setWardLinesGeoJsonById] = useState({});
  const [lineStatusByWard, setLineStatusByWard] = useState({});
  const [isWardMetricsLoading, setIsWardMetricsLoading] = useState(true);
  const [phoneClock, setPhoneClock] = useState(new Date());
  const [mapFocus, setMapFocus] = useState({
    id: "curr-halt",
    title: "Current Halt Location",
    subtitle: "Live halt point",
    address: "120/18, Bajaj Rd, Imam Ganj, Kalwaria Kunj, Sikar",
    lat: 27.6098,
    lng: 75.1412,
  });

  const [vehicleIssueRows, setVehicleIssueRows] = useState([
    { id: 1, vehicleNo: "COMP-5340", selected: false, reason: "" },
    { id: 2, vehicleNo: "COMP-6402", selected: false, reason: "" },
    { id: 3, vehicleNo: "COMP-9812", selected: false, reason: "" },
  ]);

  const [wardData] = useState({
    vehicleStatus: "Dumping Yard out",
    trips: 2,
    appStatus: "Opened",
    dutyOn: "8:37 AM",
    reachOn: "9:17 AM",
    lastLineTime: "14:02",
    finalPointReached: false,
    dutyOff: "---",
    lines: { total: 206, completed: 61, skipped: 0, current: 168 },
    halt: { total: "1:25", current: "0:00" },
    timeStats: { total: "5 hr 35 min", inZone: "3 hr 16 min" },
    kmStats: { total: "16.44 km", inZone: "7.37 km" },
    profiles: {
      driver: { name: "Sanwar Lal", phone: "8875907595", stars: 5 },
      helper: { name: "Dharamraj", phone: "8058224585", stars: 5 },
    },
    vehicleNumber: "LEY-AT-4602",
    vehicleJourney: {
      quickSummary: {
        fuelStops: 1,
        wardEntries: 5,
        inWard: "71m 32s",
        longestSession: "61m 32s",
      },
      routeSnapshot: [
        {
          id: "r1",
          time: "06:23",
          label: "Entered",
          duration: "1m",
          kind: "fuel_stop",
        },
        {
          id: "r2",
          time: "06:24",
          label: "Left",
          duration: "30s",
          kind: "departed",
        },
        {
          id: "r3",
          time: "06:24",
          label: "Entered",
          duration: "5m 30s",
          kind: "entered",
        },
        {
          id: "r4",
          time: "06:30",
          label: "Exited",
          duration: "30s",
          kind: "exited",
        },
        {
          id: "r5",
          time: "06:30",
          label: "Entered",
          duration: "3m 30s",
          kind: "entered",
        },
        {
          id: "r6",
          time: "06:34",
          label: "Exited",
          duration: "2m 30s",
          kind: "exited",
        },
        {
          id: "r7",
          time: "06:36",
          label: "Entered",
          duration: "",
          kind: "entered",
        },
      ],
      eventLog: [
        {
          id: "e1",
          title: "Petrol Pump Entered",
          description: "Stopped for refuelling",
          time: "06:23",
          tag: "Fuel Stop",
          duration: "1m",
          kind: "fuel_stop",
        },
        {
          id: "e2",
          title: "Petrol Pump Left",
          description: "Refuelling done, heading out",
          time: "06:24",
          tag: "Departed",
          duration: "30s",
          kind: "departed",
        },
        {
          id: "e3",
          title: "Ward Entered",
          description: "Inside ward - collecting",
          time: "06:24",
          tag: "In Ward",
          duration: "5m 30s",
          kind: "entered",
        },
        {
          id: "e4",
          title: "Ward Exited",
          description: "Collection done, moving on",
          time: "07:38",
          tag: "Out",
          duration: "30s",
          kind: "exited",
        },
        {
          id: "e5",
          title: "Ward Entered",
          description: "Inside ward - collecting",
          time: "07:38",
          tag: "In Ward",
          duration: "1m",
          kind: "entered",
        },
        {
          id: "e6",
          title: "Ward Exited",
          description: "Collection done, moving on",
          time: "07:39",
          tag: "Out",
          duration: "30s",
          kind: "exited",
        },
        {
          id: "e7",
          title: "Ward Entered",
          description: "Inside ward - collecting",
          time: "07:40",
          tag: "In Ward",
          duration: "Active now",
          kind: "entered",
        },
      ],
    },
    zones: { total: 74, completed: 31, active: 29, inactive: 9, stop: 5 },
    heroesOnWork: 89,
    garageDuty: "0/0",
    heroesDutyReplica: {
      dateLabel: dayjs().format("DD MMM, YYYY"),
      onFieldLabel: "On Field",
      driver: { lines: 72, field: "3h", rating: 5.0 },
      helper: { lines: 68, field: "3h", rating: 5.0 },
      summary: { tripsDone: 2, totalLines: 140, teamRating: 5.0 },
    },
  });

  const appSessionLogs = [
    { time: "12:52", status: "Opened", duration: "now", tone: "opened" },
    { time: "12:39", status: "Closed", duration: "13m 3s", tone: "closed" },
    { time: "12:38", status: "Minimized", duration: "31s", tone: "minimized" },
    { time: "12:33", status: "Opened", duration: "5m 8s", tone: "opened" },
    { time: "12:27", status: "Closed", duration: "6m 8s", tone: "closed" },
    { time: "12:26", status: "Minimized", duration: "35s", tone: "minimized" },
    { time: "10:55", status: "Opened", duration: "91m 41s", tone: "opened" },
    { time: "10:54", status: "Closed", duration: "13s", tone: "closed" },
    { time: "10:54", status: "Minimized", duration: "31s", tone: "minimized" },
    { time: "10:54", status: "Opened", duration: "-", tone: "opened" },
  ];

  const appOpenedCount = appSessionLogs.filter(
    (entry) => entry.tone === "opened",
  ).length;
  const appClosedCount = appSessionLogs.filter(
    (entry) => entry.tone === "closed",
  ).length;
  const filteredAppSessionLogs =
    appStatusTab === "all"
      ? appSessionLogs
      : appSessionLogs.filter((entry) =>
          appStatusTab === "opened"
            ? entry.tone === "opened"
            : entry.tone === "closed",
        );
  const phoneClockTime = dayjs(phoneClock).format("HH:mm");
  const phoneClockDate = dayjs(phoneClock).format("DD MMM");
  const vehicleJourneyMeta = getVehicleJourneyMeta(wardData.vehicleStatus);
  const vehicleJourneyData = wardData.vehicleJourney || {};
  const quickSummary = vehicleJourneyData.quickSummary || {};
  const routeSnapshot = vehicleJourneyData.routeSnapshot || [];
  const eventLog = vehicleJourneyData.eventLog || [];
  const statusSummaryText = String(wardData.vehicleStatus || "")
    .toLowerCase()
    .includes("dump")
    ? "outside dumping yard"
    : String(
        vehicleJourneyMeta.title || wardData.vehicleStatus || "in transit",
      ).toLowerCase();

  const summaryText = `Vehicle made <b>${quickSummary.wardEntries ?? 0}</b> ward entries & <b>${
    quickSummary.fuelStops ?? 0
  }</b> fuel stops · Spent <b>${quickSummary.inWard || "0m"}</b> inside wards · Longest session <b>${
    quickSummary.longestSession || "0m"
  }</b> · Currently <b>${statusSummaryText}</b>`;

  // Trip Status Logic
  const tripTotal = wardData.trips || 5;
  const tripCompleted = wardData.tripsDone || 2;
  const tripActive = tripTotal > tripCompleted ? 1 : 0;

  const getTripStatusTone = () => {
    if (tripCompleted === tripTotal) return "toneSuccess";
    if (tripActive > 0) return "toneWarning";
    return "toneDanger";
  };

  const appTone =
    wardData.appStatus === "Opened" ? "toneSuccess" : "toneDanger";
  const vehicleTone =
    vehicleJourneyMeta.tone === "danger"
      ? "toneDanger"
      : vehicleJourneyMeta.tone === "success"
        ? "toneSuccess"
        : "toneWarning";
  const routeQuickStats = [
    {
      key: "fuel",
      label: "Fuel Stop",
      value: quickSummary.fuelStops ?? 0,
      icon: <Fuel size={12} />,
    },
    {
      key: "entries",
      label: "Ward Entries",
      value: quickSummary.wardEntries ?? 0,
      icon: <MapPin size={12} />,
    },
    {
      key: "inward",
      label: "In Ward",
      value: quickSummary.inWard || "0m",
      icon: <Clock size={12} />,
    },
    {
      key: "longest",
      label: "Longest Stay",
      value: quickSummary.longestSession || "0m",
      icon: <Trophy size={12} />,
    },
  ];
  const routeSnapshotRows =
    eventLog.length > 0
      ? eventLog
      : routeSnapshot.map((item) => ({
          id: item.id,
          title: item.label,
          description: "",
          time: item.time,
          tag: item.label,
          duration: item.duration || "-",
          kind: item.kind,
        }));

  // Monitoring page always uses Sikar Firebase
  useEffect(() => {
    const initFirebase = async () => {
      const city = "Sikar";
      const firebaseConfig = getCityFirebaseConfig(city);
      connectFirebase(firebaseConfig, city);
    };
    initFirebase();
  }, []);

  useEffect(() => {
    if (!selectedWard?.id) return;
    action.getDutyInTime(selectedWard.id, setShowDutyInTime);
  }, [selectedWard?.id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPhoneClock(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const wardId = selectedWard?.id;
    if (!wardId) return;

    setIsWardMetricsLoading(true);

    const unsubscribe = action.subscribeWardLineStatusForToday(wardId, (statusByLine) => {
      setLineStatusByWard((prev) => ({ ...prev, [wardId]: statusByLine }));
      setLastRefreshed(dayjs().format("DD MMM, hh:mm A"));
      setIsWardMetricsLoading(false);
    });

    return unsubscribe;
  }, [selectedWard?.id]);

  const handleWardSelect = (ward) => {
    if (selectedWard?.id === ward.id) return;
    setDataLoading(true);
    setIsWardMetricsLoading(!lineStatusByWard?.[ward.id]);
    setSelectedWard(ward);
    setDataLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(dayjs().format("DD MMM, hh:mm A"));
    }, 800);
  };

  const getZoneLabel = (ward) => ward.name;

  const getProgressStyle = (progress = 0) => {
    if (progress < 30) {
      return {
        "--progressWidth": `${progress}%`,
        "--progressFill": "rgba(239, 68, 68, 0.16)",
        "--progressText": "#c24141",
        "--progressBg": "#fff6f6",
        "--progressBorder": "#ffd7d7",
      };
    }
    if (progress < 50) {
      return {
        "--progressWidth": `${progress}%`,
        "--progressFill": "rgba(249, 115, 22, 0.16)",
        "--progressText": "#c35a1f",
        "--progressBg": "#fff9f2",
        "--progressBorder": "#ffe1c3",
      };
    }
    if (progress < 70) {
      return {
        "--progressWidth": `${progress}%`,
        "--progressFill": "rgba(245, 158, 11, 0.15)",
        "--progressText": "#a87413",
        "--progressBg": "#fffdf4",
        "--progressBorder": "#fcebb8",
      };
    }
    return {
      "--progressWidth": `${progress}%`,
      "--progressFill": "rgba(34, 197, 94, 0.15)",
      "--progressText": "#228f50",
      "--progressBg": "#f5fdf8",
      "--progressBorder": "#ccefd9",
    };
  };

  const openNewRemarkModal = () => {
    setEditingRemarkId(null);
    setRemarkForm({ topic: "", description: "" });
    setShowRemarkModal(true);
  };

  const openEditRemarkModal = (item) => {
    setEditingRemarkId(item.id);
    setRemarkForm({ topic: item.topic, description: item.description });
    setShowRemarkModal(true);
  };

  const closeAllModals = () => {
    setActiveStatusModal(null);
    setShowVehicleModal(false);
    setShowRemarkModal(false);
    setShowTopicDropdown(false);
    setAppStatusTab("all");
    setDutyModal(null);
  };

  const handleShiftEventClick = (event) => {
    if (event.key === "dutyOn")  setDutyModal("dutyIn");
    if (event.key === "dutyOff") setDutyModal("dutyOff");
  };

  const handleRemarkSubmit = () => {
    const topic = remarkForm.topic.trim();
    const description = remarkForm.description.trim();
    if (!topic || !description) return;

    if (editingRemarkId) {
      setRemarks((prev) =>
        prev.map((item) =>
          item.id === editingRemarkId ? { ...item, topic, description } : item,
        ),
      );
    } else {
      setRemarks((prev) => [{ id: Date.now(), topic, description }, ...prev]);
    }
    closeAllModals();
  };

  const deleteRemark = (id) => {
    setRemarks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleVehicleIssueRowChange = (id, field, value) => {
    setVehicleIssueRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const currentShiftEvents = React.useMemo(
    () => [
      {
        key: "dutyOn",
        label: "Duty On",
        time: showDutyInTime,
        status: "completed",
      },
      {
        key: "reachOn",
        label: "Reached",
        time: "09:00 AM",
        status: "completed",
      },
      {
        key: "workStatus",
        label: "Working",
        time: "Live",
        status: "active",
        isLive: true,
      },
      { key: "dutyOff", label: "Off", time: "--:--", status: "pending" },
    ],
    [showDutyInTime],
  );

  const currentWardLineStatus = React.useMemo(
    () => action.getCurrentWardLineStatus(lineStatusByWard, selectedWard?.id),
    [lineStatusByWard, selectedWard?.id],
  );

  const wardLengthMetrics = React.useMemo(
    () => action.getWardLengthMetrics(wardLinesGeoJson),
    [wardLinesGeoJson],
  );

  const completedLengthKm = React.useMemo(() => {
    return action.getCompletedLengthKm(
      currentWardLineStatus,
      wardLengthMetrics,
    );
  }, [currentWardLineStatus, wardLengthMetrics]);

  const lineCounts = React.useMemo(
    () => action.getLineCounts(wardLengthMetrics, currentWardLineStatus),
    [wardLengthMetrics, currentWardLineStatus],
  );

  const totalWardLengthKm = React.useMemo(() => {
    return action.getTotalWardLengthKm(
      wardLengthMetrics,
      selectedWardLengthInMeter,
    );
  }, [wardLengthMetrics, selectedWardLengthInMeter]);

  const zoneCoveragePercent = React.useMemo(() => {
    return action.getZoneCoveragePercent(completedLengthKm, totalWardLengthKm);
  }, [completedLengthKm, totalWardLengthKm]);

  const wardCoverageById = React.useMemo(() => {
    const result = {};
    wardList.forEach((ward) => {
      const metrics = action.getWardLengthMetrics(wardLinesGeoJsonById[ward.id]);
      const lineStatus = lineStatusByWard[ward.id] || {};
      const completed = action.getCompletedLengthKm(lineStatus, metrics);
      const total = action.getTotalWardLengthKm(metrics, 0);
      result[ward.id] = action.getZoneCoveragePercent(completed, total);
    });
    return result;
  }, [wardList, wardLinesGeoJsonById, lineStatusByWard]);

  const remainingLengthKm = React.useMemo(
    () => action.getRemainingLengthKm(totalWardLengthKm, completedLengthKm),
    [totalWardLengthKm, completedLengthKm],
  );

  const stateItems = action.buildCoverageStateItems({
    isWardMetricsLoading,
    zoneCoveragePercent,
    totalWardLengthKm,
    completedLengthKm,
    remainingLengthKm,
  });
  const isCoverageReady =
    !isWardMetricsLoading && Array.isArray(stateItems) && stateItems.length > 0;
  const liquidCoveragePercent = isCoverageReady
    ? Math.max(0, Math.min(100, Number(zoneCoveragePercent) || 0))
    : 0;
  const liquidTotalKm = isCoverageReady
    ? Math.max(0, Number(totalWardLengthKm) || 0)
    : 0;
  const liquidCoveredKm = isCoverageReady
    ? Math.max(0, Number(completedLengthKm) || 0)
    : 0;
  const liquidLeftKm = isCoverageReady
    ? Math.max(0, Number(remainingLengthKm) || 0)
    : 0;
  const liquidTrackFillWidth =
    liquidCoveragePercent <= 0 ? 0 : Math.max(liquidCoveragePercent, 14);

  return (
    <div className={styles.realtimePage}>
      {/* Sidebar */}
      <MonitoringSidebar
        wardList={wardList}
        selectedWard={selectedWard}
        lastRefreshed={lastRefreshed}
        refreshing={refreshing}
        onWardSelect={handleWardSelect}
        onRefresh={handleRefresh}
        getZoneLabel={getZoneLabel}
        getProgressStyle={getProgressStyle}
        wardCoverageById={wardCoverageById}
      />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.layoutSplit}>
          <div className={styles.leftColumn}>

            <DutyComparisonReplica
              data={wardData}
              wardId={selectedWard?.id}
              onVehicleClick={() => setShowVehicleModal(true)}
            />

            <HaltSummaryReplica onMapFocusChange={setMapFocus} />
          </div>
          <div className={styles.dataRight}>
            <div className={styles.dataRightBottom}>
              <div className={styles.centerColumn}>
                <CompletionDashboard
                  totalLines={lineCounts.total}
                  completedLines={lineCounts.completed}
                  skippedLines={lineCounts.skipped}
                />

                <LiveStatusBoard
                  wardData={wardData}
                  vehicleTone={vehicleTone}
                  getTripStatusTone={getTripStatusTone}
                  appTone={appTone}
                  onVehicleClick={() => setActiveStatusModal("vehicle")}
                  onTripsClick={() => setActiveStatusModal("trips")}
                  onAppClick={() => setActiveStatusModal("app")}
                />

                <RemarksCard
                  remarks={remarks}
                  onAddRemark={openNewRemarkModal}
                  onEditRemark={openEditRemarkModal}
                  onDeleteRemark={deleteRemark}
                />
              </div>
              <div className={styles.mapColumn}>
                {/* <MonitoringCard
                  title="Zone Coverage"
                  icon={<Activity size={18} />}
                  className={styles.fullWidthZoneCard}
                >
                  <div className={styles.statsFourAcross}>
                    <StateItem items={stateItems} />
                  </div>
                </MonitoringCard> */}

                <ZoneCoverageV2 items={stateItems} />

                <ShiftStatusSection
                  events={currentShiftEvents}
                  activeConnectorIndex={1}
                  showDutyInTime={showDutyInTime}
                  onEventClick={handleShiftEventClick}
                />
                <MapSection
                  city={city}
                  selectedWard={selectedWard}
                  onWardLengthResolved={setSelectedWardLengthInMeter}
                  onWardLinesResolved={setWardLinesGeoJson}
                  lineStatusByLine={currentWardLineStatus}
                  focusLocation={mapFocus}
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Duty In / Duty Off Modal */}
      {dutyModal && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <DutyCheckModal
            type={dutyModal}
            time={showDutyInTime}
            wardName={selectedWard?.name}
            onClose={closeAllModals}
            onSubmit={closeAllModals}
          />
        </div>
      )}

      {/* Modals */}
      {(activeStatusModal || showRemarkModal || showVehicleModal) && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          {showVehicleModal ? (
            <VehicleAssignmentModal
              vehicleIssueRows={vehicleIssueRows}
              onRowChange={handleVehicleIssueRowChange}
              onSubmit={closeAllModals}
              onClose={closeAllModals}
            />
          ) : activeStatusModal === "app" ? (
            <div
              className={`${styles.modalContent} ${styles.appStatusModal} ${styles.appStatusModalPlain}`}
              onClick={(e) => e.stopPropagation()}
            >
              <AppStatusModal
                appSessionLogs={appSessionLogs}
                appOpenedCount={appOpenedCount}
                appClosedCount={appClosedCount}
                appStatusTab={appStatusTab}
                filteredAppSessionLogs={filteredAppSessionLogs}
                phoneClockTime={phoneClockTime}
                phoneClockDate={phoneClockDate}
                onTabChange={setAppStatusTab}
                onClose={closeAllModals}
              />
            </div>
          ) : activeStatusModal === "trips" ? (
            <TripExecutionModal
              wardData={wardData}
              tripCompleted={tripCompleted}
              tripActive={tripActive}
              onClose={closeAllModals}
            />
          ) : activeStatusModal === "vehicle" ? (
            <VehicleJourneyModal
              wardData={wardData}
              vehicleJourneyMeta={vehicleJourneyMeta}
              routeQuickStats={routeQuickStats}
              routeSnapshotRows={routeSnapshotRows}
              routeSnapshotView={routeSnapshotView}
              summaryText={summaryText}
              onRouteSnapshotViewToggle={() =>
                setRouteSnapshotView((prev) =>
                  prev === "detail" ? "compact" : "detail",
                )
              }
              onClose={closeAllModals}
            />
          ) : (
            <RemarkFormModal
              remarkForm={remarkForm}
              editingRemarkId={editingRemarkId}
              showTopicDropdown={showTopicDropdown}
              remarkTopicOptions={remarkTopicOptions}
              onTopicDropdownToggle={() =>
                setShowTopicDropdown(!showTopicDropdown)
              }
              onTopicSelect={(item) => {
                setRemarkForm({ ...remarkForm, topic: item });
                setShowTopicDropdown(false);
              }}
              onDescriptionChange={(value) =>
                setRemarkForm({ ...remarkForm, description: value })
              }
              onSubmit={handleRemarkSubmit}
              onClose={closeAllModals}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MonitoringList;
