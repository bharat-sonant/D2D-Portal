import { useEffect, useMemo, useState } from "react";
import styles from "./HaltSummaryReplica.module.css";
import { MoveUpRight, Pause, X, MapPin, BarChart3, Pin, ChevronRight } from "lucide-react";
import MonitoringCard from "../../D2DMonitoring/Components/D2DMonitoring/Common/MonitoringCard/MonitoringCard";

const breakLogs = [
  {
    id: "break-1",
    time: "08:07",
    durationMin: 11,
    statusLabel: "WORK-STOPPED",
    statusType: "danger",
    address: "352, Mohalla Naarwan, Mohalla Vapariyan, Sikar",
    lat: 27.6113,
    lng: 75.1381,
    done: true,
    durationWidth: "wide",
  },
  {
    id: "break-2",
    time: "08:31",
    durationMin: 11,
    statusLabel: "WORK-STOPPED",
    statusType: "danger",
    address: "Deen Mohammed Road Hareejan basti, ward number 5, Fatehpur Rd, Mohalla Vapariyan, Sikar",
    lat: 27.6139,
    lng: 75.1314,
    done: true,
    durationWidth: "wide",
  },
  {
    id: "break-3",
    time: "09:49",
    durationMin: 9,
    statusLabel: "ONGOING STOP",
    statusType: "warn",
    address: "120/18, Bajaj Rd, Imam Ganj, Kalwaria Kunj, Sikar",
    lat: 27.6098,
    lng: 75.1412,
    done: false,
    durationWidth: "medium",
  },
  {
    id: "break-4",
    time: "10:33",
    durationMin: 15,
    statusLabel: "WORK-STOPPED",
    statusType: "danger",
    address: "147, Mohalla Jamidaran, Sikar",
    lat: 27.6073,
    lng: 75.1451,
    done: true,
    durationWidth: "full",
  },
  {
    id: "break-5",
    time: "11:06",
    durationMin: 16,
    statusLabel: "WORK-STOPPED",
    statusType: "danger",
    address: "J48P+H9P, Mohalla Jamidaran, Sikar",
    lat: 27.6056,
    lng: 75.1428,
    done: true,
    durationWidth: "full",
  },
  {
    id: "break-6",
    time: "11:25",
    durationMin: 8,
    statusLabel: "ONGOING STOP",
    statusType: "warn",
    address: "167/11, Mohalla Jamidaran, Sikar",
    lat: 27.6048,
    lng: 75.147,
    done: false,
    durationWidth: "small",
  },
];

const defaultFocus = {
  id: "curr-halt",
  title: "Current Halt Location",
  subtitle: "Live halt point",
  address: breakLogs[2].address,
  lat: breakLogs[2].lat,
  lng: breakLogs[2].lng,
};

