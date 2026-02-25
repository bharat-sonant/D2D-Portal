import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import {
    Activity,
    Truck,
    Check,
    AlertCircle,
    Clock,
    Zap,
    TrendingUp,
    Users as UsersIcon,
    Plus,
    RefreshCw,
    Star,
    ChevronRight,
    User as UserIcon,
    Phone,
    ShieldCheck,
    Navigation,
    X,
    Map as MapIcon,
    Signal,
    BatteryMedium,
    Cpu,
    Pencil,
    Trash2,
} from "lucide-react";
import dayjs from "dayjs";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import Chetan from "../../../assets/images/Chetan.jpeg";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import MapSection from "../../Components/D2DMonitoring/MapSection";
import ShiftStatusSection from "../../Components/D2DMonitoring/ShiftStatusSection";
import { connectFirebase } from "../../../firebase/firebaseService";
import { getCityFirebaseConfig } from "../../../configurations/cityDBConfig";

const MonitoringList = () => {
    const remarkTopicOptions = [
        "Performance Issue",
        "Route Observation",
        "Safety Alert",
        "Vehicle Issue",
        "Team Coordination",
        "Other",
    ];

    // ✅ Local Ward Array (Static Data)
    const [wardList] = useState([
        { id: 1, name: "Ward 1", progress: 25 },
        { id: 2, name: "Ward 2", progress: 40 },
        { id: 3, name: "Ward 3", progress: 65 },
        { id: 4, name: "Ward 4", progress: 80 },
        { id: 5, name: "Ward 5", progress: 95 },
    ]);

    const [selectedWard, setSelectedWard] = useState(wardList[0]);
    const [lastRefreshed, setLastRefreshed] = useState(dayjs().format("DD MMM, hh:mm A"));
    const [refreshing, setRefreshing] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    // Modal States
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    const [activeStatusModal, setActiveStatusModal] = useState(null); // 'app' or 'vehicle'
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [remarks, setRemarks] = useState([]);
    const [remarkForm, setRemarkForm] = useState({ topic: "", description: "" });
    const [editingRemarkId, setEditingRemarkId] = useState(null);
    const [showTopicDropdown, setShowTopicDropdown] = useState(false);

    // Map States
    const remarkTopicDropdownRef = useRef(null);
    const [wardLineData] = useState([]); // Static empty for now
    const [wardBoundaryData] = useState([]); // Static empty for now

    const [vehicleIssueRows, setVehicleIssueRows] = useState([
        { id: 1, vehicleNo: "COMP-5340", selected: false, reason: "" },
        { id: 2, vehicleNo: "COMP-6402", selected: false, reason: "" },
        { id: 3, vehicleNo: "COMP-9812", selected: false, reason: "" },
    ]);

    // Static Data for Premium Presentation
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
            helper: { name: "Dharamraj(C)", phone: "1237567890", stars: 5 },
        },
        vehicleNumber: "LEY-AT-4602",
        zones: { total: 74, completed: 31, active: 29, inactive: 9, stop: 5 },
        heroesOnWork: 89,
        garageDuty: "0/0",
    });

    useEffect(() => {
        const staticCity = 'Sikar';
        const firebaseConfig = getCityFirebaseConfig(staticCity);
        connectFirebase(firebaseConfig, staticCity);
    }, []);

    const handleWardSelect = (ward) => {
        if (selectedWard?.id === ward.id) return;
        setDataLoading(true);
        setSelectedWard(ward);
        setTimeout(() => setDataLoading(false), 500);
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
    };

    const handleRemarkSubmit = () => {
        const topic = remarkForm.topic.trim();
        const description = remarkForm.description.trim();
        if (!topic || !description) return;

        if (editingRemarkId) {
            setRemarks((prev) => prev.map((item) => item.id === editingRemarkId ? { ...item, topic, description } : item));
        } else {
            setRemarks((prev) => [{ id: Date.now(), topic, description }, ...prev]);
        }
        closeAllModals();
    };

    const deleteRemark = (id) => {
        setRemarks((prev) => prev.filter((item) => item.id !== id));
    };

    const zoneGraphMax = 74;

    const currentShiftEvents = [
        { key: "dutyOn", label: "Duty On", time: "08:00 AM", status: "completed" },
        { key: "reachOn", label: "Reached", time: "09:00 AM", status: "completed" },
        { key: "workStatus", label: "Working", time: "Live", status: "active", isLive: true },
        { key: "dutyOff", label: "Off", time: "--:--", status: "pending" },
    ];



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
                        <button type="button" className={styles.sidebarRefreshBtn} onClick={handleRefresh}>
                            <RefreshCw size={14} className={refreshing ? styles.spinIcon : ""} />
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
                                <div className={styles.wardPrimaryName}>{getZoneLabel(ward)}</div>
                                <div className={styles.progressChip} style={getProgressStyle(ward.progress)}>
                                    {ward.progress}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* {dataLoading ? (
                    <div className={styles.loaderContainer}>
                        <WevoisLoader title={`Updating Data for ${selectedWard?.name}...`} />
                    </div>
                ) : ( */}
                <div className={styles.layoutSplit}>
                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        <div className={styles.glassCard}>
                            <div className={styles.cardHeading}>
                                <h3>Heroes on Duty</h3>
                                <UsersIcon size={18} color="var(--themeColor)" />
                            </div>
                            <EnhancedProfile profile={wardData.profiles.driver} role="Captain" isOnline />
                            <EnhancedProfile profile={wardData.profiles.helper} role="Pilot" isOnline={false} />
                            <button type="button" className={styles.vehicleBar} onClick={() => setShowVehicleModal(true)}>
                                <div className={styles.vehicleBarMain}>
                                    <Truck size={14} />
                                    <span>{wardData.vehicleNumber}</span>
                                </div>
                                <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className={`${styles.glassCard} ${styles.statusUnifiedCard}`}>
                            <div className={styles.cardHeading}>
                                <h3>Live Status Board</h3>
                                <Activity size={18} color="var(--themeColor)" />
                            </div>
                            <div className={styles.cardBody}>
                                <StatusLine label="Vehicle Status" value={wardData.vehicleStatus} icon={<Truck size={16} />} color="var(--textDanger)" onClick={() => setActiveStatusModal("vehicle")} />
                                <StatusLine label="Trip Execution" value={`${wardData.trips} Trips`} icon={<TrendingUp size={16} />} />
                                <StatusLine label="App Status" value={wardData.appStatus} icon={<Zap size={16} />} color="var(--textSuccess)" onClick={() => setActiveStatusModal("app")} />
                            </div>
                        </div>

                        <div className={styles.glassCard}>
                            <div className={styles.remarksHeadRow}>
                                <div className={styles.remarksHeadLeft}>
                                    <Plus size={16} color="var(--themeColor)" />
                                    <span className={styles.remarksHeadTitle}>Remark</span>
                                </div>
                                <button type="button" className={styles.addRemarkBtn} onClick={openNewRemarkModal}>Add</button>
                            </div>
                            {remarks.length === 0 ? (
                                <div className={styles.remarkEmpty}>No query yet. Click Add New to create one.</div>
                            ) : (
                                <div className={styles.remarkList}>
                                    {remarks.map((item) => (
                                        <div key={item.id} className={styles.remarkItemCard}>
                                            <div className={styles.remarkItemTopic}>{item.topic}</div>
                                            <div className={styles.remarkItemDescription}>{item.description}</div>
                                            <div className={styles.remarkItemActions}>
                                                <button type="button" className={styles.remarkActionBtn} onClick={() => openEditRemarkModal(item)}><Pencil size={13} /> Edit</button>
                                                <button type="button" className={`${styles.remarkActionBtn} ${styles.deleteActionBtn}`} onClick={() => deleteRemark(item.id)}><Trash2 size={13} /> Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Data Section */}
                    <div className={styles.dataRight}>
                        <div className={`${styles.glassCard} ${styles.fullWidthZoneCard}`}>
                            <div className={styles.cardHeading}>
                                <h3>Ward Analytics</h3>
                                <Clock size={16} color="var(--themeColor)" />
                            </div>
                            <div className={styles.statsFourAcross}>
                                <StatItem label="Total Time" value={wardData.timeStats.total} icon={<Clock size={12} />} layout="iconLeft" />
                                <StatItem label="Active Zone Time" value={wardData.timeStats.inZone} icon={<Clock size={12} />} layout="iconLeft" />
                                <StatItem label="Kilometer Metrics" value={wardData.kmStats.total} icon={<Zap size={12} />} layout="iconLeft" />
                                <StatItem label="Zone Coverage" value={wardData.kmStats.inZone} icon={<Zap size={12} />} layout="iconLeft" />
                            </div>
                        </div>

                        <div className={styles.dataRightBottom}>
                            <div className={styles.centerColumn}>
                                <div className={`${styles.glassCard} ${styles.wardSummary}`}>
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
                                        {[
                                            { label: "Heroes", value: wardData.heroesOnWork, color: "var(--themeColor)", graphPercent: 100 },
                                            { label: "Garage", value: wardData.garageDuty, color: "var(--themeColor)", graphPercent: 0 },
                                            { label: "Total Zone", value: wardData.zones.total, graphPercent: (wardData.zones.total / zoneGraphMax) * 100 },
                                            { label: "Comp. Zone", value: wardData.zones.completed, color: "var(--textSuccess)", graphPercent: (wardData.zones.completed / zoneGraphMax) * 100 },
                                            { label: "Active Zone", value: wardData.zones.active, color: "var(--themeColor)", graphPercent: (wardData.zones.active / zoneGraphMax) * 100 },
                                            { label: "Inactive Zone", value: wardData.zones.inactive, color: "var(--gray)", graphPercent: (wardData.zones.inactive / zoneGraphMax) * 100 },
                                            { label: "Stop Zone", value: wardData.zones.stop, color: "var(--textDanger)", graphPercent: (wardData.zones.stop / zoneGraphMax) * 100 },
                                        ].map((item) => (
                                            <StatItem
                                                key={item.label}
                                                label={item.label}
                                                value={item.value}
                                                color={item.color}
                                                graphPercent={item.graphPercent}
                                                graphStyle="dots"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/*map section with status */}
                            <div className={styles.mapColumn}>
                                <MapSection selectedWard={selectedWard} />
                                <ShiftStatusSection
                                    events={currentShiftEvents}
                                    activeConnectorIndex={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </div>

            {/* Modals */}
            {(activeStatusModal || showRemarkModal || showVehicleModal) && (
                <div className={styles.modalOverlay} onClick={closeAllModals}>
                    <div className={`${styles.modalContent} ${showVehicleModal ? styles.vehicleIssueModal : ""}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {showVehicleModal ? "Vehicle Assignment Desk" : activeStatusModal === "app" ? "Terminal Activity" : activeStatusModal === "vehicle" ? "Logistics Diagnostic" : editingRemarkId ? "Edit Field Query" : "Add Field Query"}
                            </h3>
                            <button className={styles.modalCloseBtn} onClick={closeAllModals}><X size={20} /></button>
                        </div>

                        {showVehicleModal ? (
                            <div className={styles.vehicleIssueWrap}>
                                <div className={styles.vehicleIssueList}>
                                    {vehicleIssueRows.map((item) => (
                                        <div key={item.id} className={styles.vehicleIssueRow}>
                                            <div className={styles.vehicleIssueNoCol}>
                                                <div className={styles.vehicleIssueNo}>{item.vehicleNo}</div>
                                                <input type="checkbox" checked={item.selected} onChange={(e) => setVehicleIssueRows(prev => prev.map(r => r.id === item.id ? { ...r, selected: e.target.checked } : r))} />
                                            </div>
                                            <textarea className={styles.vehicleIssueReason} placeholder="Write reason..." value={item.reason} onChange={(e) => setVehicleIssueRows(prev => prev.map(r => r.id === item.id ? { ...r, reason: e.target.value } : r))} />
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className={styles.modalSubmitBtn} onClick={closeAllModals}>Submit</button>
                            </div>
                        ) : activeStatusModal === "app" ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <ModalRow label="Uptime Status" value={wardData.appStatus} color="var(--textSuccess)" icon={<Activity size={16} />} />
                                <ModalRow label="Signal Strength" value="Optimal (4G Node 2)" icon={<Signal size={16} />} />
                                <ModalRow label="Battery Health" value="84%" icon={<BatteryMedium size={16} />} />
                                <ModalRow label="Sync Latency" value="0.4ms" icon={<Cpu size={16} />} />
                            </div>
                        ) : activeStatusModal === "vehicle" ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <ModalRow label="Logistic Chain" value={wardData.vehicleStatus} color="var(--textDanger)" icon={<Truck size={16} />} />
                                <ModalRow label="Fleet ID" value={wardData.vehicleNumber} icon={<Navigation size={16} />} />
                                <ModalRow label="Fuel Reserve" value="65%" icon={<Zap size={16} />} />
                                <ModalRow label="Mechanical Integrity" value="Nominal" color="var(--textSuccess)" icon={<ShieldCheck size={16} />} />
                            </div>
                        ) : (
                            <div className={styles.remarkFormWrap}>
                                <div className={styles.customDropdownWrap}>
                                    <button type="button" className={styles.customDropdownToggle} onClick={() => setShowTopicDropdown(!showTopicDropdown)}>
                                        {remarkForm.topic || "Select Remark Topic"}
                                    </button>
                                    {showTopicDropdown && (
                                        <div className={styles.customDropdownMenu}>
                                            {remarkTopicOptions.map((item) => (
                                                <button key={item} type="button" className={styles.customDropdownItem} onClick={() => { setRemarkForm({ ...remarkForm, topic: item }); setShowTopicDropdown(false); }}>{item}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <textarea className={styles.remarkTextarea} placeholder="Remark Description" value={remarkForm.description} onChange={(e) => setRemarkForm({ ...remarkForm, description: e.target.value })} />
                                <button className={styles.modalSubmitBtn} onClick={handleRemarkSubmit}>{editingRemarkId ? "Update Query" : "Submit Query"}</button>
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
    <button type="button" className={styles.statusLine} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
        <div className={styles.statusLineLeft}>
            <div style={{ color: "var(--themeColor)", display: "flex" }}>{icon}</div>
            <span className={styles.statusLabel}>{label}</span>
        </div>
        <div className={styles.statusLineRight}>
            <span className={styles.statusValue} style={{ color }}>{value}</span>
            {onClick && <span className={styles.statusClickIndicator}><ChevronRight size={14} /></span>}
        </div>
    </button>
);



const PerformanceGrid = ({ data }) => {
    const items = [
        { label: "Total Lines", value: data.lines.total },
        { label: "Total Halt", value: data.halt.total, color: "var(--textDanger)" },
        { label: "Completed", value: data.lines.completed, color: "var(--textSuccess)" },
        { label: "Curr Halt", value: data.halt.current, color: "var(--textSuccess)" },
        { label: "Skipped", value: data.lines.skipped, color: "var(--textDanger)" },
        { label: "Curr Line", value: data.lines.current, color: "var(--themeColor)" },
    ];
    return (
        <div className={styles.wardSummaryStats}>
            {items.map((item) => <StatItem key={item.label} label={item.label} value={item.value} color={item.color} />)}
        </div>
    );
};

const StatItem = ({ label, value, color, icon, layout, graphPercent, graphStyle = "bar" }) => (
    <div className={`${styles.miniStatItem} ${layout === "iconLeft" ? styles.miniStatItemIconLeft : ""}`}>
        {layout === "iconLeft" && icon && <div className={styles.miniStatLeadIcon}>{icon}</div>}
        <div className={styles.miniStatContent}>
            <div className={styles.miniStatTop}>
                <div className={styles.miniStatHeader}>
                    {layout !== "iconLeft" && icon && <div style={{ color: "var(--themeColor)" }}>{icon}</div>}
                    <span className={styles.miniStatLabel}>{label}</span>
                </div>
                <span className={styles.miniStatValue} style={{ color }}>{value}</span>
            </div>
            {typeof graphPercent === "number" && (
                graphStyle === "dots" ? (
                    <div className={styles.miniStatDotGraph}>
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <span key={idx} className={`${styles.miniStatDot} ${idx < Math.round(graphPercent / 10) ? styles.miniStatDotActive : ""}`} style={idx < Math.round(graphPercent / 10) ? { background: color || "var(--themeColor)" } : undefined} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.miniStatGraphTrack}>
                        <div className={styles.miniStatGraphFill} style={{ width: `${graphPercent}%`, background: color || "var(--themeColor)" }} />
                    </div>
                )
            )}
        </div>
    </div>
);

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
                <div className={styles.enhancedProfilePhone}><Phone size={11} /> <a href={`tel:${profile.phone}`} className={styles.enhancedPhoneLink}>{profile.phone}</a></div>
            </div>
        </div>
        <div className={styles.enhancedRatingRow}><span className={styles.ratingText}>5.0</span></div>
    </div>
);

const ModalRow = ({ label, value, color, icon }) => (
    <div className={styles.modalRow}>
        <div className={styles.modalRowLabel}>{icon} {label}</div>
        <span className={styles.modalRowValue} style={{ color }}>{value}</span>
    </div>
);

export default MonitoringList;
