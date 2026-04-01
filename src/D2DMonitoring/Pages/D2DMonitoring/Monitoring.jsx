import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import {
  Truck,
  Clock,
  MapPin,
  Fuel,
  Wrench,
  Trophy,
  Database,
  ChevronDown,
} from "lucide-react";
import dayjs from "dayjs";
// import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import MapSection from "../../Components/D2DMonitoring/MapSection";

import { connectFirebase } from "../../../firebase/firebaseService";
import { getCityFirebaseConfig, getCityFirebaseConfigAsync } from "../../../configurations/cityDBConfig";
import * as action from "../../Action/D2DMonitoring/Monitoring/MonitoringAction";
import { getOrFetchShiftTimeline, formatShiftTime } from "../../Action/D2DMonitoring/Monitoring/ShiftTimelineAction";
import ShiftTimelineModal from "../../Components/ShiftTimeLine/ShiftTimelineModal";
import * as vehicleStatusAction from "../../Action/D2DMonitoring/Monitoring/VehicleStatusAction";
import { subscribeVehicleLocationAction } from "../../Action/D2DMonitoring/Monitoring/VehicleLocationAction";
import { getWardListAction, getCityList } from "../../Action/D2DMonitoring/Monitoring/WardListAction";
import { prefetchAllWardLines, getLinePathsFromGeoJson } from "../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import wevoisLogo from "../../../assets/images/wevoisLogo.png";
import ChangePassword from "../../../components/ChangePassword/changePassword";
import QuickAppSelection from "../../../mainLayout/QuickAppSelection";
import topbarStyles from "../../../Style/MainLayout/Topbar.module.css";
import { useCity } from "../../../context/CityContext";

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
import { FieldMetricsGrid } from "../../Components/D2DMonitoring/InfoStrip/MonitoringInfoStrips";
import MapOffcanvas from "../../Components/D2DMonitoring/MapOffcanvas/MapOffcanvas";
import DbServiceOffcanvas from "../../Components/D2DMonitoring/DbServiceOffcanvas/DbServiceOffcanvas";
import CitySelectionModal from "../../../components/CitySelectionModal/CitySelectionModal";

const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const STATUS_EMOJI_BY_TYPE = {
  fuel: "⛽",
  dump: "🏭",
  garage: "🔧",
  ward: "🚛",
  transit: "🚛",
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
      emoji: STATUS_EMOJI_BY_TYPE.fuel,
    };
  }

  if (normalizedStatus.includes("dump")) {
    return {
      title: toTitleCase(rawStatus || "Dumping Yard Out"),
      description: "Vehicle is outside — returning to route",
      icon: Truck,
      tone: "danger",
      emoji: STATUS_EMOJI_BY_TYPE.dump,
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
      emoji: STATUS_EMOJI_BY_TYPE.garage,
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
      emoji: STATUS_EMOJI_BY_TYPE.ward,
    };
  }

  return {
    title: toTitleCase(rawStatus || "Vehicle In Transit"),
    description: "Vehicle is moving on assigned route",
    icon: Truck,
    tone: "success",
    emoji: STATUS_EMOJI_BY_TYPE.transit,
  };
};

