import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from '../../Pages/D2DRealtime/Realtime.module.css';

/**
 * ShiftTimelineTrigger – Compact clickable bar.
 * Shows mini dot track + current status summary.
 * Click → opens ShiftTimelineModal.
 */
const ShiftTimelineTrigger = ({ events, onOpen }) => {
    const activeEvent   = events.find(e => e.status === 'active');
    const hasData       = events.some(e => e.time && e.time !== '00:00' && e.time !== '--:--' && e.key !== 'workStatus');
    const dutyOnEvent   = events.find(e => e.key === 'dutyOn');
    const dutyOffEvent  = events.find(e => e.key === 'dutyOff');
    const allDone       = dutyOffEvent?.status === 'completed';

    return (
        <button
            className={styles.shiftTriggerBtn}
            onClick={onOpen}
            type="button"
        >
            {/* ── Mini dot track ── */}
            <div className={styles.shiftMiniTrack}>
                {events.map((event, i) => (
                    <React.Fragment key={event.key}>
                        <span className={`${styles.shiftMiniDot} ${styles[`shiftMiniDot_${event.status}`]}`} />
                        {i < events.length - 1 && (
                            <span className={`${styles.shiftMiniLine} ${
                                event.status === 'completed'
                                    ? styles.shiftMiniLineCompleted
                                    : event.status === 'active'
                                        ? styles.shiftMiniLineActive
                                        : styles.shiftMiniLinePending
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Status summary ── */}
            <div className={styles.shiftTriggerStatus}>
                {!hasData ? (
                    <span className={styles.shiftTriggerNoData}>Duty On/Off Data Not Available</span>
                ) : activeEvent ? (
                    <>
                        <span className={styles.shiftTriggerStatusLabel}>Working</span>
                        <span className={styles.shiftTriggerLivePill}>
                            <span className={styles.shiftTriggerLiveDot} />
                            Live
                        </span>
                    </>
                ) : allDone ? (
                    <>
                        <span className={styles.shiftTriggerStatusLabel}>Shift Ended</span>
                        <span className={styles.shiftTriggerTimeRange}>
                            {dutyOnEvent?.time} → {dutyOffEvent?.time}
                        </span>
                    </>
                ) : (
                    <>
                        <span className={styles.shiftTriggerStatusLabel}>On Duty</span>
                        <span className={styles.shiftTriggerTimeRange}>{dutyOnEvent?.time}</span>
                    </>
                )}
            </div>

            {/* ── View arrow ── */}
            <span className={styles.shiftTriggerCta}>
                View
                <ChevronRight size={13} />
            </span>
        </button>
    );
};

export default ShiftTimelineTrigger;
