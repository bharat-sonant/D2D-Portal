import React from 'react';
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { AlertCircle, Check, Clock } from 'lucide-react';

const CLICKABLE_KEYS = new Set(["dutyOn", "dutyOff"]);

const ShiftTimeLine = ({ events, activeConnectorIndex = -1, onEventClick }) => {
    return (
        <div className={styles.shiftTimelineCard}>
            <div className={styles.shiftTimelineTrack}>
                {events.map((event, index) => {
                    const isClickable = CLICKABLE_KEYS.has(event.key) && !!onEventClick;
                    return (
                        <React.Fragment key={event.key}>
                            <div
                                className={`${styles.shiftEvent} ${isClickable ? styles.shiftEventClickable : ""}`}
                                onClick={isClickable ? () => onEventClick(event) : undefined}
                                title={isClickable ? `Open ${event.label} details` : undefined}
                            >
                                <div className={`${styles.shiftEventLabel} ${event.status === "active" ? styles.shiftEventLabelActive : ""}`}>
                                    {event.label}
                                </div>
                                <div className={`${styles.shiftEventIconWrap} ${styles[`shiftEventIcon${event.status.charAt(0).toUpperCase() + event.status.slice(1)}`]} ${isClickable ? styles.shiftEventIconClickable : ""}`}>
                                    {event.status === "completed" ? <Check size={14} /> : event.status === "active" ? <Clock size={14} /> : <AlertCircle size={14} />}
                                    {isClickable && <span className={styles.shiftEventRipple} />}
                                </div>
                                <div className={`${styles.shiftEventTime} ${event.status === "pending" ? styles.shiftEventTimePending : ""} ${event.isLive ? styles.shiftEventTimeLive : ""}`}>
                                    {event.time}
                                    {isClickable && <span className={styles.shiftEventArrow}>›</span>}
                                </div>
                            </div>
                            {index < events.length - 1 && (
                                <div className={`${styles.shiftEventConnector} ${index < activeConnectorIndex ? styles.shiftEventConnectorCompleted : index === activeConnectorIndex ? styles.shiftEventConnectorActive : styles.shiftEventConnectorPending}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ShiftTimeLine;
