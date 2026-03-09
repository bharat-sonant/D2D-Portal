import React, { useState, useEffect } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import {
  Activity,
  Truck,
  Clock,
  Zap,
  TrendingUp,
  Users as UsersIcon,
  Plus,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  Phone,
  X,
  MapPin,
  Fuel,
  Wrench,
  Trophy,
  ArrowRight,
  LogOut,
  Flag,
  Pencil,
  Trash2,
  UserStar,
} from "lucide-react";
import dayjs from "dayjs";
import Chetan from "../../../assets/images/Chetan.jpeg";
// import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import MapSection from "../../Components/D2DMonitoring/MapSection";
import ShiftStatusSection from "../../Components/D2DMonitoring/ShiftStatusSection";
import { connectFirebase } from "../../../firebase/firebaseService";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";
import * as action from "../../Action/D2DMonitoring/Monitoring/MonitoringAction";
import StateItem from "../../Components/D2DMonitoring/StateItem";
import ward1Line from "../../../assets/Sikar/WardLines/1.json";
import ward2Line from "../../../assets/Sikar/WardLines/2.json";
import ward3Line from "../../../assets/Sikar/WardLines/3.json";
import ward4Line from "../../../assets/Sikar/WardLines/4.json";
import ward5Line from "../../../assets/Sikar/WardLines/5.json";
import CompletionDashboard from "../../../components/CompletionDashboard/CompletionDashboard";
import HaltSummaryReplica from "../../../components/Monitoring/HaltSummaryReplica";
import vehicleGif from "../../../assets/images/icons/vehicle.gif";

