import { useEffect, useMemo, useState } from "react";
import styles from "./HaltSummaryReplica.module.css";
import { MoveUpRight, Pause, X, MapPin, BarChart3, Pin, ChevronRight } from "lucide-react";

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
    if (typeof onMapFocusChange === "function" && focusData) {
      onMapFocusChange(focusData);
    }
  };

  const closeModal = () => setActiveModalType("");

  return (
    <>
      <section className={styles.card} aria-label="Halt Summary">
        <div className={styles.headerRow}>
          <h4 className={styles.title}>Halt Summary</h4>
          <span className={styles.iconWrap}>
            <MoveUpRight size={13} strokeWidth={2.1} />
          </span>
        </div>

        <div className={styles.section}>
          <div className={styles.timelineHead}>
            <span className={styles.sectionTitle}>WORK TIMELINE</span>
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
            <span className={styles.metricValueDanger}>1:25</span>
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
            <span className={styles.metricValueSuccess}>0:09</span>
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
      </section>

      {!!activeModalType && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
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

            {(activeModalType === "timeline" || activeModalType === "totalHalt") && (
              <>
                <h4 className={styles.modalSubTitle}>HALT DURATION CHART</h4>
                <div className={styles.durationList}>
                  {breakLogs.map((item) => (
                    <div key={item.id} className={styles.durationRow}>
                      <span>{item.time}</span>
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

                <h4 className={styles.modalSubTitle}>BREAK LOG</h4>
                <div className={styles.breakList}>
                  {breakLogs.map((item) => (
                    <div key={`${activeModalType}-${item.id}`} className={styles.breakItem}>
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
                  ))}
                </div>
              </>
            )}

            {activeModalType === "currentHalt" && (
              <>
                <h4 className={styles.modalSubTitle}>CURRENT STOP INFO</h4>
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

                <h4 className={styles.modalSubTitle}>TODAY&apos;S BREAK HISTORY</h4>
                <div className={styles.historyList}>
                  {breakLogs.map((item) => (
                    <div key={`history-${item.id}`} className={styles.historyRow}>
                      <span>{item.time}</span>
                      <div className={styles.historyBarTrack}>
                        <span
                          className={`${styles.historyBarValue} ${item.done ? styles.historyDone : styles.historyNow}`}
                          style={{ width: item.done ? "96%" : "78%" }}
                        >
                          {item.durationMin}m
                        </span>
                      </div>
                      <strong>{item.done ? "done" : "now"}</strong>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeModalType === "currentLine" && (
              <>
                <div className={styles.statGrid}>
                  <div className={styles.statCard}>
                    <strong className={styles.tone_info}>8</strong>
                    <span>CURR LINE</span>
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

                <h4 className={styles.modalSubTitle}>LINE PROGRESS</h4>
                <div className={styles.lineProgressList}>
                  {lineProgress.map((item) => (
                    <div key={item.label} className={styles.lineProgressRow}>
                      <span>{item.label}</span>
                      <div className={styles.lineProgressTrack}>
                        <span
                          className={`${styles.lineProgressValue} ${styles[`line_${item.tone}`]}`}
                          style={{ width: `${item.value}%` }}
                        >
                          {item.value > 3 ? `${item.value}%` : ""}
                        </span>
                      </div>
                      <strong>{item.marker === "done" ? "done" : item.marker === "active" ? "now" : "-"}</strong>
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