const timelineBlocks = [
  {
    id: "work-1",
    status: "active",
    width: 18,
    label: "Working Time",
    hoverText: "Working time: 08:00 AM - 09:00 AM",
    mapFocus: {
      id: "work-1",
      title: "Work Timeline",
      subtitle: "08:00 AM to 09:00 AM",
      address: "Ward 8 active route segment, Sikar",
      lat: 27.6154,
      lng: 75.1369,
    },
  },
  {
    id: "halt-1",
    status: "halt",
    width: 6,
    label: "Halt",
    hoverText: "Halt: 08:07 AM - 08:18 AM",
    mapFocus: {
      id: "break-1",
      title: "Halt Point 1",
      subtitle: "11 min break",
      address: breakLogs[0].address,
      lat: breakLogs[0].lat,
      lng: breakLogs[0].lng,
    },
  },
  {
    id: "work-2",
    status: "active",
    width: 12,
    label: "Working Time",
    hoverText: "Working time: 08:18 AM - 08:31 AM",
    mapFocus: {
      id: "work-2",
      title: "Work Timeline",
      subtitle: "08:18 AM to 08:31 AM",
      address: "Ward 8 mid-route segment, Sikar",
      lat: 27.6144,
      lng: 75.1342,
    },
  },
  {
    id: "halt-2",
    status: "halt",
    width: 6,
    label: "Halt",
    hoverText: "Halt: 08:31 AM - 08:42 AM",
    mapFocus: {
      id: "break-2",
      title: "Halt Point 2",
      subtitle: "11 min break",
      address: breakLogs[1].address,
      lat: breakLogs[1].lat,
      lng: breakLogs[1].lng,
    },
  },
  {
    id: "work-3",
    status: "active",
    width: 32,
    label: "Working Time",
    hoverText: "Working time: 08:42 AM - 09:49 AM",
    mapFocus: {
      id: "work-3",
      title: "Work Timeline",
      subtitle: "08:42 AM to 09:49 AM",
      address: "Ward 8 long route segment, Sikar",
      lat: 27.6121,
      lng: 75.1391,
    },
  },
  {
    id: "halt-3",
    status: "warn",
    width: 10,
    label: "Ongoing Halt",
    hoverText: "Almost 30 min se ruka hai (09:49 AM - Now)",
    mapFocus: defaultFocus,
  },
  {
    id: "work-now",
    status: "idle",
    width: 10,
    label: "Current Work",
    hoverText: "Current work tracking live (Now)",
    mapFocus: {
      id: "line-8",
      title: "Current Line",
      subtitle: "Line #8 in progress",
      address: "Line 8 active segment, Ward 8, Sikar",
      lat: 27.6161,
      lng: 75.1406,
    },
  },
];

const statCards = [
  { value: "31 min", label: "TOTAL LOST", tone: "danger" },
  { value: "3", label: "BREAKS", tone: "warn" },
  { value: "10 min", label: "AVG BREAK", tone: "muted" },
];

const lineProgress = [
  { label: "Line 1-3", value: 100, tone: "green", marker: "done" },
  { label: "Line 4-6", value: 100, tone: "green", marker: "done" },
  { label: "Line 7", value: 100, tone: "green", marker: "done" },
  { label: "Line 8", value: 45, tone: "blue", marker: "active" },
  { label: "Line 9-50", value: 2, tone: "gray", marker: "pending" },
];

const modalMetaByType = {
  timeline: {
    title: "Work Timeline",
    subtitle: "Complete halt chart for today",
    icon: <BarChart3 size={14} />,
    iconTone: "success",
  },
  totalHalt: {
    title: "Total Halt Details",
    subtitle: "3 breaks · 31 min total",
    icon: <span className={styles.dotDanger} />,
    iconTone: "danger",
  },
  currentHalt: {
    title: "Current Halt",
    subtitle: "Vehicle is currently paused",
    icon: <Pause size={14} />,
    iconTone: "success",
  },
  currentLine: {
    title: "Current Line",
    subtitle: "Line #8 - In Progress",
    icon: <Pin size={14} />,
    iconTone: "info",
  },
};

