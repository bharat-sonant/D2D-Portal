import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import { Truck, MapPin, Fuel, Building2, Warehouse, Clock, Navigation } from "lucide-react";
import * as mapAction from "../../../Action/D2DMonitoring/MapSectionAction/MapSectionAction";
import * as vehicleAction from "../../../Action/D2DMonitoring/Monitoring/VehicleStatusAction";
import styles from "./VehicleTrackingMap.module.css";

const STATUS_META = {
    ward:        { label: "In Ward",          desc: "Vehicle is collecting within the ward",  color: "#16a34a", bg: "#f0fdf4", Icon: MapPin },
    petrolpump:  { label: "At Petrol Pump",   desc: "Vehicle stopped for refuelling",          color: "#d97706", bg: "#fffbeb", Icon: Fuel },
    dumpingyard: { label: "At Dumping Yard",  desc: "Unloading waste at dumping yard",         color: "#ea580c", bg: "#fff7ed", Icon: Warehouse },
    garage:      { label: "In Garage",        desc: "Vehicle under inspection or maintenance", color: "#dc2626", bg: "#fef2f2", Icon: Building2 },
};

const getStatusMeta = (status = "") => {
    const loc = String(status).replace(/-in$/i, "").replace(/-out$/i, "").toLowerCase();
    return STATUS_META[loc] || { label: "In Transit", desc: "Vehicle is on the move", color: "#6b7280", bg: "#f9fafb", Icon: Navigation };
};

const DOT_COLOR = {
    entered:   "#16a34a",
    exited:    "#6b7280",
    fuel_stop: "#d97706",
};

const VehicleTrackingMap = ({
    vehicleId,
    vehicleNumber,
    city,
    selectedWard,
    lineStatusByLine = {},
}) => {
    const mapRef = useRef(null);
    const [isGoogleReady, setIsGoogleReady]   = useState(mapAction.isGoogleMapsReady());
    const [boundaryJson, setBoundaryJson]      = useState(null);
    const [linesGeoJson, setLinesGeoJson]      = useState(null);
    const [vehicleData, setVehicleData]        = useState({ currentStatus: null, eventLog: [], quickSummary: {} });

    useEffect(() => {
        if (!city || !selectedWard?.id) return;
        mapAction.fetchWardMapData(city, selectedWard.id, setBoundaryJson, setLinesGeoJson);
    }, [city, selectedWard?.id]);

    useEffect(() => {
        if (!vehicleId) return;
        return vehicleAction.subscribeVehicleStatusForToday(vehicleId, setVehicleData);
    }, [vehicleId]);

    useEffect(() => {
        if (isGoogleReady) return;
        return mapAction.waitForGoogleMapsReady(setIsGoogleReady);
    }, [isGoogleReady]);

    const wardBoundary = useMemo(() => mapAction.getBoundaryPathFromWardBoundaryJson(boundaryJson), [boundaryJson]);
    const linePaths    = useMemo(() => mapAction.getLinePathsFromGeoJson(linesGeoJson),             [linesGeoJson]);
    const lineOptions  = useMemo(() => mapAction.getLineOptionsForPaths(linePaths, lineStatusByLine), [linePaths, lineStatusByLine]);

    useEffect(() => {
        if (!isGoogleReady) return;
        return mapAction.scheduleMapZoom(mapRef, linePaths, wardBoundary);
    }, [isGoogleReady, wardBoundary, linePaths]);

    const { currentStatus, eventLog, quickSummary } = vehicleData;
    const statusMeta = getStatusMeta(currentStatus || "");
    const StatusIcon = statusMeta.Icon;

    if (!isGoogleReady) return null;

    return (
        <div className={styles.root}>
            {/* ── Map ── */}
            <div className={styles.mapArea}>
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    defaultCenter={{ lat: 27.625, lng: 75.13 }}
                    defaultZoom={14}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{ disableDefaultUI: true }}
                >
                    {wardBoundary.length > 0 && (
                        <Polyline path={wardBoundary} options={mapAction.WARD_BOUNDARY_STYLE} />
                    )}
                    {linePaths.map((path, i) => (
                        <Polyline key={`line-${i}`} path={path} options={lineOptions[i]} />
                    ))}
                </GoogleMap>

                {/* Live status badge overlaid on the map */}
                {currentStatus && (
                    <div
                        className={styles.statusBadge}
                        style={{ background: statusMeta.bg, borderColor: statusMeta.color }}
                    >
                        <StatusIcon size={12} style={{ color: statusMeta.color }} />
                        <span style={{ color: statusMeta.color }}>{statusMeta.label}</span>
                    </div>
                )}
            </div>

            {/* ── Sidebar ── */}
            <div className={styles.sidebar}>
                {/* Vehicle header */}
                <div className={styles.vehicleHeader}>
                    <span className={styles.vehicleIcon}><Truck size={14} /></span>
                    <div>
                        <div className={styles.vehicleLabel}>Live Tracking</div>
                        <div className={styles.vehicleNumber}>{vehicleNumber || selectedWard?.name || "—"}</div>
                    </div>
                </div>

                {/* Current status card */}
                <div
                    className={styles.currentStatus}
                    style={{ background: statusMeta.bg, borderColor: `${statusMeta.color}44` }}
                >
                    <StatusIcon size={15} style={{ color: statusMeta.color, flexShrink: 0 }} />
                    <div>
                        <div className={styles.currentStatusLabel} style={{ color: statusMeta.color }}>
                            {statusMeta.label}
                        </div>
                        <div className={styles.currentStatusDesc}>{statusMeta.desc}</div>
                    </div>
                </div>

                {/* Quick stats */}
                {quickSummary.wardEntries !== undefined && (
                    <div className={styles.quickStats}>
                        <div className={styles.statChip}>
                            <span className={styles.statVal}>{quickSummary.wardEntries}</span>
                            <span className={styles.statLbl}>Ward Entries</span>
                        </div>
                        <div className={styles.statChip}>
                            <span className={styles.statVal}>{quickSummary.fuelStops}</span>
                            <span className={styles.statLbl}>Fuel Stops</span>
                        </div>
                        <div className={`${styles.statChip} ${styles.statChipWide}`}>
                            <Clock size={11} style={{ color: "#6b7280" }} />
                            <span className={styles.statVal}>{quickSummary.inWard}</span>
                            <span className={styles.statLbl}>In Ward</span>
                        </div>
                    </div>
                )}

                {/* Event log */}
                <div className={styles.logHeader}>Activity Log</div>
                <div className={styles.eventLog}>
                    {eventLog.length === 0 ? (
                        <div className={styles.emptyLog}>No activity recorded yet</div>
                    ) : (
                        [...eventLog].reverse().map((entry, i) => (
                            <div key={entry.id} className={styles.eventRow}>
                                <div className={styles.eventAxis}>
                                    <span
                                        className={styles.eventDot}
                                        style={{ background: DOT_COLOR[entry.kind] || "#6b7280" }}
                                    />
                                    {i < eventLog.length - 1 && <span className={styles.eventLine} />}
                                </div>
                                <div className={styles.eventBody}>
                                    <div className={styles.eventTop}>
                                        <span className={styles.eventTitle}>{entry.title}</span>
                                        <span className={styles.eventTime}>{entry.time}</span>
                                    </div>
                                    <div className={styles.eventDuration}>{entry.duration}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleTrackingMap;
