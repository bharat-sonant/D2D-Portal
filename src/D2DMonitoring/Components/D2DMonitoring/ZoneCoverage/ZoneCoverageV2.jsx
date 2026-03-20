import { useEffect, useState } from "react";
import { Activity, MapPin } from "lucide-react";
import MonitoringCard from "../Common/MonitoringCard/MonitoringCard";
import styles from "./ZoneCoverageV2.module.css";

/** Returns fill gradient + label based on completion stage */
const getStage = (pct) => {
  if (pct < 30) return {
    gradient: "linear-gradient(90deg, #fca5a5 0%, #ef4444 100%)",
    label: "Early Stage",
    badgeBg: "#ef4444",
  };
  if (pct < 55) return {
    gradient: "linear-gradient(90deg, #fde68a 0%, #f59e0b 100%)",
    label: "In Progress",
    badgeBg: "#f59e0b",
  };
  if (pct < 80) return {
    gradient: "linear-gradient(90deg, #6ee7b7 0%, #10b981 100%)",
    label: "On Track",
    badgeBg: "#10b981",
  };
  return {
    gradient: "linear-gradient(90deg, #86efac 0%, #16a34a 100%)",
    label: "Excellent",
    badgeBg: "#16a34a",
  };
};

const ZoneCoverageV2 = ({ items = [] }) => {
  const item = Array.isArray(items)
    ? items.find((i) => i?.variant === "coverageProgress") || items[0]
    : {};
  const percent = Math.max(0, Math.min(100, Number(item?.graphPercent) || 0));

  const [animated, setAnimated] = useState(0);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let rafId;
    let startTs = null;
    const duration = 1000;
    const to = percent;

    const step = (ts) => {
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(to * eased));
      setAnimated(to * eased);
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [percent]);

  const vehicleLeft = Math.max(1, Math.min(98, animated));
  const { gradient, label, badgeBg } = getStage(percent);

  return (
    <MonitoringCard title="Zone Coverage" icon={<Activity size={16} />}>
      <div className={styles.wrap}>

        {/* ── Anchors: Total LEFT · Completed RIGHT ── */}
        <div className={styles.anchorRow}>
          <div className={styles.anchor}>
            <span className={styles.anchorVal}>{item?.totalValue || "--"}</span>
            <span className={styles.anchorLabel}>{item?.totalLabel || "TOTAL LENGTH"}</span>
          </div>

    

          {/* ← COMPLETED now sits top-right (swapped with remaining) */}
          <div className={`${styles.anchor} ${styles.anchorRight}`}>
            <span className={`${styles.anchorVal} ${styles.doneAnchorVal}`}>
              {item?.completedValue || "--"}
            </span>
            <span className={styles.anchorLabel}>{item?.completedLabel || "COMPLETED"}</span>
          </div>
        </div>

        {/* ── Road track — tooltip appears only on hover ── */}
        <div className={styles.roadOuter}>

          {/* dedicated row reserves space for badge — no overlap with road */}
          <div className={styles.badgeRow}>
            <div
              className={styles.pctBadgeWrap}
              style={{ left: `${vehicleLeft}%` }}
            >
              <div className={styles.pctBadge} style={{ background: badgeBg }}>
                <span className={styles.pctNum}>{displayed}%</span>
                <span className={styles.pctSub}>{label}</span>
              </div>
              <div className={styles.pctBadgeTail} style={{ borderTopColor: badgeBg }} />
            </div>
          </div>

          <div className={styles.road}>
            {/* stage-coloured fill */}
            <div
              className={styles.roadCompleted}
              style={{ width: `${animated}%`, background: gradient }}
            />
            <div className={styles.dashLine} />
            <div className={styles.vehicleWrap} style={{ left: `${vehicleLeft}%` }}>
              🚛
            </div>
          </div>

          <div className={styles.roadMarkers}>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* ── Bottom strip — REMAINING (swapped from completed) ── */}
        <div className={styles.remainingStrip}>
          <MapPin size={13} className={styles.remainingIcon} />
          <span className={styles.stripLabel}>REMAINING</span>
          <span className={styles.remainingVal}>{item?.remainingValue || "--"}</span>
        </div>

      </div>
    </MonitoringCard>
  );
};

export default ZoneCoverageV2;