const HaltSummaryReplica = ({ onMapFocusChange }) => {
  const [hoveredBlockId, setHoveredBlockId] = useState("");
  const [activeModalType, setActiveModalType] = useState("");
  const [showAllHalts, setShowAllHalts] = useState(false);
  const [selectedBreakId, setSelectedBreakId] = useState(breakLogs[0].id);
  const [modalMapFocus, setModalMapFocus] = useState(defaultFocus);

  const hoveredBlock = useMemo(
    () => timelineBlocks.find((item) => item.id === hoveredBlockId),
    [hoveredBlockId]
  );

  useEffect(() => {
    if (typeof onMapFocusChange === "function") {
      onMapFocusChange(defaultFocus);
    }
  }, [onMapFocusChange]);

  const openModal = (type, focusData) => {
    setActiveModalType(type);
    setShowAllHalts(false);
    setSelectedBreakId(breakLogs[0].id);
    if (focusData?.lat && focusData?.lng) {
      setModalMapFocus(focusData);
    } else {
      setModalMapFocus(defaultFocus);
    }
    if (typeof onMapFocusChange === "function" && focusData) {
      onMapFocusChange(focusData);
    }
  };

  const closeModal = () => setActiveModalType("");
  const hasMoreThanThreeHalts = breakLogs.length > 3;
  const visibleBreaks = showAllHalts ? breakLogs : breakLogs.slice(0, 3);
  const selectedBreakForMap = breakLogs.find((item) => item.id === selectedBreakId) || breakLogs[0];
  const selectedMapEmbedSrc = `https://www.google.com/maps?q=${selectedBreakForMap.lat},${selectedBreakForMap.lng}&z=15&output=embed`;
  const selectedMapRedirectSrc = `https://www.google.com/maps?q=${selectedBreakForMap.lat},${selectedBreakForMap.lng}`;
  const modalMapEmbedSrc = `https://www.google.com/maps?q=${modalMapFocus.lat},${modalMapFocus.lng}&z=15&output=embed`;
  const modalMapRedirectSrc = `https://www.google.com/maps?q=${modalMapFocus.lat},${modalMapFocus.lng}`;

  return (
    <>
      <MonitoringCard
        title="Halt Summary"
        icon={<MoveUpRight size={16} />}
        noPadding={true}
      >
        <div className={styles.section}>
          <div className={styles.timelineHead}>
            <span className={styles.sectionTitle}>TIMELINE</span>
            <span className={styles.timelineRange}>08:00 - NOW</span>
          </div>
          <div className={styles.timelineTrackWrap}>
            {!!hoveredBlock && <div className={styles.hoverCard}>{hoveredBlock.hoverText}</div>}
            <div className={styles.timelineTrack}>
              {timelineBlocks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.timelineBlock} ${styles[`timeline_${item.status}`]}`}
                  style={{ width: `${item.width}%` }}
                  onMouseEnter={() => setHoveredBlockId(item.id)}
                  onMouseLeave={() => setHoveredBlockId("")}
                  onClick={() => openModal("timeline", item.mapFocus)}
                />
              ))}
            </div>
          </div>
          <div className={styles.timelineMarks}>
            <span>08:00</span>
            <span>09:00</span>
            <span>10:00</span>
            <span>Now</span>
          </div>
        </div>

        <div className={styles.section}>
          <button
            type="button"
            className={styles.metricRow}
            onClick={() => openModal("totalHalt", defaultFocus)}
          >
            <span className={`${styles.metricIcon} ${styles.metricIconDanger}`}>
              <span className={styles.dotDanger} />
            </span>
            <div className={styles.metricContent}>
              <div className={styles.metricHead}>
                <span className={styles.metricLabel}>TOTAL HALT</span>
                <span className={styles.metricTag}>3 BREAKS</span>
              </div>
              <div className={styles.barTrack}>
                <span className={`${styles.barValue} ${styles.barDanger}`} style={{ width: "64%" }} />
                <span className={styles.barMarker} style={{ left: "63%" }} />
              </div>
            </div>
            <span className={styles.metricValueDanger}>1:25
             <p className={styles.metricValueLabel}> Hrs</p>
              </span>
          </button>

          <button
            type="button"
            className={styles.metricRow}
            onClick={() => openModal("currentHalt", defaultFocus)}
          >
            <span className={`${styles.metricIcon} ${styles.metricIconSuccess}`}>
              <Pause size={12} strokeWidth={2.5} />
            </span>
            <div className={styles.metricContent}>
              <div className={styles.metricHead}>
                <span className={styles.metricLabel}>CURR HALT</span>
                <span className={styles.metricLive}>LIVE</span>
              </div>
              <div className={styles.barTrack}>
                <span className={`${styles.barValue} ${styles.barSuccess}`} style={{ width: "9%" }} />
                <span className={styles.barMarker} style={{ left: "8%" }} />
              </div>
            </div>
            <span className={styles.metricValueSuccess}>0:09
              
             <p className={styles.metricValueLabel}> Min</p>
            </span>
          </button>
        </div>

        <button
          type="button"
          className={styles.footerRow}
          onClick={() =>
            openModal("currentLine", {
              id: "line-8",
              title: "Current Line",
              subtitle: "Line #8 in progress",
              address: "Line 8 active segment, Ward 8, Sikar",
              lat: 27.6161,
              lng: 75.1406,
            })
          }
        >
          <div className={styles.currLineLabel}>
            <span className={styles.currLineDot} />
            <span>Current Line</span>
          </div>
          <div className={styles.currLineValue}>
            <strong>8</strong>
      <ChevronRight size={10} />
          </div>
        </button>
      </MonitoringCard>

      {!!activeModalType && (
        <div className={styles.overlay} onClick={closeModal}>
          <div
            className={`${styles.modalCard} ${
              activeModalType === "currentLine" ? styles.modalCardCompact : ""
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeading}>
                <span className={`${styles.modalIcon} ${styles[`modalIcon_${modalMetaByType[activeModalType].iconTone}`]}`}>
                  {modalMetaByType[activeModalType].icon}
                </span>
                <div>
                  <h3>{modalMetaByType[activeModalType].title}</h3>
                  <p>{modalMetaByType[activeModalType].subtitle}</p>
                </div>
              </div>
              <button type="button" className={styles.closeBtn} onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            {activeModalType !== "currentLine" && (
              <div className={styles.statGrid}>
                {statCards.map((item) => (
                  <div key={item.label} className={styles.statCard}>
                    <strong className={styles[`tone_${item.tone}`]}>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {activeModalType === "timeline" && (
              <div className={styles.totalHaltModalBody}>
                <div className={styles.totalHaltLeft}>
                <h4 className={styles.modalSubTitle}>Halt Duration Chart</h4>
                <div className={styles.durationList}>
                  {breakLogs.slice(0, 3).map((item) => (
                    <div key={item.id} className={styles.durationRow}>
                      <span className={styles.durationRowLabel}>{item.time}</span>
                      <div className={styles.durationBarTrack}>
                        <span
                          className={`${styles.durationBarValue} ${item.statusType === "warn" ? styles.durationBarWarn : styles.durationBarDanger}`}
                          style={{ width: item.statusType === "warn" ? "82%" : "100%" }}
                        >
                          {item.durationMin}m
                        </span>
                      </div>
                      <strong>{item.durationMin} min</strong>
                    </div>
                  ))}
                </div>

                <h4 className={styles.modalSubTitle}>Break Log</h4>
                <div className={styles.breakList}>
                  {breakLogs.slice(0, 3).map((item) => (
                    <button
                      type="button"
                      key={`${activeModalType}-${item.id}`}
                      className={styles.breakTimelineItem}
                      onClick={() =>
                        setModalMapFocus({
                          id: item.id,
                          title: "Halt Location",
                          subtitle: `${item.time} halt`,
                          address: item.address,
                          lat: item.lat,
                          lng: item.lng,
                        })
                      }
                    >
                    <div className={styles.breakItem}>
                      <div className={styles.breakTop}>
                        <strong>{item.time}</strong>
                        <span className={styles.breakDurationTag}>{item.durationMin} min</span>
                      </div>
                      <div className={styles.breakStatus}>
                        <span className={`${styles.breakDot} ${item.statusType === "warn" ? styles.breakDotWarn : styles.breakDotDanger}`} />
                        {item.statusLabel}
                      </div>
                      <p>
                        <MapPin size={11} />
                        {item.address}
                      </p>
                    </div>
                    </button>
                  ))}
                </div>
                </div>
                <aside className={styles.totalHaltRight}>
                  <div className={styles.totalHaltMapCard}>
                    <div className={styles.totalHaltMapHead}>
                      <h5>{modalMapFocus.title || "Halt Location"}</h5>
                      <p>
                        {modalMapFocus.lat}, {modalMapFocus.lng}
                      </p>
                    </div>
                    <iframe
                      className={styles.totalHaltMap}
                      title="Timeline Halt Location"
                      src={modalMapEmbedSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    <a
                      className={styles.totalHaltMapBtn}
                      href={modalMapRedirectSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </aside>
              </div>
            )}

            {activeModalType === "totalHalt" && (
              <div className={styles.totalHaltModalBody}>
                <div className={styles.totalHaltLeft}>
                  <div className={styles.totalHaltSectionHead}>
                    <h4 className={styles.modalSubTitle}>Halt Duration Chart</h4>
                    {/* {hasMoreThanThreeHalts && (
                      <button
                        type="button"
                        className={styles.viewAllBtn}
                        onClick={() => setShowAllHalts((prev) => !prev)}
                      >
                        {showAllHalts ? "View Less" : "View All"}
                      </button>
                    )} */}
                  </div>
                  <div className={styles.durationList}>
                    {visibleBreaks.map((item) => (
                      <button
                        key={`duration-${item.id}`}
                        type="button"
                        className={`${styles.durationRow} ${styles.durationRowBtn}`}
                        onClick={() => {
                          setSelectedBreakId(item.id);
                          setModalMapFocus({
                            id: item.id,
                            title: "Halt Location",
                            subtitle: `${item.time} halt`,
                            address: item.address,
                            lat: item.lat,
                            lng: item.lng,
                          });
                        }}
                      >
                        <span className={styles.durationRowLabel}>{item.time}</span>
                        <div className={styles.durationBarTrack}>
                          <span
                            className={`${styles.durationBarValue} ${
                              item.statusType === "warn" ? styles.durationBarWarn : styles.durationBarDanger
                            } ${styles[`durationWidth_${item.durationWidth}`]}`}
                          >
                            {item.durationMin}m
                          </span>
                        </div>
                        <strong>{item.durationMin} min</strong>
                      </button>
                    ))}
                  </div>

                  <h4 className={styles.modalSubTitle}>Break Log</h4>
                  <div className={styles.breakTimelineWrap}>
                    <span className={styles.breakTimelineLine} />
                    <div className={styles.breakList}>
                      {visibleBreaks.map((item) => (
                        <button
                          key={`total-${item.id}`}
                          type="button"
                          className={styles.breakTimelineItem}
                          onClick={() => {
                            setSelectedBreakId(item.id);
                            setModalMapFocus({
                              id: item.id,
                              title: "Halt Location",
                              subtitle: `${item.time} halt`,
                              address: item.address,
                              lat: item.lat,
                              lng: item.lng,
                            });
                          }}
                        >
                          <span
                            className={`${styles.breakTimelineNode} ${
                              item.statusType === "warn" ? styles.breakTimelineNodeWarn : styles.breakTimelineNodeInfo
                            }`}
                          />
                          <div className={styles.breakItem}>
                            <div className={styles.breakTop}>
                              <strong>{item.time}</strong>
                              <span className={styles.breakDurationTag}>{item.durationMin} min</span>
                            </div>
                            <div className={styles.breakStatus}>
                              <span
                                className={`${styles.breakDot} ${
                                  item.statusType === "warn" ? styles.breakDotWarn : styles.breakDotDanger
                                }`}
                              />
                              {item.statusLabel}
                            </div>
                            <p>
                              <MapPin size={11} />
                              {item.address}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className={styles.totalHaltRight}>
                  <div className={styles.totalHaltMapCard}>
                    <div className={styles.totalHaltMapHead}>
                      <h5>Halt Location</h5>
                      <p>
                        {selectedBreakForMap.lat}, {selectedBreakForMap.lng}
                      </p>
                    </div>
                    <iframe
                      className={styles.totalHaltMap}
                      title="Total Halt Location"
                      src={selectedMapEmbedSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    <a
                      className={styles.totalHaltMapBtn}
                      href={selectedMapRedirectSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </aside>
              </div>
            )}

            {activeModalType === "currentHalt" && (
              <div className={styles.totalHaltModalBody}>
                <div className={styles.totalHaltLeft}>
                <h4 className={styles.modalSubTitle}>Current Stop Info</h4>
                <div className={styles.currentInfoCard}>
                  <div className={styles.breakTop}>
                    <strong>09:49</strong>
                    <span className={styles.currentTag}>9 min - ongoing</span>
                  </div>
                  <div className={styles.breakStatus}>
                    <span className={`${styles.breakDot} ${styles.breakDotWarn}`} />
                    VEHICLE HALTED
                  </div>
                  <p>
                    <MapPin size={11} />
                    {breakLogs[2].address}
                  </p>
                </div>

                <h4 className={styles.modalSubTitle}>Today's Break History</h4>
                <div className={styles.historyList}>
                  {breakLogs.map((item) => (
                    <button
                      type="button"
                      key={`history-${item.id}`}
                      className={`${styles.historyRow} ${styles.historyRowBtn}`}
                      onClick={() =>
                        setModalMapFocus({
                          id: item.id,
                          title: "Halt Location",
                          subtitle: `${item.time} halt`,
                          address: item.address,
                          lat: item.lat,
                          lng: item.lng,
                        })
                      }
                    >
                      <span className={styles.durationRowLabel}>{item.time}</span>
                      <div className={styles.historyBarTrack}>
                        <span
                          className={`${styles.historyBarValue} ${item.done ? styles.historyDone : styles.historyNow}`}
                          style={{ width: item.done ? "96%" : "78%" }}
                      >
                        {item.durationMin}m
                      </span>
                      </div>
                      <strong>{item.done ? "Done" : "Now"}</strong>
                    </button>
                  ))}
                </div>
                </div>
                <aside className={styles.totalHaltRight}>
                  <div className={styles.totalHaltMapCard}>
                    <div className={styles.totalHaltMapHead}>
                      <h5>{modalMapFocus.title || "Halt Location"}</h5>
                      <p>
                        {modalMapFocus.lat}, {modalMapFocus.lng}
                      </p>
                    </div>
                    <iframe
                      className={styles.totalHaltMap}
                      title="Current Halt Location"
                      src={modalMapEmbedSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    <a
                      className={styles.totalHaltMapBtn}
                      href={modalMapRedirectSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </aside>
              </div>
            )}

            {activeModalType === "currentLine" && (
              <>
                <div className={styles.statGrid}>
                  <div className={styles.statCard}>
                    <strong className={styles.tone_info}>8</strong>
                    <span>CURRENT LINE</span>
                  </div>
                  <div className={styles.statCard}>
                    <strong className={styles.tone_success}>7</strong>
                    <span>COMPLETED</span>
                  </div>
                  <div className={styles.statCard}>
                    <strong className={styles.tone_muted}>50</strong>
                    <span>TOTAL LINES</span>
                  </div>
                </div>

                <h4 className={`${styles.modalSubTitle} ${styles.modalSubTitle2}`}>Line Progress</h4>
                <div className={styles.lineProgressList}>
                  {lineProgress.map((item) => (
                    <div key={item.label} className={styles.lineProgressRow}>
                      <span className={styles.durationRowLabel}>{item.label}</span>
                      <div className={styles.lineProgressTrack}>
                        <span
                          className={`${styles.lineProgressValue} ${styles[`line_${item.tone}`]}`}
                          style={{ width: `${item.value}%` }}
                        >
                          {item.value > 3 ? `${item.value}%` : ""}
                        </span>
                      </div>
                      <strong>{item.marker === "done" ? "Done" : item.marker === "active" ? "Now" : "-"}</strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HaltSummaryReplica;
