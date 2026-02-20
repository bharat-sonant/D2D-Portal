import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Realtime.module.css";
import {
  Activity,
  Truck,
  Check,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  Users as UsersIcon,
  Settings,
  Plus,
  RefreshCw,
  Star,
  ChevronRight,
  ArrowRight,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Navigation,
  Info,
  X,
  Map as MapIcon,
  Signal,
  Battery,
  BatteryMedium,
  Cpu,
  Pencil,
  Trash2,
} from "lucide-react";
import dayjs from "dayjs";
import { useCity } from "../../context/CityContext";
import { getWardListAction } from "../../Actions/Monitoring/wardListSectionAction";
import { getSelectWardBoundaryAndLine } from "../../Actions/City/wardMapAction";
import WevoisLoader from "../../components/Common/Loader/WevoisLoader";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import Chetan from "../../assets/images/Chetan.jpeg";
// import Mritunjay from "../../assets/images/mrityunjay.jpeg";

const Realtime = () => {
  const remarkTopicOptions = [
    "Performance Issue",
    "Route Observation",
    "Safety Alert",
    "Vehicle Issue",
    "Team Coordination",
    "Other",
  ];
  const { cityId } = useCity();
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(
    dayjs().format("DD MMM, hh:mm A"),
  );
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [activeStatusModal, setActiveStatusModal] = useState(null); // 'app' or 'vehicle'
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [remarks, setRemarks] = useState([]);
  const [remarkForm, setRemarkForm] = useState({ topic: "", description: "" });
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Map States
  const mapRef = useRef(null);
  const remarkTopicDropdownRef = useRef(null);
  const [wardLineData, setWardLineData] = useState([]);
  const [wardBoundaryData, setWardBoundaryData] = useState([]);
  const [vehicleIssueRows, setVehicleIssueRows] = useState([
    { id: 1, vehicleNo: "COMP-5340", selected: false, reason: "" },
    { id: 2, vehicleNo: "COMP-6402", selected: false, reason: "" },
    { id: 3, vehicleNo: "COMP-9812", selected: false, reason: "" },
    { id: 4, vehicleNo: "LEY-AT-4323", selected: false, reason: "" },
    { id: 5, vehicleNo: "LEY-AT-4384", selected: false, reason: "" },
  ]);

  // Exact Data from Image for Premium Presentation
  const [wardData, setWardData] = useState({
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
      helper: { name: "Dharamraj(C)", phone: "1237567890", stars: 5 },
    },
    vehicleNumber: "LEY-AT-4602",
    zones: { total: 74, completed: 31, active: 29, inactive: 9, stop: 5 },
    heroesOnWork: 89,
    garageDuty: "0/0",
  });

  const handleWardSelect = (ward) => {
    if (selectedWard?.id === ward.id) return;
    setDataLoading(true);
    setSelectedWard(ward);
    // Simulate Data Fetch
    setTimeout(() => {
      setDataLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (!cityId) return;
    const fetchWards = async () => {
      setLoading(true);
      const res = await getWardListAction(cityId);
      const enrichedWards = res.wardList.map((w) => ({
        ...w,
        progress: w.progress || Math.floor(Math.random() * 100),
      }));
      setWardList(enrichedWards);
      if (res.selectedWard) setSelectedWard(res.selectedWard);
      setLoading(false);
    };
    fetchWards();
  }, [cityId]);

  useEffect(() => {
    if (selectedWard && cityId) {
      getSelectWardBoundaryAndLine(
        selectedWard.id,
        cityId,
        null,
        setWardBoundaryData,
        setWardLineData,
        [],
        () => {},
      );
    }
  }, [selectedWard, cityId]);

  useEffect(() => {
    if (!showTopicDropdown) return;
    const handleOutsideClick = (event) => {
      if (
        remarkTopicDropdownRef.current &&
        !remarkTopicDropdownRef.current.contains(event.target)
      ) {
        setShowTopicDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showTopicDropdown]);

  const fitToBounds = useCallback(() => {
    if (!mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (wardBoundaryData?.length)
      wardBoundaryData.forEach((p) => bounds.extend(p));
    if (wardLineData?.length)
      wardLineData.forEach((path) => path.forEach((p) => bounds.extend(p)));
    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
  }, [wardBoundaryData, wardLineData]);

  useEffect(() => {
    if (wardBoundaryData.length || wardLineData.length) fitToBounds();
  }, [wardBoundaryData, wardLineData, fitToBounds]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(dayjs().format("DD MMM, hh:mm A"));
    }, 800);
  };

  const getZoneLabel = (ward) =>
    ward?.name || ward?.zoneName || ward?.wardName || `Zone ${ward?.id}`;
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
    setShowTopicDropdown(false);
    setShowRemarkModal(true);
  };

  const openEditRemarkModal = (item) => {
    setEditingRemarkId(item.id);
    setRemarkForm({ topic: item.topic, description: item.description });
    setShowTopicDropdown(false);
    setShowRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setShowRemarkModal(false);
    setEditingRemarkId(null);
    setShowTopicDropdown(false);
    setRemarkForm({ topic: "", description: "" });
  };

  const handleRemarkTopicSelect = (topic) => {
    setRemarkForm((prev) => ({ ...prev, topic }));
    setShowTopicDropdown(false);
  };

  const openVehicleModal = () => {
    setShowVehicleModal(true);
  };

  const closeAllModals = () => {
    setActiveStatusModal(null);
    setShowVehicleModal(false);
    closeRemarkModal();
  };

  const updateVehicleIssueRow = (id, field, value) => {
    setVehicleIssueRows((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const submitVehicleIssues = () => {
    setShowVehicleModal(false);
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

    closeRemarkModal();
  };

  const deleteRemark = (id) => {
    setRemarks((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) return <WevoisLoader title="Initializing Data..." />;

  const mapContainerStyle = { width: "100%", height: "100%" };
  const center = { lat: 26.9124, lng: 75.7873 };
  const zoneGraphMax = Math.max(
    wardData.zones.total,
    wardData.zones.completed,
    wardData.zones.active,
    wardData.zones.inactive,
    wardData.zones.stop || 0,
    1,
  );
  const currentShiftCompleted =
    Boolean(wardData.dutyOff) && wardData.dutyOff !== "---";
  const activeConnectorIndex = currentShiftCompleted
    ? -1
    : wardData.finalPointReached
      ? 2
      : 1;
  const currentShiftEvents = [
    {
      key: "dutyOn",
      label: "Duty On",
      time: wardData.dutyOn || "--:--",
      status: "completed",
    },
    {
      key: "reachOn",
      label: "Reached",
      time: wardData.reachOn || "--:--",
      status: wardData.reachOn ? "completed" : "pending",
    },
    {
      key: "workStatus",
      label: currentShiftCompleted ? "Last Point" : "Working",
      time: currentShiftCompleted ? wardData.lastLineTime || "--:--" : "Live",
      status: currentShiftCompleted ? "completed" : "active",
      isLive: !currentShiftCompleted,
    },
    {
      key: "dutyOff",
      label: "Off",
      time: currentShiftCompleted ? wardData.dutyOff : "--:--",
      status: currentShiftCompleted ? "completed" : "pending",
    },
  ];

  return (
    <div className={styles.realtimePage}>
      {/* High-Density Optimized Sidebar */}
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
              title="Refresh zones"
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
                <div className={styles.wardNameWrap}>
                  <div className={styles.wardPrimaryName}>
                    {getZoneLabel(ward)}
                  </div>
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
      <div className={styles.mainContent}>
        <div className={styles.mobileWardSelector}>
          <select
            className={styles.wardDropdown}
            value={selectedWard?.id || ""}
            onChange={(e) =>
              handleWardSelect(wardList.find((w) => w.id === e.target.value))
            }
          >
            {wardList.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {getZoneLabel(ward)} ({ward.progress}%)
              </option>
            ))}
          </select>
        </div>

        {dataLoading ? (
          <div className={styles.loaderContainer}>
            <WevoisLoader
              title={`Updating Data for ${selectedWard?.name || "Ward"}...`}
            />
          </div>
        ) : (
          <>
            {/* Main Split Layout */}
            <div className={styles.layoutSplit}>
              {/* Left Column - 400px Fixed */}
              <div className={styles.leftColumn}>
                <div className={styles.glassCard}>
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
                    className={`${styles.vehicleBar} ${styles.vehicleBarInteractive}`}
                    onClick={openVehicleModal}
                    title="Open vehicle details"
                  >
                    <div className={styles.vehicleBarMain}>
                      <Truck size={14} />
                      <span>{wardData.vehicleNumber}</span>
                    </div>
                    <div className={styles.vehicleBarHint}>
                      {/* <span>View details</span> */}
                      <ChevronRight className={styles.vehicleBarNext} size={14} />
                    </div>
                  </button>
                </div>

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
                              <Pencil size={13} />
                              Edit
                            </button>
                            <button
                              type="button"
                              className={`${styles.remarkActionBtn} ${styles.deleteActionBtn}`}
                              onClick={() => deleteRemark(item.id)}
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.dataRight}>
                <div
                  className={`${styles.glassCard} ${styles.fullWidthZoneCard}`}
                >
                  <div className={styles.cardHeading}>
                    <h3>Ward Analytics</h3>
                    <Clock size={16} color="var(--themeColor)" />
                  </div>
                  <div className={styles.statsFourAcross}>
                    <StatItem
                      label="Total Time"
                      value={wardData.timeStats.total}
                      icon={<Clock size={12} />}
                      layout="iconLeft"
                    />
                    <StatItem
                      label="Active Zone Time"
                      value={wardData.timeStats.inZone}
                      icon={<Clock size={12} />}
                      layout="iconLeft"
                    />
                    <StatItem
                      label="Kilometer Metrics"
                      value={wardData.kmStats.total}
                      icon={<Zap size={12} />}
                      layout="iconLeft"
                    />
                    <StatItem
                      label="Zone Coverage"
                      value={wardData.kmStats.inZone}
                      icon={<Zap size={12} />}
                      layout="iconLeft"
                    />
                  </div>
                </div>
                <div className={styles.dataRightBottom}>
                  <div className={styles.centerColumn}>
                    <div
                      className={`${styles.glassCard} ${styles.wardSummary}`}
                    >
                      <div className={styles.cardHeading}>
                        <h3>Ward Summary</h3>
                        <TrendingUp size={16} color="var(--themeColor)" />
                      </div>
                      <PerformanceGrid data={wardData} />
                    </div>

                    <div
                      className={`${styles.glassCard} ${styles.wardSummary}`}
                    >
                      <div className={styles.cardHeading}>
                        <h3>Zone Details</h3>
                        <MapIcon size={16} color="var(--themeColor)" />
                      </div>
                      <div className={styles.statsTwoColWrap}>
                        <StatItem
                          label="Total Zone"
                          value={wardData.zones.total}
                          graphPercent={
                            (wardData.zones.total / zoneGraphMax) * 100
                          }
                          graphStyle="dots"
                        />
                        <StatItem
                          label="Comp. Zone"
                          value={wardData.zones.completed}
                          color="var(--textSuccess)"
                          graphPercent={
                            (wardData.zones.completed / zoneGraphMax) * 100
                          }
                          graphStyle="dots"
                        />
                        <StatItem
                          label="Active Zone"
                          value={wardData.zones.active}
                          color="var(--themeColor)"
                          graphPercent={
                            (wardData.zones.active / zoneGraphMax) * 100
                          }
                          graphStyle="dots"
                        />
                        <StatItem
                          label="Inactive Zone"
                          value={wardData.zones.inactive}
                          color="var(--gray)"
                          graphPercent={
                            (wardData.zones.inactive / zoneGraphMax) * 100
                          }
                          graphStyle="dots"
                        />
                        <StatItem
                          label="Stop Zone"
                          value={wardData.zones.stop}
                          color="var(--textDanger)"
                          graphPercent={
                            ((wardData.zones.stop || 0) / zoneGraphMax) * 100
                          }
                          graphStyle="dots"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.mapColumn}>
                    <div className={`${styles.glassCard} ${styles.mapCard}`}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={14}
                        onLoad={(map) => (mapRef.current = map)}
                        options={{
                          disableDefaultUI: true,
                          styles: mapMinimalStyle,
                        }}
                      >
                        {wardBoundaryData.length > 0 && (
                          <Polygon
                            paths={wardBoundaryData}
                            options={{
                              strokeColor: "#1e293b",
                              strokeWeight: 2,
                              fillOpacity: 0.05,
                            }}
                          />
                        )}
                        {wardLineData.length > 0 &&
                          wardLineData.map((path, idx) => (
                            <Polyline
                              key={idx}
                              path={path}
                              options={{
                                strokeColor: "var(--themeColor)",
                                strokeWeight: 4,
                              }}
                            />
                          ))}
                      </GoogleMap>
                      <div className={styles.mapFooter}>
                        <div className={styles.mapStat}>
                          <UsersIcon size={14} color="var(--themeColor)" />
                          <span>
                            Heroes: <b>{wardData.heroesOnWork}</b>
                          </span>
                        </div>
                        <div className={styles.mapStat}>
                          <Truck size={14} color="var(--themeColor)" />
                          <span>
                            Garage: <b>{wardData.garageDuty}</b>
                          </span>
                        </div>
                      </div>
                      <div className={styles.mapQuickActions}>
                        <button
                          type="button"
                          className={styles.mapQuickBtn}
                          title="Path View"
                        >
                          <MapIcon size={18} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.mapQuickBtn} ${styles.mapQuickBtnPrimary}`}
                          title="Live Location"
                        >
                          <Navigation size={18} />
                        </button>
                      </div>
                    </div>
                    {/* Timing Grid at Top - 100% Width */}
                    <div className={styles.timingGrid}>
                      <ShiftTimeline
                        events={currentShiftEvents}
                        activeConnectorIndex={activeConnectorIndex}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Context-Aware Interactive Modals */}
      {(activeStatusModal || showRemarkModal || showVehicleModal) && (
        <div
          className={styles.modalOverlay}
          onClick={closeAllModals}
        >
          <div
            className={`${styles.modalContent} ${
              showVehicleModal ? styles.vehicleIssueModal : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {showVehicleModal
                  ? "Vehicle Assignment Desk"
                  : activeStatusModal === "app"
                  ? "Terminal Activity"
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

            {showVehicleModal ? (
              <div className={styles.vehicleIssueWrap}>
                <div className={styles.vehicleIssueHead}>
                  <span className={styles.vehicleIssueTitle}>
                    Not Assigned Vehicle
                  </span>
                  <span className={styles.vehicleIssueCount}>
                    {vehicleIssueRows.length}
                  </span>
                </div>
                <div className={styles.vehicleIssueTableHead}>
                  <span>Vehicle No.</span>
                  <span>Reason</span>
                </div>
                <div className={styles.vehicleIssueList}>
                  {vehicleIssueRows.map((item) => (
                    <div key={item.id} className={styles.vehicleIssueRow}>
                      <div className={styles.vehicleIssueNoCol}>
                        <div className={styles.vehicleIssueNo}>
                          {item.vehicleNo}
                        </div>
                        <label className={styles.vehicleIssueCheck}>
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={(e) =>
                              updateVehicleIssueRow(
                                item.id,
                                "selected",
                                e.target.checked,
                              )
                            }
                          />
                          <span>Issue Found</span>
                        </label>
                      </div>
                      <textarea
                        className={styles.vehicleIssueReason}
                        placeholder="Write reason..."
                        value={item.reason}
                        onChange={(e) =>
                          updateVehicleIssueRow(item.id, "reason", e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.modalSubmitBtn}
                  onClick={submitVehicleIssues}
                >
                  Submit
                </button>
              </div>
            ) : activeStatusModal === "app" ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <ModalRow
                  label="Uptime Status"
                  value={wardData.appStatus}
                  color="var(--textSuccess)"
                  icon={<Activity size={16} />}
                />
                <ModalRow
                  label="Signal Strength"
                  value="Optimal (4G Node 2)"
                  icon={<Signal size={16} />}
                />
                <ModalRow
                  label="Battery Health"
                  value="84% Energy State"
                  icon={<BatteryMedium size={16} />}
                />
                <ModalRow
                  label="Sync Latency"
                  value="0.4ms"
                  icon={<Cpu size={16} />}
                />
              </div>
            ) : activeStatusModal === "vehicle" ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <ModalRow
                  label="Logistic Chain"
                  value={wardData.vehicleStatus}
                  color="var(--textDanger)"
                  icon={<Truck size={16} />}
                />
                <ModalRow
                  label="Fleet ID"
                  value={wardData.vehicleNumber}
                  icon={<Navigation size={16} />}
                />
                <ModalRow
                  label="Fuel Reserve"
                  value="65% Remaining"
                  icon={<Zap Pulse size={16} />}
                />
                <ModalRow
                  label="Mechanical Integrity"
                  value="All Nodes Nominal"
                  color="var(--textSuccess)"
                  icon={<ShieldCheck size={16} />}
                />
              </div>
            ) : (
              <div className={styles.remarkFormWrap}>
                <div
                  className={styles.customDropdownWrap}
                  ref={remarkTopicDropdownRef}
                >
                  <button
                    type="button"
                    className={`${styles.customDropdownToggle} ${
                      showTopicDropdown ? styles.customDropdownToggleOpen : ""
                    }`}
                    onClick={() => setShowTopicDropdown((prev) => !prev)}
                  >
                    <span
                      className={`${styles.customDropdownText} ${
                        !remarkForm.topic ? styles.customDropdownPlaceholder : ""
                      }`}
                    >
                      {remarkForm.topic || "Select Remark Topic"}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`${styles.customDropdownCaret} ${
                        showTopicDropdown ? styles.customDropdownCaretOpen : ""
                      }`}
                    />
                  </button>
                  {showTopicDropdown && (
                    <div className={styles.customDropdownMenu}>
                      {remarkTopicOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`${styles.customDropdownItem} ${
                            remarkForm.topic === item
                              ? styles.customDropdownItemActive
                              : ""
                          }`}
                          onClick={() => handleRemarkTopicSelect(item)}
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
                    setRemarkForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            )}
            {showRemarkModal && (
              <button
                className={styles.modalSubmitBtn}
                onClick={handleRemarkSubmit}
              >
                {editingRemarkId ? "Update Query" : "Submit Query"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
      {onClick ? (
        <span className={styles.statusClickIndicator}>
          <ChevronRight size={14} />
        </span>
      ) : null}
    </div>
  </button>
);

const ShiftTimeline = ({ events, activeConnectorIndex = -1 }) => (
  <div className={styles.shiftTimelineCard}>
    <div className={styles.shiftTimelineTrack}>
      {events.map((event, index) => {
        const isCompleted = event.status === "completed";
        const isActive = event.status === "active";
        const isPending = event.status === "pending";

        return (
          <React.Fragment key={event.key}>
            <div className={styles.shiftEvent}>
              <div
                className={`${styles.shiftEventLabel} ${
                  isActive ? styles.shiftEventLabelActive : ""
                }`}
              >
                {event.label}
              </div>
              <div
                className={`${styles.shiftEventIconWrap} ${
                  isCompleted
                    ? styles.shiftEventIconCompleted
                    : isActive
                      ? styles.shiftEventIconActive
                      : styles.shiftEventIconPending
                }`}
              >
                {isCompleted ? (
                  <Check size={14} />
                ) : isActive ? (
                  <Clock size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
              </div>
              <div
                className={`${styles.shiftEventTime} ${
                  isPending ? styles.shiftEventTimePending : ""
                } ${event.isLive ? styles.shiftEventTimeLive : ""}`}
              >
                {event.time}
              </div>
            </div>
            {index < events.length - 1 && (
              (() => {
                const isAllCompleted = activeConnectorIndex < 0;
                const connectorIndex = index;
                const resolvedConnectorState = isAllCompleted
                  ? "completed"
                  : connectorIndex < activeConnectorIndex
                    ? "completed"
                    : connectorIndex === activeConnectorIndex
                      ? "active"
                      : "pending";

                return (
                  <div
                    className={`${styles.shiftEventConnector} ${
                      resolvedConnectorState === "completed"
                        ? styles.shiftEventConnectorCompleted
                        : resolvedConnectorState === "active"
                          ? styles.shiftEventConnectorActive
                          : styles.shiftEventConnectorPending
                    }`}
                  />
                );
              })()
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

const PerformanceGrid = ({ data }) => {
  const items = [
    {
      label: "Total Lines",
      value: data.lines.total,
    },
    {
      label: "Total Halt",
      value: data.halt.total,
      color: "var(--textDanger)",
    },
    {
      label: "Completed",
      value: data.lines.completed,
      color: "var(--textSuccess)",
    },
    {
      label: "Curr Halt",
      value: data.halt.current,
      color: "var(--textSuccess)",
    },
    {
      label: "Skipped",
      value: data.lines.skipped,
      color: "var(--textDanger)",
    },
    {
      label: "Curr Line",
      value: data.lines.current,
      color: "var(--themeColor)",
    },
  ];

  return (
    <div className={styles.wardSummaryStats}>
      {items.map((item) => (
        <StatItem
          key={item.label}
          label={item.label}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  );
};

const StatItem = ({
  label,
  value,
  color,
  icon,
  layout,
  graphPercent,
  graphStyle = "bar",
}) => (
  <div
    className={`${styles.miniStatItem} ${layout === "iconLeft" ? styles.miniStatItemIconLeft : ""}`}
  >
    {layout === "iconLeft" && icon && (
      <div className={styles.miniStatLeadIcon}>{icon}</div>
    )}
    <div className={styles.miniStatContent}>
      <div className={styles.miniStatTop}>
        <div className={styles.miniStatHeader}>
          {layout !== "iconLeft" && icon && (
            <div style={{ color: "var(--themeColor)" }}>{icon}</div>
          )}
          <span className={styles.miniStatLabel}>{label}</span>
        </div>
        <span className={styles.miniStatValue} style={{ color }}>
          {value}
        </span>
      </div>
      {typeof graphPercent === "number" &&
        (graphStyle === "dots" ? (
          <div className={styles.miniStatDotGraph}>
            {Array.from({ length: 10 }).map((_, idx) => {
              const active =
                idx <
                Math.max(
                  Math.round(graphPercent / 10),
                  graphPercent > 0 ? 1 : 0,
                );
              return (
                <span
                  key={idx}
                  className={`${styles.miniStatDot} ${active ? styles.miniStatDotActive : ""}`}
                  style={
                    active
                      ? { background: color || "var(--themeColor)" }
                      : undefined
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.miniStatGraphTrack}>
            <div
              className={styles.miniStatGraphFill}
              style={{
                width: `${graphPercent}%`,
                background: color || "var(--themeColor)",
              }}
            />
          </div>
        ))}
    </div>
  </div>
);

// Enhanced Profile Component with Image Support
const EnhancedProfile = ({ profile, role, isOnline }) => (
  <div className={styles.enhancedProfile}>
    <div className={styles.enhancedAvatarSection}>
      <div className={styles.enhancedAvatarBox}>
        <img src={Chetan} title="" alt="" />
        <UserIcon size={32} color="#94a3b8" />
        {/* {isOnline && <div className={styles.onlineIndicator}></div>} */}
      </div>
      <div className={styles.enhancedProfileInfo}>
        <span className={styles.enhancedRoleTag}>{role}</span>
        <span className={styles.enhancedProfileName}>{profile.name}</span>
        <div className={styles.enhancedProfilePhone}>
          <Phone size={11} />
          <a
            href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
            className={styles.enhancedPhoneLink}
          >
            {profile.phone}
          </a>
        </div>
      </div>
    </div>
    <div className={styles.enhancedRatingRow}>
      {/* <div className={styles.ratingStars}>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill="#f59e0b" stroke="none" />
                ))}
            </div> */}
      <span className={styles.ratingText}>5.0</span>
    </div>
  </div>
);

const PremiumProfile = ({ profile, role, isOnline }) => (
  <div className={styles.premiumProfile}>
    <div className={styles.avatarBox}>
      <UserIcon size={26} color="#cbd5e1" />
      {isOnline && <div className={styles.onlineIndicator}></div>}
    </div>
    <div className={styles.profileInfo}>
      <span className={styles.profileTag}>{role}</span>
      <span className={styles.profileName}>{profile.name}</span>
      <div className={styles.profilePhone}>{profile.phone}</div>
      <div
        style={{
          display: "flex",
          gap: "2px",
          justifyContent: "center",
          marginTop: "4px",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={8} fill="#f59e0b" stroke="none" />
        ))}
      </div>
    </div>
  </div>
);

const ModalRow = ({ label, value, color, icon }) => (
  <div className={styles.modalRow}>
    <div className={styles.modalRowLabel}>
      {icon} {label}
    </div>
    <span className={styles.modalRowValue} style={{ color }}>
      {value}
    </span>
  </div>
);

const mapMinimalStyle = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#a0a0a0" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: "20" }],
  },
];

export default Realtime;