const APP_SESSION_LOGS = [
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
const APP_OPENED_COUNT = APP_SESSION_LOGS.filter((e) => e.tone === "opened").length;
const APP_CLOSED_COUNT = APP_SESSION_LOGS.filter((e) => e.tone === "closed").length;

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

const MonitoringList = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setCityContext } = useCity();

  // ── User badge state ──────────────────────────────────
  const storedName = localStorage.getItem("name");
  const [firstchar, setFirstchar] = useState("");
  const [secondchar, setSecondchar] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showQuickAppSelect, setShowQuickAppSelect] = useState(false);

  const [wardList, setWardList] = useState([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [showDbServiceOffcanvas, setShowDbServiceOffcanvas] = useState(false);

  useEffect(() => {
    getCityList().then((list) => setCityList(list.map((item) => item.cityName)));
  }, []);

  useEffect(() => {
    if (!city) return;
    action.clearWorkerCaches();
    setSelectedWard(null);
    const fetchWards = async () => {
      try {
        const wards = getWardListAction(city);
        setWardList(wards);
        if (wards.length > 0) setSelectedWard(wards[0]);

        prefetchAllWardLines(city, wards, (wardId, geoJson) => {
          setWardLinesGeoJsonById((prev) => ({ ...prev, [wardId]: geoJson }));
        });

        const statusByWard =
          await action.fetchWardLineStatusCacheForToday(wards);
        if (Object.keys(statusByWard || {}).length > 0) {
          setLineStatusByWard((prev) => ({ ...prev, ...statusByWard }));
        }
      } catch (error) {
        console.error("Error initializing monitoring page data:", error);
      }
    };
    fetchWards();
  }, [city]);
  const [remarkTopicOptions, setRemarkTopicOptions] = useState([]);

  useEffect(() => {
    const fallback = [
      { id: "1", name: "Vehicle Related" },
      { id: "2", name: "Device" },
      { id: "3", name: "Location Issue" },
      { id: "4", name: "Fast Working" },
      { id: "5", name: "Halts" },
      { id: "6", name: "General" },
    ];
    action.fetchRemarkCategories().then((categories) => {
      setRemarkTopicOptions(
        categories && categories.length > 0 ? categories : fallback,
      );
    });
  }, []);

  const [selectedWard, setSelectedWard] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(
    dayjs().format("DD MMM, hh:mm A"),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [activeStatusModal, setActiveStatusModal] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [dutyModal, setDutyModal] = useState(null);
  const [isDutyImageLoading, setIsDutyImageLoading] = useState(false);
  const [remarks, setRemarks] = useState([]);

  // Subscribe to today's remarks for the selected ward
  useEffect(() => {
    if (!selectedWard?.id) return;
    const unsub = action.subscribeRemarks(selectedWard.id, setRemarks);
    return () => unsub();
  }, [selectedWard?.id]);
  const [remarkForm, setRemarkForm] = useState({ topic: "", description: "" });
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showDutyInTime, setShowDutyInTime] = useState("");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [appStatusTab, setAppStatusTab] = useState("all");
  const [routeSnapshotView, setRouteSnapshotView] = useState("detail");
  const [showLargeMap, setShowLargeMap] = useState(false);
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const [selectedWardLengthInMeter, setSelectedWardLengthInMeter] = useState(0);
  const [wardLinesGeoJson, setWardLinesGeoJson] = useState(null);
  const [wardLinesGeoJsonById, setWardLinesGeoJsonById] = useState({});
  const [lineStatusByWard, setLineStatusByWard] = useState({});
  const [isWardMetricsLoading, setIsWardMetricsLoading] = useState(true);
  const [phoneClock, setPhoneClock] = useState(new Date());

  const [vehicleIssueRows, setVehicleIssueRows] = useState([
    { id: 1, vehicleNo: "COMP-5340", selected: false, reason: "" },
    { id: 2, vehicleNo: "COMP-6402", selected: false, reason: "" },
    { id: 3, vehicleNo: "COMP-9812", selected: false, reason: "" },
  ]);

  const [liveVehicleStatus, setLiveVehicleStatus] = useState({
    currentStatus: null,
    eventLog: [],
    quickSummary: {},
  });

  const [dutyInImage, setDutyInImage] = useState(null);
  const [wardReachedTime, setWardReachedTime] = useState(null);
  const [dutyOffTime, setDutyOffTime] = useState(null);
  const [dutyOffImage, setDutyOffImage] = useState(null);

  const filteredAppSessionLogs = useMemo(() =>
    appStatusTab === "all"
      ? APP_SESSION_LOGS
      : APP_SESSION_LOGS.filter((entry) =>
          appStatusTab === "opened" ? entry.tone === "opened" : entry.tone === "closed"
        ),
  [appStatusTab]);
  const phoneClockTime = dayjs(phoneClock).format("HH:mm");
  const phoneClockDate = dayjs(phoneClock).format("DD MMM");

  // Merge live vehicle status for display
  const displayVehicleStatus = liveVehicleStatus.currentStatus || "";

  const vehicleJourneyData = useMemo(() => ({
    routeSnapshot: [],
    eventLog: liveVehicleStatus.eventLog.length > 0 ? liveVehicleStatus.eventLog : [],
    quickSummary: Object.keys(liveVehicleStatus.quickSummary).length > 0 ? liveVehicleStatus.quickSummary : {},
  }), [liveVehicleStatus.eventLog, liveVehicleStatus.quickSummary]);

  const vehicleJourneyMeta = useMemo(
    () => getVehicleJourneyMeta(displayVehicleStatus),
    [displayVehicleStatus],
  );

  const vehicleTone =
    vehicleJourneyMeta.tone === "danger"
      ? "toneDanger"
      : vehicleJourneyMeta.tone === "success"
        ? "toneSuccess"
        : "toneWarning";
  const getTripStatusTone = useCallback(() => "toneWarning", []);
  const appTone = "toneWarning";
  const tripCompleted = 0;
  const tripActive = 0;

  const displayWardData = useMemo(() => ({
    vehicleStatus: displayVehicleStatus,
    vehicleJourney: vehicleJourneyData,
    dutyOn: showDutyInTime || "00:00",
    reachOn: wardReachedTime || "00:00",
  }), [displayVehicleStatus, vehicleJourneyData, showDutyInTime, wardReachedTime]);

  const routeQuickStats = useMemo(() => [
    { key: "fuel",    label: "Fuel Stop",     value: vehicleJourneyData.quickSummary.fuelStops ?? 0,          icon: <Fuel size={12} /> },
    { key: "entries", label: "Ward Entries",  value: vehicleJourneyData.quickSummary.wardEntries ?? 0,        icon: <MapPin size={12} /> },
    { key: "inward",  label: "In Ward",       value: vehicleJourneyData.quickSummary.inWard || "0m",          icon: <Clock size={12} /> },
    { key: "longest", label: "Longest Stay",  value: vehicleJourneyData.quickSummary.longestSession || "0m",  icon: <Trophy size={12} /> },
  ], [vehicleJourneyData.quickSummary]);

  const routeSnapshotRows = useMemo(() =>
    vehicleJourneyData.eventLog.length > 0
      ? vehicleJourneyData.eventLog
      : vehicleJourneyData.routeSnapshot.map((item) => ({
          id: item.id,
          title: item.label,
          description: "",
          time: item.time,
          tag: item.label,
          duration: item.duration || "-",
          kind: item.kind,
        })),
  [vehicleJourneyData.eventLog, vehicleJourneyData.routeSnapshot]);

  useEffect(() => {
    if (!city) return;
    const initFirebase = async () => {
      try {
        const effectiveCity = toTitleCase(city);
        const firebaseConfig = await getCityFirebaseConfigAsync(effectiveCity);
        connectFirebase(firebaseConfig, effectiveCity);
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };
    initFirebase();
  }, [city]);

  useEffect(() => {
    if (!selectedWard?.id) return;
    const effectiveCity = city ? toTitleCase(city) : "Sikar";
    let active = true;

    const fetchShiftTimeline = async () => {
      // Ward switch hote hi sab clear karo — purana data na dikhe
      setShowDutyInTime("");
      setWardReachedTime("");
      setDutyOffTime("");
      setDutyInImage(null);
      setDutyOffImage(null);
      setDutyModal(null);

      // Background images ready hone par UI update — sirf agar ward abhi bhi same ho
      const onImagesReady = ({ DutyOnImage, DutyOutImage }) => {
        if (!active) return;
        if (DutyOnImage)  setDutyInImage(DutyOnImage.split(',')[0]);
        if (DutyOutImage) setDutyOffImage(DutyOutImage.split(',')[0]);
      };

      // Supabase check → found: Supabase se show | not found: Firebase times turant + images background
      const data = await getOrFetchShiftTimeline(selectedWard, effectiveCity, onImagesReady);
      if (!active) return;

      if (data) {
        setShowDutyInTime(formatShiftTime(data.DutyInTime)    || "");
        setWardReachedTime(formatShiftTime(data.wardReachedOn) || "");
        setDutyOffTime(formatShiftTime(data.DutyOutTime)      || "");
        // DutyOnImage/DutyOutImage mein comma-separated URLs ho sakti hain — pehli URL use karo
        setDutyInImage(data.DutyOnImage  ? data.DutyOnImage.split(',')[0]  : null);
        setDutyOffImage(data.DutyOutImage ? data.DutyOutImage.split(',')[0] : null);
      }
      // data null hai (Firebase mein bhi nahi mila) → sab cleared hi rahega
    };

    fetchShiftTimeline().catch(console.error);
    return () => { active = false; };
  }, [selectedWard?.id, city]);

  // Pre-fetch duty-off image as soon as dutyOffTime is known (before modal opens).
  useEffect(() => {
    if (!selectedWard?.id || !dutyOffTime || dutyOffTime === "00:00" || dutyOffTime === "--:--") return;
    const effectiveCity = city ? toTitleCase(city) : "Sikar";
    action.getDutyOffImage(effectiveCity, selectedWard.id, setDutyOffImage);
  }, [dutyOffTime, selectedWard?.id, city]);

  // Fallback: if image wasn't pre-fetched by the time modal opens, fetch it now.
  useEffect(() => {
    if (!dutyModal || !selectedWard?.id) return;
    const effectiveCity = city ? toTitleCase(city) : "Sikar";

    const fetchImage = async () => {
      setIsDutyImageLoading(true);
      try {
        if (dutyModal === "dutyIn" && !dutyInImage) {
          await action.getDutyInImage(effectiveCity, selectedWard.id, setDutyInImage);
        } else if (dutyModal === "dutyOff" && !dutyOffImage) {
          if (!dutyOffTime || dutyOffTime === "00:00" || dutyOffTime === "--:--") {
            setDutyOffImage(null);
          } else {
            await action.getDutyOffImage(effectiveCity, selectedWard.id, setDutyOffImage);
          }
        }
      } finally {
        setIsDutyImageLoading(false);
      }
    };

    // If image already pre-fetched, skip loading state entirely.
    if (dutyModal === "dutyIn" && dutyInImage) { setIsDutyImageLoading(false); return; }
    if (dutyModal === "dutyOff" && dutyOffImage) { setIsDutyImageLoading(false); return; }

    fetchImage();
  }, [
    dutyModal,
    selectedWard?.id,
    city,
    dutyInImage,
    dutyOffImage,
    dutyOffTime,
  ]);

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

    let unsubscribe = () => {};
    try {
      unsubscribe = action.subscribeWardLineStatusForToday(
        wardId,
        (statusByLine) => {
          setLineStatusByWard((prev) => ({ ...prev, [wardId]: statusByLine }));
          setLastRefreshed(dayjs().format("DD MMM, hh:mm A"));
          setIsWardMetricsLoading(false);
        },
      );
    } catch (error) {
      console.error("Error subscribing to ward line status:", error);
      setIsWardMetricsLoading(false);
    }

    return () => typeof unsubscribe === "function" && unsubscribe();
  }, [selectedWard?.id]);

  useEffect(() => {
    if (!selectedWard?.id) return;
    return subscribeVehicleLocationAction(selectedWard.id, setVehicleLocation);
  }, [selectedWard?.id]);

  useEffect(() => {
    const wardId = selectedWard?.id;
    if (!wardId) return;

    let unsubscribe = () => {};
    try {
      unsubscribe = vehicleStatusAction.subscribeVehicleStatusForToday(
        wardId,
        (data) => {
          setLiveVehicleStatus(data);
        },
      );
    } catch (error) {
      console.error("Error subscribing to live vehicle status:", error);
    }

    return () => typeof unsubscribe === "function" && unsubscribe();
  }, [selectedWard?.id]);

  // ── User badge: parse initials ────────────────────────
  useEffect(() => {
    if (storedName) {
      const parts = storedName.split(" ");
      setFirstchar(parts[0].charAt(0).toUpperCase());
      setSecondchar(parts.length > 1 ? parts[1].charAt(0).toUpperCase() : "");
    }
  }, [storedName]);

  const handleLogout = () => {
    ["isLogin", "loginDate", "name", "userId", "city", "cityId", "defaultCity", "logoUrl"].forEach(
      (k) => localStorage.removeItem(k),
    );
    setCityContext({ city: "", cityId: "", cityLogo: "" });
    navigate("/");
  };

  const handleWardSelect = useCallback((ward) => {
    if (selectedWard?.id === ward.id) return;
    setIsWardMetricsLoading(!lineStatusByWard?.[ward.id]);
    setSelectedWard(ward);
  }, [selectedWard?.id, lineStatusByWard]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(dayjs().format("DD MMM, hh:mm A"));
    }, 800);
  }, []);

  const openNewRemarkModal = useCallback(() => {
    setEditingRemarkId(null);
    setRemarkForm({ topic: "", description: "" });
    setShowRemarkModal(true);
  }, []);

  const openEditRemarkModal = useCallback((item) => {
    setEditingRemarkId(item.id);
    setRemarkForm({ topic: item.topic || "", description: item.remark || item.description || "" });
    setShowRemarkModal(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setActiveStatusModal(null);
    setShowVehicleModal(false);
    setShowRemarkModal(false);
    setShowTopicDropdown(false);
    setAppStatusTab("all");
    setDutyModal(null);
  }, []);

  const openVehicleModal = useCallback(() => setActiveStatusModal("vehicle"), []);
  const openTripsModal  = useCallback(() => setActiveStatusModal("trips"),   []);
  const openAppModal    = useCallback(() => setActiveStatusModal("app"),      []);

  const handleShiftEventClick = useCallback((event) => {
    if (event.key === "dutyOn") setDutyModal("dutyIn");
    if (event.key === "dutyOff") {
      if (!dutyOffTime || dutyOffTime === "00:00" || dutyOffTime === "--:--") return;
      setDutyModal("dutyOff");
    }
  }, [dutyOffTime]);

  const handleRemarkSubmit = async () => {
    const topic = remarkForm.topic.trim();
    const description = remarkForm.description.trim();
    if (!topic || !description || !selectedWard?.id) return;

    const matchedCategory = remarkTopicOptions.find(
      (opt) => (typeof opt === "string" ? opt : opt.name) === topic,
    );
    const categoryId = matchedCategory?.id ?? "";
    const categoryImage = matchedCategory?.image ?? "";
    const userId = localStorage.getItem("userId") ?? "";

    const payload = {
      remark: description,
      category: categoryId,
      image: categoryImage,
      topic,
      userId,
    };

    if (editingRemarkId) {
      await action.updateRemark(selectedWard.id, editingRemarkId, payload);
    } else {
      await action.saveRemark(selectedWard.id, payload);
    }
    closeAllModals();
  };

  const deleteRemark = useCallback(async (id) => {
    if (!selectedWard?.id) return;
    await action.deleteRemark(selectedWard.id, id);
  }, [selectedWard?.id]);

  const handleVehicleIssueRowChange = useCallback((id, field, value) => {
    setVehicleIssueRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }, []);

  const currentShiftEvents = React.useMemo(
    () => [
      {
        key: "dutyOn",
        label: "Duty On",
        time: showDutyInTime || "00:00",
        status: showDutyInTime ? "completed" : "pending",
      },
      {
        key: "reachOn",
        label: "Reached",
        time: wardReachedTime || "00:00",
        status: wardReachedTime ? "completed" : "pending",
      },
      ...(!dutyOffTime && showDutyInTime ? [{
        key: "workStatus",
        label: "Working",
        time: "Live",
        status: "active",
        isLive: true,
        isGray: !wardReachedTime,
      }] : []),
      {
        key: "dutyOff",
        label: "Off",
        time: dutyOffTime || "--:--",
        status: dutyOffTime ? "completed" : "pending",
        isGray: !dutyOffTime || dutyOffTime === "00:00" || dutyOffTime === "--:--",
      },
    ],
    [showDutyInTime, wardReachedTime, dutyOffTime],
  );

  const currentWardLineStatus = React.useMemo(
    () => action.getCurrentWardLineStatus(lineStatusByWard, selectedWard?.id),
    [lineStatusByWard, selectedWard?.id],
  );

  const wardLengthMetrics = React.useMemo(
    () => action.getWardLengthMetrics(wardLinesGeoJson),
    [wardLinesGeoJson],
  );

  const { wardStartPoint, wardEndPoint } = React.useMemo(() => {
    const paths = getLinePathsFromGeoJson(wardLinesGeoJson);
    if (!paths.length) return { wardStartPoint: null, wardEndPoint: null };
    const firstPath = paths[0];
    const lastPath = paths[paths.length - 1];
    return {
      wardStartPoint: firstPath[0] ?? null,
      wardEndPoint: lastPath[lastPath.length - 1] ?? null,
    };
  }, [wardLinesGeoJson]);

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
      const metrics = action.getWardLengthMetrics(
        wardLinesGeoJsonById[ward.id],
      );
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

  const stateItems = useMemo(() => action.buildCoverageStateItems({
    isWardMetricsLoading,
    zoneCoveragePercent,
    totalWardLengthKm,
    completedLengthKm,
    remainingLengthKm,
  }), [isWardMetricsLoading, zoneCoveragePercent, totalWardLengthKm, completedLengthKm, remainingLengthKm]);
  return (
    <>
    <div className={styles.realtimePage}>
      {" "}
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <img src={wevoisLogo} alt="WeVOIS" className={styles.topBarLogo} fetchpriority="high" />
          <button
            type="button"
            className={styles.cityPickerBtn}
            onClick={() => setShowCityModal(true)}
          >
            <MapPin size={12} />
            <span>{city}</span>
            <ChevronDown size={12} />
          </button>
        </div>
        <div className={styles.topBarCenter}>
          <span className={styles.topBarTitle}>Realtime Monitoring</span>
          {/* <span className={styles.topBarSub}>
            {selectedWard?.name
              ? `Ward · ${selectedWard.name}`
              : "Select a ward to begin"}
          </span> */}
        </div>

        <div className={styles.topBarRight}>
          <button
            type="button"
            className={`${topbarStyles.menuItem} ${showDbServiceOffcanvas ? topbarStyles.menuItemActive : ""}`}
            onClick={() => setShowDbServiceOffcanvas(true)}
          >
            <div className={topbarStyles.menuIcon}>
              <Database className={topbarStyles.navIcon} size={20} />
            </div>
            <span className={topbarStyles.menuLabel}>Db Service Tracking</span>
          </button>
          <div
            className={topbarStyles.userBadge}
            // onClick={() => setShowQuickAppSelect((p) => !p)}
            style={{ cursor: "pointer" }}
          >
            <button className={`btn ${topbarStyles.userDropdownBtn}`}>
              <span className={topbarStyles.userBG}>
                {firstchar}{secondchar}
              </span>
              <span className={topbarStyles.userName}>{storedName}</span>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.mainSection}>
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
                key={city}
                data={displayWardData}
                wardId={selectedWard?.id}
                onVehicleClick={() => setShowVehicleModal(true)}
                shiftTimelineContent={
                  <ShiftStatusSection
                    events={currentShiftEvents}
                    onOpenTimeline={() => setShowShiftModal(true)}
                    embedded
                  />
                }
              />
              {/* <CompletionDashboard
                totalLines={lineCounts.total}
                completedLines={lineCounts.completed}
                skippedLines={lineCounts.skipped}
              />

              <ShiftSnapshotStrip wardData={displayWardData} /> */}
              <FieldMetricsGrid lineCounts={lineCounts} />

              <LiveStatusBoard
                wardData={displayWardData}
                vehicleTone={vehicleTone}
                getTripStatusTone={getTripStatusTone}
                appTone={appTone}
                onVehicleClick={openVehicleModal}
                onTripsClick={openTripsModal}
                onAppClick={openAppModal}
              />
              
                <RemarksCard
                  remarks={remarks}
                  onAddRemark={openNewRemarkModal}
                  onEditRemark={openEditRemarkModal}
                  onDeleteRemark={deleteRemark}
                />
              {/* 
            <HaltSummaryReplica
              onMapFocusChange={setMapFocus}
              ward={selectedWard?.id}
            /> */}
            </div>
            <div className={styles.dataRight}>
              <div className={styles.dataRightBottom}>
                {/* <div className={styles.centerColumn}>
                <CompletionDashboard
                  totalLines={lineCounts.total}
                  completedLines={lineCounts.completed}
                  skippedLines={lineCounts.skipped}
                />

                <LiveStatusBoard
                  wardData={displayWardData}
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
              </div> */}
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

                  <MapSection
                    city={city}
                    selectedWard={selectedWard}
                    onWardLengthResolved={setSelectedWardLengthInMeter}
                    onWardLinesResolved={setWardLinesGeoJson}
                    lineStatusByLine={currentWardLineStatus}
                    vehicleLocation={vehicleLocation}
                    wardStartPoint={wardStartPoint}
                    wardEndPoint={wardEndPoint}
                    onExpandMap={() => setShowLargeMap(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Shift Timeline Modal */}
        {showShiftModal && (
          <div className={styles.modalOverlay} onClick={() => setShowShiftModal(false)}>
            <ShiftTimelineModal
              wardName={selectedWard?.name}
              dutyInTime={showDutyInTime}
              dutyOutTime={dutyOffTime}
              wardReachedTime={wardReachedTime}
              dutyInImage={dutyInImage}
              dutyOutImage={dutyOffImage}
              isLive={!dutyOffTime && !!showDutyInTime}
              onClose={() => setShowShiftModal(false)}
            />
          </div>
        )}

        {/* Duty In / Duty Off Modal */}
        {dutyModal && (
          <div className={styles.modalOverlay} onClick={closeAllModals}>
            <DutyCheckModal
              type={dutyModal}
              time={dutyModal === "dutyOff" ? dutyOffTime : showDutyInTime}
              wardName={selectedWard?.name}
              attendanceImage={
                dutyModal === "dutyOff" ? dutyOffImage : dutyInImage
              }
              isLoading={isDutyImageLoading}
              onClose={closeAllModals}
              onSubmit={closeAllModals}
            />
          </div>
        )}
      </div>
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
                appSessionLogs={APP_SESSION_LOGS}
                appOpenedCount={APP_OPENED_COUNT}
                appClosedCount={APP_CLOSED_COUNT}
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
              wardData={{ vehicleNumber: "" }}
              tripCompleted={tripCompleted}
              tripActive={tripActive}
              onClose={closeAllModals}
            />
          ) : activeStatusModal === "vehicle" ? (
            <VehicleJourneyModal
              wardData={{ vehicleNumber: "" }}
              vehicleJourneyMeta={vehicleJourneyMeta}
              routeQuickStats={routeQuickStats}
              routeSnapshotRows={routeSnapshotRows}
              routeSnapshotView={routeSnapshotView}
              // summaryText={summaryText}
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

    {/* ── City Picker Modal ── */}
    {showCityModal && (
      <CitySelectionModal
        open={showCityModal}
        onClose={() => setShowCityModal(false)}
        onSelect={(selectedCity) => {
          setShowCityModal(false);
          const newPath = pathname.replace(/^\/[^/]+/, `/${selectedCity}`);
          navigate(newPath);
        }}
        cityList={cityList}
        selectedCity={city}
        title="Select City"
      />
    )}

    {/* ── User account modals ── */}
    <ChangePassword
      showChangePassword={showChangePassword}
      setShowChangePassword={setShowChangePassword}
    />
    <QuickAppSelection
      showQuickAppSelect={showQuickAppSelect}
      onClose={() => setShowQuickAppSelect(false)}
      isDropdown={true}
      onChangePassword={() => setShowChangePassword(true)}
      onLogout={handleLogout}
    />

    {/* ── Db Service Offcanvas ── */}
    <DbServiceOffcanvas
      open={showDbServiceOffcanvas}
      onClose={() => setShowDbServiceOffcanvas(false)}
      city={city}
    />

    {/* ── Map Offcanvas ── */}
    <MapOffcanvas
      open={showLargeMap}
      onClose={() => setShowLargeMap(false)}
      wardName={selectedWard?.name}
      city={city}
      selectedWard={selectedWard}
      lineStatusByLine={currentWardLineStatus}
      vehicleLocation={vehicleLocation}
      wardStartPoint={wardStartPoint}
      wardEndPoint={wardEndPoint}
    />
    </>
  );
};

export default MonitoringList;
