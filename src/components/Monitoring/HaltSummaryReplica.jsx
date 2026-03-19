import { useEffect, useMemo, useState } from "react";
import styles from "./HaltSummaryReplica.module.css";
import * as haltInfoAction from "../../D2DMonitoring/Action/D2DMonitoring/Monitoring/HaltInfoAction";
import { MoveUpRight, Pause, X, MapPin, BarChart3, Pin, ChevronRight } from "lucide-react";
import MonitoringCard from "../../D2DMonitoring/Components/D2DMonitoring/Common/MonitoringCard/MonitoringCard";


const defaultFocus = {
  id: "curr-halt",
  title: "Current Halt Location",
  subtitle: "Live halt point",
  address: "",
  lat: 0,
  lng: 0,
};





const HaltSummaryReplica = ({ onMapFocusChange, ward }) => {
  const [hoveredBlockId, setHoveredBlockId] = useState("");
  const [activeModalType, setActiveModalType] = useState("");
  const [showAllHalts, setShowAllHalts] = useState(false);
  const [selectedBreakId, setSelectedBreakId] = useState(null);
  const [modalMapFocus, setModalMapFocus] = useState(defaultFocus);
  const [haltData, setHaltData] = useState(null);

  useEffect(() => {
    haltInfoAction.getHaltInfo(ward, setHaltData);
  }, [ward]);

  const haltList = useMemo(() => {
    if (!haltData || typeof haltData !== "object") return [];
    return Object.entries(haltData).map(([key, value]) => {
      const locMatch = String(value.location || "").match(/\(([^,]+),([^)]+)\)/);
      const lat = locMatch ? parseFloat(locMatch[1]) : 0;
      const lng = locMatch ? parseFloat(locMatch[2]) : 0;
      const done = !!value.endTime;
      const statusType = value.haltType === "work-stopped" ? "danger" : "warn";
      const statusLabel = value.haltType === "work-stopped" ? "WORK-STOPPED" : "ONGOING STOP";
      return {
        id: key,
        time: value.startTime || key,
        durationMin: value.duration || 0,
        endTime: value.endTime || null,
        statusLabel,
        statusType,
        address: value.locality || "",
        lat,
        lng,
        done,
      };
    });
  }, [haltData]);

  useEffect(() => {
    if (haltList.length > 0) {
      setSelectedBreakId(haltList[0].id);
    }
  }, [haltList]);

  const timelineBlocks = useMemo(() => {
    if (haltList.length === 0) return [];

    const parseMin = (t) => {
      const [h, m] = String(t).split(":").map(Number);
      return h * 60 + (m || 0);
    };
    const fmtTime = (min) => {
      const h = Math.floor(min / 60);
      const m = String(min % 60).padStart(2, "0");
      return `${h}:${m}`;
    };

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const sorted = [...haltList].sort((a, b) => parseMin(a.time) - parseMin(b.time));
    const startMin = parseMin(sorted[0].time);
    const totalMin = nowMin - startMin;
    if (totalMin <= 0) return [];

    const blocks = [];
    let cursor = startMin;

    sorted.forEach((halt, i) => {
      const haltStart = parseMin(halt.time);
      const haltEnd = halt.endTime ? parseMin(halt.endTime) : nowMin;
      const haltDur = Math.max(haltEnd - haltStart, 0);

      if (haltStart > cursor) {
        const w = ((haltStart - cursor) / totalMin) * 100;
        blocks.push({
          id: `work-${i}`,
          status: "active",
          width: parseFloat(w.toFixed(2)),
          label: "Working Time",
          hoverText: `Working: ${fmtTime(cursor)} - ${fmtTime(haltStart)}`,
          mapFocus: null,
        });
      }

      const hw = (haltDur / totalMin) * 100;
      blocks.push({
        id: halt.id,
        status: halt.done ? "halt" : "warn",
        width: parseFloat(hw.toFixed(2)),
        label: halt.done ? "Halt" : "Ongoing Halt",
        hoverText: `${halt.statusLabel}: ${halt.time} - ${halt.endTime || "Now"} (${halt.durationMin} min)`,
        mapFocus: halt.lat && halt.lng ? {
          id: halt.id,
          title: "Halt Location",
          subtitle: `${halt.durationMin} min halt`,
          address: halt.address,
          lat: halt.lat,
          lng: halt.lng,
        } : null,
      });

      cursor = haltEnd;
    });

    if (cursor < nowMin) {
      const w = ((nowMin - cursor) / totalMin) * 100;
      blocks.push({
        id: "work-now",
        status: "idle",
        width: parseFloat(w.toFixed(2)),
        label: "Current Work",
        hoverText: `Working: ${fmtTime(cursor)} - Now`,
        mapFocus: null,
      });
    }

    return blocks;
  }, [haltList]);

  const totalBreaks = haltList.length;
  const totalDurationMin = haltList.reduce((sum, item) => sum + (item.durationMin || 0), 0);
  const avgBreakMin = totalBreaks > 0 ? Math.round(totalDurationMin / totalBreaks) : 0;
  const currentHalt = haltList.find((item) => !item.done) || null;
  const totalHaltHrs = Math.floor(totalDurationMin / 60);
  const totalHaltMins = String(totalDurationMin % 60).padStart(2, "0");
  const totalHaltDisplay = `${totalHaltHrs}:${totalHaltMins}`;

  const currentHaltFocus = useMemo(() => {
    if (currentHalt?.lat && currentHalt?.lng) {
      return {
        id: "curr-halt",
        title: "Current Halt Location",
        subtitle: "Live halt point",
        address: currentHalt.address,
        lat: currentHalt.lat,
        lng: currentHalt.lng,
      };
    }
    return defaultFocus;
  }, [currentHalt]);

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
    setSelectedBreakId(haltList[0]?.id || null);
    if (focusData?.lat && focusData?.lng) {
      setModalMapFocus(focusData);
    } else if (currentHaltFocus?.lat && currentHaltFocus?.lng) {
      setModalMapFocus(currentHaltFocus);
    } else if (haltList[0]?.lat && haltList[0]?.lng) {
      setModalMapFocus({
        id: haltList[0].id,
        title: "Halt Location",
        subtitle: `${haltList[0].time} halt`,
        address: haltList[0].address,
        lat: haltList[0].lat,
        lng: haltList[0].lng,
      });
    }
    if (typeof onMapFocusChange === "function" && focusData) {
      onMapFocusChange(focusData);
    }
  };

  const closeModal = () => setActiveModalType("");



  const modalMetaByType = useMemo(() => ({
    timeline: {
      title: "Work Timeline",
      subtitle: "Complete halt chart for today",
      icon: <BarChart3 size={14} />,
      iconTone: "success",
    },
    totalHalt: {
      title: "Total Halt Details",
      subtitle: `${totalBreaks} breaks · ${totalDurationMin} min total`,
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
  }), [totalBreaks, totalDurationMin]);
  const hasMoreThanThreeHalts = haltList.length > 3;
  const visibleBreaks = showAllHalts ? haltList : haltList.slice(0, 3);
  const selectedBreakForMap = haltList.find((item) => item.id === selectedBreakId) || haltList[0] || null;
  const selectedMapEmbedSrc = selectedBreakForMap ? `https://www.google.com/maps?q=${selectedBreakForMap.lat},${selectedBreakForMap.lng}&z=15&output=embed` : "";
  const selectedMapRedirectSrc = selectedBreakForMap ? `https://www.google.com/maps?q=${selectedBreakForMap.lat},${selectedBreakForMap.lng}` : "";
  const modalMapEmbedSrc = (modalMapFocus?.lat && modalMapFocus?.lng) ? `https://www.google.com/maps?q=${modalMapFocus.lat},${modalMapFocus.lng}&z=15&output=embed` : "";
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
            <span>{haltList[0]?.time || "—"}</span>
            <span>Now</span>
          </div>
        </div>

        <div className={styles.section}>
          <button
            type="button"
            className={styles.metricRow}
            onClick={() => openModal("totalHalt", currentHaltFocus)}
          >
            <span className={`${styles.metricIcon} ${styles.metricIconDanger}`}>
              <span className={styles.dotDanger} />
            </span>
            <div className={styles.metricContent}>
              <div className={styles.metricHead}>
                <span className={styles.metricLabel}>TOTAL HALT</span>
                <span className={styles.metricTag}>{totalBreaks} BREAKS</span>
              </div>
              <div className={styles.barTrack}>
                <span className={`${styles.barValue} ${styles.barDanger}`} style={{ width: `${Math.min((totalDurationMin / 120) * 100, 100)}%` }} />
                <span className={styles.barMarker} style={{ left: `${Math.min((totalDurationMin / 120) * 100, 98)}%` }} />
              </div>
            </div>
            <span className={styles.metricValueDanger}>{totalHaltDisplay}
             <p className={styles.metricValueLabel}> Hrs</p>
              </span>
          </button>

          <button
            type="button"
            className={styles.metricRow}
            onClick={() => openModal("currentHalt", currentHaltFocus)}
          >
            <span className={`${styles.metricIcon} ${styles.metricIconSuccess}`}>
              <Pause size={12} strokeWidth={2.5} />
            </span>
            <div className={styles.metricContent}>
              <div className={styles.metricHead}>
                <span className={styles.metricLabel}>CURR HALT</span>
                {currentHalt ? <span className={styles.metricLive}>LIVE</span> : <span className={styles.metricTag}>NONE</span>}
              </div>
              <div className={styles.barTrack}>
                <span className={`${styles.barValue} ${styles.barSuccess}`} style={{ width: `${Math.min((currentHalt?.durationMin || 0) / 60 * 100, 100)}%` }} />
                <span className={styles.barMarker} style={{ left: `${Math.min((currentHalt?.durationMin || 0) / 60 * 100, 98)}%` }} />
              </div>
            </div>
            <span className={styles.metricValueSuccess}>{currentHalt ? `0:${String(currentHalt.durationMin).padStart(2, "0")}` : "—"}
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
                {[
                  { value: `${totalHaltDisplay} Hrs`, label: "TOTAL LOST", tone: "danger" },
                  { value: String(totalBreaks), label: "BREAKS", tone: "warn" },
                  { value: `${avgBreakMin} min`, label: "AVG BREAK", tone: "muted" },
                ].map((item) => (
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
                  {haltList.map((item) => (
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
                  {haltList.map((item) => (
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
                      {modalMapFocus.address && <p>{modalMapFocus.address}</p>}
                    </div>
                    {modalMapEmbedSrc ? (
                      <iframe
                        className={styles.totalHaltMap}
                        title="Timeline Halt Location"
                        src={modalMapEmbedSrc}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    ) : (
                      <div className={styles.totalHaltMap} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 13 }}>
                        Click a halt to view location
                      </div>
                    )}
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
                        {selectedBreakForMap?.lat}, {selectedBreakForMap?.lng}
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
                {currentHalt ? (
                  <div className={styles.currentInfoCard}>
                    <div className={styles.breakTop}>
                      <strong>{currentHalt.time}</strong>
                      <span className={styles.currentTag}>{currentHalt.durationMin} min - ongoing</span>
                    </div>
                    <div className={styles.breakStatus}>
                      <span className={`${styles.breakDot} ${styles.breakDotWarn}`} />
                      {currentHalt.statusLabel}
                    </div>
                    <p>
                      <MapPin size={11} />
                      {currentHalt.address}
                    </p>
                  </div>
                ) : (
                  <div className={styles.currentInfoCard}>
                    <p>No active halt</p>
                  </div>
                )}

                <h4 className={styles.modalSubTitle}>Today's Break History</h4>
                <div className={styles.historyList}>
                  {haltList.map((item) => (
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
                  {[
                    { label: "Line 1-3", value: 100, tone: "green", marker: "done" },
                    { label: "Line 4-6", value: 100, tone: "green", marker: "done" },
                    { label: "Line 7",   value: 100, tone: "green", marker: "done" },
                    { label: "Line 8",   value: 45,  tone: "blue",  marker: "active" },
                    { label: "Line 9-50",value: 2,   tone: "gray",  marker: "pending" },
                  ].map((item) => (
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
