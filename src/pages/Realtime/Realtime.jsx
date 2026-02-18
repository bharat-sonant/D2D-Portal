import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Realtime.module.css";
import {
  Activity,
  Truck,
  MapPin,
  CheckCircle,
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
  const [remarks, setRemarks] = useState([]);
  const [remarkForm, setRemarkForm] = useState({ topic: "", description: "" });
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Map States
  const mapRef = useRef(null);
  const [wardLineData, setWardLineData] = useState([]);
  const [wardBoundaryData, setWardBoundaryData] = useState([]);

  // Exact Data from Image for Premium Presentation
  const [wardData, setWardData] = useState({
    vehicleStatus: "Dumping Yard out",
    trips: 2,
    appStatus: "OPENED",
    dutyOn: "8:37 AM",
    reachOn: "9:17 AM",
    lastLineTime: "14:02",
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

  const closeRemarkModal = () => {
    setShowRemarkModal(false);
    setEditingRemarkId(null);
    setRemarkForm({ topic: "", description: "" });
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

  if (loading) return <WevoisLoader title="Initializing AI Assistant..." />;

  const mapContainerStyle = { width: "100%", height: "100%" };
  const center = { lat: 26.9124, lng: 75.7873 };

  return (
    <div className={styles.realtimePage}>
      {/* High-Density Optimized Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Zone Registry</h3>
          <div
            style={{ fontSize: "11px", color: "var(--gray)", marginTop: "4px" }}
          >
            Monitoring {wardList.length} Active Nodes
          </div>
        </div>
        <div className={styles.wardItems}>
          {wardList.map((ward) => (
            <div
              key={ward.id}
              className={`${styles.wardRow} ${selectedWard?.id === ward.id ? styles.wardRowActive : ""}`}
              onClick={() => handleWardSelect(ward)}
            >
              <div className={styles.wardIdBox}>{ward.id}</div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressText}>{ward.progress}%</div>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${ward.progress}%` }}
                ></div>
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
                Zone {ward.id} ({ward.progress}%)
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
                    role="Primary Pilot"
                    isOnline
                  />
                  <EnhancedProfile
                    profile={wardData.profiles.helper}
                    role="Duty Helper"
                    isOnline={false}
                  />

                  <div className={styles.vehicleBar}>
                    <Truck size={14} />
                    <span>{wardData.vehicleNumber}</span>
                  </div>
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
                      <span className={styles.remarksHeadTitle}>
                        REMARK TITLE
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.addRemarkBtn}
                      onClick={openNewRemarkModal}
                    >
                      Add New
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
                {/* Timing Grid at Top - 100% Width */}
                <div className={styles.timingGrid}>
                  <TimingCell
                    variant="horizontal"
                    icon={<ShieldCheck size={20} color="#22c55e" />}
                    value={wardData.dutyOn}
                    label="Duty Initiated"
                  />
                  <TimingCell
                    variant="horizontal"
                    icon={<MapPin size={20} color="#3b82f6" />}
                    value={wardData.reachOn}
                    label="Ward Reach"
                  />
                  <TimingCell
                    variant="horizontal"
                    icon={<TrendingUp size={20} color="#8b5cf6" />}
                    value={wardData.lastLineTime}
                    label="Last Point"
                  />
                  <TimingCell
                    variant="horizontal"
                    icon={<PowerOffIcon size={20} color="#f43f5e" />}
                    value={wardData.dutyOff}
                    label="Duty Release"
                  />
                </div>
                <div
                  className={`${styles.glassCard} ${styles.fullWidthZoneCard}`}
                >
                  <div className={styles.cardHeading}>
                    <h3>Intelligent Analytics</h3>
                    <Clock size={16} color="var(--themeColor)" />
                  </div>
                  <div className={styles.statsFourAcross}>
                    <StatItem
                      label="Time Performance"
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

                    <div className={`${styles.glassCard} ${styles.wardSummary}`}>
                      <div className={styles.cardHeading}>
                        <h3>Zone Details</h3>
                        <MapIcon size={16} color="var(--themeColor)" />
                      </div>
                      <div className={styles.statsTwoColWrap}>
                        <StatItem
                          label="Total Zone"
                          value={wardData.zones.total}
                        />
                        <StatItem
                          label="Comp. Zone"
                          value={wardData.zones.completed}
                          color="var(--textSuccess)"
                        />
                        <StatItem
                          label="Active Zone"
                          value={wardData.zones.active}
                          color="var(--themeColor)"
                        />
                        <StatItem
                          label="Inactive Zone"
                          value={wardData.zones.inactive}
                          color="var(--gray)"
                        />
                        <StatItem
                          label="Stop Zone"
                          value={wardData.zones.inactive}
                          color="var(--textDanger)"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Context-Aware Interactive Modals */}
      {(activeStatusModal || showRemarkModal) && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setActiveStatusModal(null);
            closeRemarkModal();
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {activeStatusModal === "app"
                  ? "Terminal Activity"
                  : activeStatusModal === "vehicle"
                    ? "Logistics Diagnostic"
                    : editingRemarkId
                      ? "Edit Field Query"
                      : "Add Field Query"}
              </h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => {
                  setActiveStatusModal(null);
                  closeRemarkModal();
                }}
              >
                <X size={20} />
              </button>
            </div>

            {activeStatusModal === "app" ? (
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
                <select
                  className={styles.remarkSelect}
                  value={remarkForm.topic}
                  onChange={(e) =>
                    setRemarkForm((prev) => ({
                      ...prev,
                      topic: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Remark Topic</option>
                  {remarkTopicOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
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
    <span className={styles.statusValue} style={{ color }}>
      {value}
    </span>
  </button>
);

const TimingCell = ({ icon, label, value, variant = "vertical" }) => (
  <div
    className={
      variant === "horizontal"
        ? styles.timingCellHorizontal
        : variant === "badge"
          ? styles.timingCellBadge
          : styles.timingCell
    }
  >
    {variant === "horizontal" ? (
      <>
        <div className={styles.timingContent}>
          <span>{value}</span>
          <label>{label}</label>
        </div>
        <div className={styles.timingIconBox}>{icon}</div>
      </>
    ) : variant === "badge" ? (
      <>
        <div className={styles.badgeIconBox}>{icon}</div>
        <label>{label}</label>
        <span>{value}</span>
      </>
    ) : (
      <>
        {icon}
        <label>{label}</label>
        <span>{value}</span>
      </>
    )}
  </div>
);

const PerformanceGrid = ({ data }) => (
  <div className={styles.wardSummaryStats}>
    <StatItem label="Total Lines" value={data.lines.total} />
    <StatItem
      label="Total Halt"
      value={data.halt.total}
      color="var(--textDanger)"
    />
    <StatItem
      label="Completed"
      value={data.lines.completed}
      color="var(--textSuccess)"
    />
    <StatItem
      label="Curr Halt"
      value={data.halt.current}
      color="var(--textSuccess)"
    />
    <StatItem
      label="Skipped"
      value={data.lines.skipped}
      color="var(--textDanger)"
    />
    <StatItem
      label="Curr Line"
      value={data.lines.current}
      color="var(--themeColor)"
    />
  </div>
);

const StatItem = ({ label, value, color, icon, layout }) => (
  <div
    className={`${styles.miniStatItem} ${layout === "iconLeft" ? styles.miniStatItemIconLeft : ""}`}
  >
    {layout === "iconLeft" && icon && (
      <div className={styles.miniStatLeadIcon}>{icon}</div>
    )}
    <div className={styles.miniStatContent}>
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
  </div>
);

// Enhanced Profile Component with Image Support
const EnhancedProfile = ({ profile, role, isOnline }) => (
  <div className={styles.enhancedProfile}>
    <div className={styles.enhancedAvatarSection}>
      <div className={styles.enhancedAvatarBox}>
        <img src={Chetan} title="" alt="" />
        <UserIcon size={32} color="#94a3b8" />
        {isOnline && <div className={styles.onlineIndicator}></div>}
      </div>
      <div className={styles.enhancedProfileInfo}>
        <span className={styles.enhancedRoleTag}>{role}</span>
        <span className={styles.enhancedProfileName}>{profile.name}</span>
        <div className={styles.enhancedProfilePhone}>
          <Phone size={11} />
          <span>{profile.phone}</span>
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

const PowerOffIcon = ({ size, color }) => (
  <div style={{ transform: "rotate(180deg)", display: "flex" }}>
    <ShieldCheck size={size} color={color} />
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
