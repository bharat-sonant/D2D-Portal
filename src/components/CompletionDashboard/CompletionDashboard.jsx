import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CompletionDashboard.module.css";
import { Map, TrendingUp } from "lucide-react";
import MonitoringCard from "../../D2DMonitoring/Components/D2DMonitoring/Common/MonitoringCard/MonitoringCard";

const clampPercent = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

const CompletionDashboard = ({ totalLines, completedLines, skippedLines }) => {
  const dummyTotal = 118;
  const dummyCompleted = 72;
  const dummySkipped = 7;

  const safeTotal = Number(totalLines) > 0 ? Number(totalLines) : dummyTotal;
  const safeCompleted = Number(completedLines) >= 0 ? Number(completedLines) : dummyCompleted;
  const safeSkipped = Number(skippedLines) >= 0 ? Number(skippedLines) : dummySkipped;

  const completionPercent = useMemo(
    () => clampPercent(safeTotal > 0 ? (safeCompleted / safeTotal) * 100 : 0),
    [safeCompleted, safeTotal]
  );

  const skippedPercent = useMemo(
    () => clampPercent(safeTotal > 0 ? (safeSkipped / safeTotal) * 100 : 0),
    [safeSkipped, safeTotal]
  );
  const pendingPercent = useMemo(
    () => clampPercent(100 - completionPercent - skippedPercent),
    [completionPercent, skippedPercent]
  );

  const [animatedCompletion, setAnimatedCompletion] = useState(0);
  const [animatedSkipped, setAnimatedSkipped] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const gaugeRef = useRef(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setAnimatedCompletion(completionPercent);
      setAnimatedSkipped(skippedPercent);
    });
    return () => cancelAnimationFrame(rafId);
  }, [completionPercent, skippedPercent]);

  const animatedPending = clampPercent(100 - animatedCompletion - animatedSkipped);
  const pendingLines = Math.max(safeTotal - safeCompleted - safeSkipped, 0);

  const segments = useMemo(() => {
    const segmentDefs = [
      {
        key: "completed",
        label: "Completed",
        value: animatedCompletion,
        lines: safeCompleted,
        className: styles.segmentCompleted,
      },
      {
        key: "pending",
        label: "Pending",
        value: animatedPending,
        lines: pendingLines,
        className: styles.segmentPending,
      },
      {
        key: "skipped",
        label: "Skipped",
        value: animatedSkipped,
        lines: safeSkipped,
        className: styles.segmentSkipped,
      },
    ];

    const activeSegments = segmentDefs.filter((segment) => segment.value > 0.001);
    const segmentGap = 2.4;
    const activeLength = Math.max(100 - activeSegments.length * segmentGap, 0);
    let offset = 0;

    return activeSegments.map((segment) => {
      const length = (segment.value / 100) * activeLength;
      const segmentData = {
        ...segment,
        length,
        offset,
      };
      offset += length + segmentGap;
      return segmentData;
    });
  }, [animatedCompletion, animatedPending, animatedSkipped, pendingLines, safeCompleted, safeSkipped]);

  const showTooltip = (event, segment) => {
    if (!gaugeRef.current) return;
    const bounds = gaugeRef.current.getBoundingClientRect();

    setTooltip({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top - 12,
      label: segment.label,
      lines: segment.lines,
      percent: segment.value,
    });
  };

  return (
    <MonitoringCard title="Ward Lines" icon={<Map size={16} />}>
      <div className="d-flex">
        <div className={styles.legendRow}>
          <div className={styles.legendItem}>
            <span>Completed Lines </span>
            <span className={`${styles.legendDot} ${styles.completedDot}`} ><b>{safeCompleted}</b></span>
          </div>
          <div className={styles.legendItem}>
            <span>Pending Lines</span>
            <span className={`${styles.legendDot} ${styles.pendingDot}`}><b>{pendingLines}</b></span>
          </div>
          <div className={styles.legendItem}>
            <span>Skipped Lines</span>
            <span className={`${styles.legendDot} ${styles.skippedDot}`} ><b>{safeSkipped}</b></span>
          </div>
        </div>
        <div className={styles.gaugeSection}>
          <div className={styles.gaugeWrap} ref={gaugeRef}>
            <svg
              className={styles.donutSvg}
              viewBox="0 0 200 200"
              role="img"
              aria-label={`Completed ${completionPercent.toFixed(1)} percent, pending ${pendingPercent.toFixed(1)} percent, skipped ${skippedPercent.toFixed(1)} percent`}
            >
              <g transform="rotate(-90 100 100)">
                <circle cx="100" cy="100" r="64" pathLength="100" className={styles.baseRing} />
                {segments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="100"
                    cy="100"
                    r="64"
                    pathLength="100"
                    className={`${styles.segmentRing} ${segment.className}`}
                    strokeDasharray={`${segment.length} ${100 - segment.length}`}
                    strokeDashoffset={-segment.offset}
                    onMouseMove={(event) => showTooltip(event, segment)}
                    onMouseEnter={(event) => showTooltip(event, segment)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </g>
            </svg>
            <div className={styles.centerData}>
              <span className={styles.centerPercent}>{safeTotal}</span>
              <span className={styles.centerLabel}>Total Lines</span>
            </div>
            {tooltip && (
              <div className={styles.tooltip} style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}>
                <strong>{tooltip.label}</strong> {tooltip.lines} ({tooltip.percent.toFixed(1)}%)
              </div>
            )}
          </div>
        </div>
      </div>
    </MonitoringCard>
  );
};

export default CompletionDashboard;