const wardLinesById = {
  1: ward1Line,
  2: ward2Line,
  3: ward3Line,
  4: ward4Line,
  5: ward5Line,
};

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
  const [wardList] = useState([
    { id: 1, name: "Ward 1", progress: 25 },
    { id: 2, name: "Ward 2", progress: 40 },
    { id: 3, name: "Ward 3", progress: 65 },
    { id: 4, name: "Ward 4", progress: 80 },
    { id: 5, name: "Ward 5", progress: 95 },
  ]);
  const remarkTopicOptions = [
    "Performance Issue",
    "Route Observation",
    "Safety Alert",
    "Vehicle Issue",
    "Team Coordination",
    "Other",
  ];

  const [selectedWard, setSelectedWard] = useState(wardList[0]);
  const [lastRefreshed, setLastRefreshed] = useState(
    dayjs().format("DD MMM, hh:mm A"),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [activeStatusModal, setActiveStatusModal] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [remarks, setRemarks] = useState([]);
  const [remarkForm, setRemarkForm] = useState({ topic: "", description: "" });
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showDutyInTime, setShowDutyInTime] = useState("");
  const [appStatusTab, setAppStatusTab] = useState("all");
  const [routeSnapshotView, setRouteSnapshotView] = useState("detail");
  const [selectedWardLengthInMeter, setSelectedWardLengthInMeter] = useState(0);
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
  const routeQuickStats = [
    { key: "fuel", label: "Fuel Stop", value: quickSummary.fuelStops ?? 0, icon: <Fuel size={12} /> },
    { key: "entries", label: "Ward Entries", value: quickSummary.wardEntries ?? 0, icon: <MapPin size={12} /> },
    { key: "inward", label: "In Ward", value: quickSummary.inWard || "0m", icon: <Clock size={12} /> },
    { key: "longest", label: "Longest Stay", value: quickSummary.longestSession || "0m", icon: <Trophy size={12} /> },
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
    let isMounted = true;
    const selectedWardId = selectedWard?.id;
    if (!selectedWardId)
      return () => {
        isMounted = false;
      };

    if (action.hasWardStatusCache(lineStatusByWard, selectedWardId)) {
      setIsWardMetricsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsWardMetricsLoading(true);

    action
      .fetchWardLineStatusCacheForToday(wardList)
      .then((nextStatusByWard) => {
        if (!isMounted) return;
        if (Object.keys(nextStatusByWard || {}).length > 0) {
          setLineStatusByWard((prev) => ({ ...prev, ...nextStatusByWard }));
        }
        setIsWardMetricsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsWardMetricsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedWard?.id, wardList]);

  useEffect(() => {
    let isMounted = true;
    const wardId = selectedWard?.id;
    if (!wardId)
      return () => {
        isMounted = false;
      };

    const pollWardStatus = async () => {
      try {
        const latestStatusByLine =
          await action.fetchSingleWardLineStatusForToday(wardId);
        if (!isMounted) return;
        if (latestStatusByLine && Object.keys(latestStatusByLine).length > 0) {
          setLineStatusByWard((prev) => ({
            ...prev,
            [wardId]: latestStatusByLine,
          }));
          setLastRefreshed(dayjs().format("DD MMM, hh:mm A"));
          setIsWardMetricsLoading(false);
        }
      } catch (error) {
        if (!isMounted) return;
      }
    };

    pollWardStatus();
    const intervalId = setInterval(pollWardStatus, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
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

  const wardLengthMetrics = React.useMemo(() => {
    const selectedWardLineGeoJson = wardLinesById[selectedWard?.id];
    return action.getWardLengthMetrics(selectedWardLineGeoJson);
  }, [selectedWard?.id]);

  const completedLengthKm = React.useMemo(() => {
    return action.getCompletedLengthKm(
      currentWardLineStatus,
      wardLengthMetrics,
    );
  }, [currentWardLineStatus, wardLengthMetrics]);

  const totalWardLengthKm = React.useMemo(() => {
    return action.getTotalWardLengthKm(
      wardLengthMetrics,
      selectedWardLengthInMeter,
    );
  }, [wardLengthMetrics, selectedWardLengthInMeter]);

  const zoneCoveragePercent = React.useMemo(() => {
    return action.getZoneCoveragePercent(completedLengthKm, totalWardLengthKm);
  }, [completedLengthKm, totalWardLengthKm]);

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

  return (
    <div className={styles.realtimePage}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderTop}>
            <div className={styles.sidebarSubText}>
              <h3>Zone Summary</h3>
              Last Update: {lastRefreshed}
            </div>
            <button
              type="button"
              className={styles.sidebarRefreshBtn}
              onClick={handleRefresh}
            >
              <RefreshCw
                size={14}
                className={refreshing ? styles.spinIcon : ""}
              />
            </button>
          </div>
        </div>
        <div className={styles.wardItems}>
          {wardList.map((ward) => (
            <div
              key={ward.id}
              className={`${styles.wardRow} ${selectedWard?.id === ward.id ? styles.wardRowActive : ""}`}
              onClick={() => handleWardSelect(ward)}
            >
              <div className={styles.wardRowHead}>
                <div className={styles.wardPrimaryName}>
                  {getZoneLabel(ward)}
                </div>
                <div
                  className={styles.progressChip}
                  style={getProgressStyle(ward.progress)}
                >
                  {ward.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.layoutSplit}>
          <div className={styles.leftColumn}>
            {/* <div className={styles.glassCard}>
              <div className={styles.cardHeading}>
                <h3>Heroes on Duty</h3>
                <UsersIcon size={18} color="var(--themeColor)" />
              </div>
              <EnhancedProfile
                profile={wardData.profiles.driver}
                role="Captain"
                isOnline
              />
              <EnhancedProfile
                profile={wardData.profiles.helper}
                role="Pilot"
                isOnline={false}
              />
              <button
                type="button"
                className={styles.vehicleBar}
                onClick={() => setShowVehicleModal(true)}
              >
                <div className={styles.vehicleBarMain}>
                  <Truck size={14} />
                  <span>{wardData.vehicleNumber}</span>
                </div>
                <ChevronRight size={14} />
              </button>
            </div> */}
                
            <DutyComparisonReplica
              data={wardData}
              onVehicleClick={() => setShowVehicleModal(true)}
            />

            <HaltSummaryReplica onMapFocusChange={setMapFocus} />
          </div>
          <div className={styles.dataRight}>
            <div className={styles.dataRightBottom}>
              <div className={styles.centerColumn}>
                <CompletionDashboard />
                <div
                  className={`${styles.glassCard} ${styles.statusUnifiedCard}`}
                >
                  <div className={styles.cardHeading}>
                    <h3>Live Status Board</h3>
                    <Activity size={18} color="var(--themeColor)" />
                  </div>
                  <div className={styles.cardBody}>
                    <StatusLine
                      label="Vehicle Status"
                      value={wardData.vehicleStatus}
                      icon={<Truck size={16} />}
                      color="var(--textDanger)"
                      onClick={() => setActiveStatusModal("vehicle")}
                    />
                    <StatusLine
                      label="Trip Execution"
                      value={`${wardData.trips} Trips`}
                      icon={<TrendingUp size={16} />}
                    />
                    <StatusLine
                      label="App Status"
                      value={wardData.appStatus}
                      icon={<Zap size={16} />}
                      color="var(--textSuccess)"
                      onClick={() => setActiveStatusModal("app")}
                    />
                  </div>
                </div>
                <div className={styles.glassCard}>
                  <div className={styles.remarksHeadRow}>
                    <div className={styles.remarksHeadLeft}>
                      <Plus size={16} color="var(--themeColor)" />
                      <span className={styles.remarksHeadTitle}>Remark</span>
                    </div>
                    <button
                      type="button"
                      className={styles.addRemarkBtn}
                      onClick={openNewRemarkModal}
                    >
                      Add
                    </button>
                  </div>
                  {remarks.length === 0 ? (
                    <div className={styles.remarkEmpty}>
                      No query yet. Click Add New to create one.
                    </div>
                  ) : (
                    <div className={styles.remarkList}>
                      {remarks.map((item) => (
                        <div key={item.id} className={styles.remarkItemCard}>
                          <div className={styles.remarkItemTopic}>
                            {item.topic}
                          </div>
                          <div className={styles.remarkItemDescription}>
                            {item.description}
                          </div>
                          <div className={styles.remarkItemActions}>
                            <button
                              type="button"
                              className={styles.remarkActionBtn}
                              onClick={() => openEditRemarkModal(item)}
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.remarkActionBtn} ${styles.deleteActionBtn}`}
                              onClick={() => deleteRemark(item.id)}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.mapColumn}>
                <div
                  className={`${styles.glassCard} ${styles.fullWidthZoneCard}`}
                >
                  <div className={styles.statsFourAcross}>
                    <StateItem items={stateItems} />
                  </div>
                </div>

                <MapSection
                  selectedWard={selectedWard}
                  onWardLengthResolved={setSelectedWardLengthInMeter}
                  lineStatusByLine={currentWardLineStatus}
                  focusLocation={mapFocus}
                />
                <ShiftStatusSection
                  events={currentShiftEvents}
                  activeConnectorIndex={1}
                  showDutyInTime={showDutyInTime}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(activeStatusModal || showRemarkModal || showVehicleModal) && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div
            className={`${styles.modalContent} ${showVehicleModal ? styles.vehicleIssueModal : ""} ${
              activeStatusModal === "app" ? styles.appStatusModal : ""
            } ${activeStatusModal === "app" ? styles.appStatusModalPlain : ""} ${
              activeStatusModal === "vehicle"
                ? styles.vehicleJourneyModalShell
                : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {activeStatusModal !== "app" && activeStatusModal !== "vehicle" && (
              <div className={styles.modalHeader}>
                <h3>
                  {showVehicleModal
                    ? "Vehicle Assignment Desk"
                    : activeStatusModal === "vehicle"
                      ? "Logistics Diagnostic"
                      : editingRemarkId
                        ? "Edit Field Query"
                        : "Add Field Query"}
                </h3>
                <button
                  className={styles.modalCloseBtn}
                  onClick={closeAllModals}
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {showVehicleModal ? (
              <div className={styles.vehicleIssueWrap}>
                <div className={styles.vehicleIssueList}>
                  {vehicleIssueRows.map((item) => (
                    <div key={item.id} className={styles.vehicleIssueRow}>
                      <div className={styles.vehicleIssueNoCol}>
                        <div className={styles.vehicleIssueNo}>
                          {item.vehicleNo}
                        </div>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={(e) =>
                            setVehicleIssueRows((prev) =>
                              prev.map((r) =>
                                r.id === item.id
                                  ? { ...r, selected: e.target.checked }
                                  : r,
                              ),
                            )
                          }
                        />
                      </div>
                      <textarea
                        className={styles.vehicleIssueReason}
                        placeholder="Write reason..."
                        value={item.reason}
                        onChange={(e) =>
                          setVehicleIssueRows((prev) =>
                            prev.map((r) =>
                              r.id === item.id
                                ? { ...r, reason: e.target.value }
                                : r,
                            ),
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.modalSubmitBtn}
                  onClick={closeAllModals}
                >
                  Submit
                </button>
              </div>
            ) : activeStatusModal === "app" ? (
              <div className={styles.appStatusWrap}>
                {/* <div className={styles.appPhoneLabel}>DRIVER&apos;S PHONE</div> */}
                <div className={styles.appPhoneShell}>
                  <span
                    className={`${styles.appSideBtn} ${styles.appSideBtnLeft}`}
                  />
                  <span
                    className={`${styles.appSideBtn} ${styles.appSideBtnRightTop}`}
                  />
                  <span
                    className={`${styles.appSideBtn} ${styles.appSideBtnRightBottom}`}
                  />
                  <div className={styles.appPhoneFrame}>
                    <div className={styles.appPhoneTop}>
                      <span>{phoneClockTime}</span>
                      <span className={styles.appPhoneNotch}>
                        <span className={styles.appNotchSpeaker} />
                        <span className={styles.appNotchCam} />
                      </span>
                      <span className={styles.appPhoneDate}>
                        {phoneClockDate}
                      </span>
                    </div>

                    <div className={styles.appPanelHeader}>
                      <div className={styles.appPanelLeft}>
                        <span className={styles.appPanelIcon}>&#9638;</span>
                        <div>
                          <p className={styles.appPanelTitle}>App Status</p>
                          <p className={styles.appPanelSub}>
                            Today&apos;s full session log
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.appPanelClose}
                        onClick={closeAllModals}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className={styles.appChipRow}>
                      <button
                        type="button"
                        className={`${styles.appChip} ${appStatusTab === "all" ? styles.appTabActive : ""}`}
                        onClick={() => setAppStatusTab("all")}
                      >
                        All {appSessionLogs.length}
                      </button>
                      <button
                        type="button"
                        className={`${styles.appChip} ${styles.appChipOpen} ${
                          appStatusTab === "opened" ? styles.appTabActive : ""
                        }`}
                        onClick={() => setAppStatusTab("opened")}
                      >
                        Opened {appOpenedCount}
                      </button>
                      <button
                        type="button"
                        className={`${styles.appChip} ${styles.appChipClosed} ${
                          appStatusTab === "closed" ? styles.appTabActive : ""
                        }`}
                        onClick={() => setAppStatusTab("closed")}
                      >
                        Closed {appClosedCount}
                      </button>
                    </div>

                    <div className={styles.appLogList}>
                      {filteredAppSessionLogs.map((entry, index) => (
                        <div
                          key={`${entry.time}-${index}`}
                          className={styles.appLogRow}
                        >
                          <span
                            className={`${styles.appLogDot} ${
                              entry.tone === "opened"
                                ? styles.appLogDotOpen
                                : entry.tone === "closed"
                                  ? styles.appLogDotClose
                                  : styles.appLogDotMin
                            }`}
                          />
                          <span className={styles.appLogTime}>
                            {entry.time}
                          </span>
                          <span
                            className={`${styles.appLogBadge} ${
                              entry.tone === "opened"
                                ? styles.appLogBadgeOpen
                                : entry.tone === "closed"
                                  ? styles.appLogBadgeClose
                                  : styles.appLogBadgeMin
                            }`}
                          >
                            {entry.status}
                          </span>
                          <span className={styles.appLogDuration}>
                            {entry.duration}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.appPanelFooter}>
                      App opened {appOpenedCount}x · avg 32m 17s · closed{" "}
                      {appClosedCount}x · screen off 1x
                    </div>
                  </div>
                </div>
              </div>
            ) : activeStatusModal === "vehicle" ? (
              <div className={styles.vehicleJourneyModal}>
                <div className={styles.vehicleJourneyHeader}>
                  <div className={styles.vehicleJourneyHeadingWrap}>
                    <span className={styles.vehicleJourneyTagIcon}>
                      <Truck size={14} />
                    </span>
                    <div>
                      <h3 className={styles.vehicleJourneyTitle}>
                        Vehicle Status
                      </h3>
                      <p className={styles.vehicleJourneySubTitle}>
                        {wardData.vehicleNumber} · Today
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={closeAllModals}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className={styles.vehicleJourneyBody}>
                  <div
                    className={`${styles.vehicleJourneyStatusCard} ${
                      vehicleJourneyMeta.tone === "danger"
                        ? styles.vehicleJourneyStatusDanger
                        : vehicleJourneyMeta.tone === "warning"
                          ? styles.vehicleJourneyStatusWarning
                          : vehicleJourneyMeta.tone === "success"
                            ? styles.vehicleJourneyStatusSuccess
                            : styles.vehicleJourneyStatusNeutral
                    }`}
                  >
                    <div className={styles.vehicleJourneyStatusCopy}>
                      <p className={styles.vehicleJourneyStatusLabel}>
                        Current Status
                      </p>
                      <h4 className={styles.vehicleJourneyStatusTitle}>
                        {vehicleJourneyMeta.title}
                      </h4>
                      <p className={styles.vehicleJourneyStatusDesc}>
                        {vehicleJourneyMeta.description}
                      </p>
                    </div>
                  </div>

            
          <div className={styles.vehicleJourneyQuickStrip}>
                      {routeQuickStats.map((chip) => (
                        <div
                          key={chip.key}
                          className={`${styles.vehicleJourneyQuickChip} ${
                            styles[`vehicleJourneyQuick${chip.key}`]
                          }`}
                        >
                          <span className={styles.vehicleJourneyQuickIcon}>
                            {chip.icon}
                          </span>
                          <strong>{chip.value}</strong>
                          <span className={styles.vehicleJourneyQuickLabel}>
                            {chip.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  <div className={styles.vehicleJourneySection}>
                    <div className={styles.vehicleJourneySectionHead}>
                      <div className={styles.vehicleJourneySectionTitle}>
                        Route Snapshot
                      </div>
                      <button
                        type="button"
                        className={styles.vehicleJourneyViewToggle}
                        onClick={() =>
                          setRouteSnapshotView((prev) =>
                            prev === "detail" ? "compact" : "detail",
                          )
                        }
                        title={
                          routeSnapshotView === "detail"
                            ? "Switch to compact view"
                            : "Switch to detailed view"
                        }
                        aria-label={
                          routeSnapshotView === "detail"
                            ? "Switch to compact view"
                            : "Switch to detailed view"
                        }
                      >
                        {routeSnapshotView === "detail" ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronUp size={14} />
                        )}
                      </button>
                    </div>

                    {routeSnapshotView === "detail" ? (
                      <div className={styles.vehicleJourneyEventList}>
                        {routeSnapshotRows.map((entry, index) => {
                          const meta = getJourneyKindMeta(entry.kind);
                          const EventIcon = meta.icon;
                          return (
                            <div
                              key={entry.id || `${entry.time}-${index}`}
                              className={styles.vehicleJourneyEventRow}
                            >
                              <div className={styles.vehicleJourneyEventAxis}>
                                <span
                                  className={`${styles.vehicleJourneyEventDot} ${styles[`vehicleJourneyTone${meta.tone}`]}`}
                                >
                                  <EventIcon size={12} />
                                </span>
                                {index < routeSnapshotRows.length - 1 && (
                                  <span className={styles.vehicleJourneyEventLine} />
                                )}
                              </div>
                              <div
                                className={`${styles.vehicleJourneyEventCard} ${styles[`vehicleJourneyEvent${meta.tone}`]}`}
                              >
                                <div className={styles.vehicleJourneyEventTop}>
                                  <h4>{entry.title}</h4>
                                  <span>{entry.time}</span>
                                </div>
                                <p>{entry.description}</p>
                                <div className={styles.vehicleJourneyEventMeta}>
                                  <span className={styles.vehicleJourneyEventTag}>
                                    {entry.tag}
                                  </span>
                                  <span
                                    className={styles.vehicleJourneyEventDuration}
                                  >
                                    {entry.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={styles.vehicleJourneyCompactList}>
                        {routeSnapshotRows.map((entry, index) => {
                          const meta = getJourneyKindMeta(entry.kind);
                          const EventIcon = meta.icon;
                          const shouldShowMeta =
                            String(entry.duration || "")
                              .toLowerCase()
                              .includes("active") || index === routeSnapshotRows.length - 1;
                          return (
                            <div
                              key={entry.id || `${entry.time}-${index}`}
                              className={styles.vehicleJourneyCompactRow}
                            >
                              <div className={styles.vehicleJourneyCompactAxis}>
                                <span
                                  className={`${styles.vehicleJourneyCompactDot} ${styles[`vehicleJourneyTone${meta.tone}`]}`}
                                >
                                  <EventIcon size={11} />
                                </span>
                                {index < routeSnapshotRows.length - 1 && (
                                  <span className={styles.vehicleJourneyCompactLine} />
                                )}
                              </div>
                              <div className={styles.vehicleJourneyCompactCopy}>
                                <div className={styles.vehicleJourneyCompactTop}>
                                  <h4>{entry.title}</h4>
                                  <span>{entry.time}</span>
                                </div>
                                {shouldShowMeta && (
                                  <div className={styles.vehicleJourneyCompactMeta}>
                                    <span className={styles.vehicleJourneyCompactMetaTag}>
                                      {entry.tag}
                                    </span>
                                    <span className={styles.vehicleJourneyCompactMetaTime}>
                                      {entry.duration}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

        
                  <div className={styles.vehicleJourneySummaryStrip}>
                    <span className={styles.vehicleJourneySummaryIcon}>
                      <Trophy size={12} />
                    </span>
                 <p dangerouslySetInnerHTML={{ __html: summaryText }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.remarkFormWrap}>
                <div className={styles.customDropdownWrap}>
                  <button
                    type="button"
                    className={styles.customDropdownToggle}
                    onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                  >
                    {remarkForm.topic || "Select Remark Topic"}
                  </button>
                  {showTopicDropdown && (
                    <div className={styles.customDropdownMenu}>
                      {remarkTopicOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={styles.customDropdownItem}
                          onClick={() => {
                            setRemarkForm({ ...remarkForm, topic: item });
                            setShowTopicDropdown(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <textarea
                  className={styles.remarkTextarea}
                  placeholder="Remark Description"
                  value={remarkForm.description}
                  onChange={(e) =>
                    setRemarkForm({
                      ...remarkForm,
                      description: e.target.value,
                    })
                  }
                />
                <button
                  className={styles.modalSubmitBtn}
                  onClick={handleRemarkSubmit}
                >
                  {editingRemarkId ? "Update Query" : "Submit Query"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const StatusLine = ({ label, value, icon, color, onClick }) => (
  <button
    type="button"
    className={styles.statusLine}
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <div className={styles.statusLineLeft}>
      <div style={{ color: "var(--themeColor)", display: "flex" }}>{icon}</div>
      <span className={styles.statusLabel}>{label}</span>
    </div>
    <div className={styles.statusLineRight}>
      <span className={styles.statusValue} style={{ color }}>
        {value}
      </span>
      {onClick && (
        <span className={styles.statusClickIndicator}>
          <ChevronRight size={14} />
        </span>
      )}
    </div>
  </button>
);

const PerformanceGrid = ({ data }) => {
  const items = [
    // { label: "Total Lines", value: data.lines.total },
    { label: "Total Halt", value: data.halt.total, color: "var(--textDanger)" },
    // { label: "Completed", value: data.lines.completed, color: "var(--textSuccess)" },
    {
      label: "Curr Halt",
      value: data.halt.current,
      color: "var(--textSuccess)",
    },
    // { label: "Skipped", value: data.lines.skipped, color: "var(--textDanger)" },
    {
      label: "Curr Line",
      value: data.lines.current,
      color: "var(--themeColor)",
    },
  ];
  return (
    <div className={styles.wardSummaryStats}>
      <StateItem items={items} />
    </div>
  );
};

const EnhancedProfile = ({ profile, role, isOnline }) => (
  <div className={styles.enhancedProfile}>
    <div className={styles.enhancedAvatarSection}>
      <div className={styles.enhancedAvatarBox}>
        <img src={Chetan} alt="" />
        <UserIcon size={32} color="#94a3b8" />
      </div>
      <div className={styles.enhancedProfileInfo}>
        <span className={styles.enhancedRoleTag}>{role}</span>
        <span className={styles.enhancedProfileName}>{profile.name}</span>
        <div className={styles.enhancedProfilePhone}>
          <Phone size={11} />{" "}
          <a href={`tel:${profile.phone}`} className={styles.enhancedPhoneLink}>
            {profile.phone}
          </a>
        </div>
      </div>
    </div>
    <div className={styles.enhancedRatingRow}>
      <span className={styles.ratingText}>5.0</span>
    </div>
  </div>
);

const DutyComparisonReplica = ({ data, onVehicleClick }) => {
  const replica = data?.heroesDutyReplica || {};
  const driver = data?.profiles?.driver || {};
  const helper = data?.profiles?.helper || {};
  const vehicleStatus = getVehicleJourneyMeta(data?.vehicleStatus || "");

  return (
    <div className={`${styles.glassCard} ${styles.heroReplicaCard}`}>
      <div className={styles.heroReplicaHead}>
        <div className={styles.heroReplicaTitleWrap}> 
          <div>
            <h4>Heroes on Duty</h4>
          </div>
        </div>
        <span className={styles.heroReplicaFieldPill}><UserStar size={14} /></span>
      </div>

      <div className={styles.heroReplicaCrewGrid}>
        <div className={styles.coverImg}></div>
        <div className={styles.heroReplicaCrewCard}>
          <span className={`${styles.heroReplicaRolePill} ${styles.heroReplicaRoleCaptain}`}>Captain</span>
          <div className={styles.heroReplicaAvatarWrap}>
            <img src={Chetan} alt="Driver" />
            <span className={styles.heroReplicaOnlineDot} />
          </div>
          <h5>{driver.name || "Driver Name"}</h5>
          <p className={styles.heroReplicaPhone}>
            <Phone size={11} />
            <a href={`tel:${String(driver.phone || "").replace(/[^\d+]/g, "")}`}>
              {driver.phone || "-"}
            </a>
          </p>
          <p className={styles.heroReplicaRating}>5.0 Star</p>
          <div className={styles.heroReplicaStatsRow}>
            <div>
              <strong>5 yrs</strong>
              <span>Exp.</span>
            </div>
            <div>
              <strong>640Km</strong>
              <span>Driven</span>
            </div>
          </div>
        </div>

        <div className={styles.heroReplicaCrewCard}>
          <span className={`${styles.heroReplicaRolePill} ${styles.heroReplicaRoleHelper}`}>Pilot</span>
          <div className={styles.heroReplicaAvatarWrap}>
            <img src={Chetan} alt="Helper" />
            <span className={styles.heroReplicaOnlineDot} />
          </div>
          <h5>{helper.name || "Helper Name"}</h5>
          <p className={styles.heroReplicaPhone}>
            <Phone size={11} />
            <a href={`tel:${String(helper.phone || "").replace(/[^\d+]/g, "")}`}>
              {helper.phone || "-"}
            </a>
          </p>
          <p className={styles.heroReplicaRating}>5.0 Star</p>
          <div className={styles.heroReplicaStatsRow}>
            <div>
              <strong>1.5 yrs</strong>
              <span>Exp.</span>
            </div>
            <div>
              <strong>180Km</strong>
              <span>Driven</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.heroReplicaVehicleRow}
        onClick={onVehicleClick}
      >
        <div className={styles.heroReplicaVehicleLeft}>
         🚛
          <div className={styles.vehicleContent}>
            <strong>{data?.vehicleNumber}</strong>
          </div>
        </div>
        <ChevronRight size={14} />
      </button>

      {/* <div className={styles.heroReplicaFooter}>
        <div>
          <strong>{replica?.summary?.tripsDone ?? data?.trips ?? 0}</strong>
          <span>Trips Done</span>
        </div>
        <div>
          <strong>{replica?.summary?.totalLines ?? data?.lines?.total ?? 0}</strong>
          <span>Total Lines</span>
        </div>
        <div>
          <strong>{replica?.summary?.teamRating ?? 5.0}</strong>
          <span>Team Rating</span>
        </div>
      </div> */}
    </div>
  );
};

export default MonitoringList;
