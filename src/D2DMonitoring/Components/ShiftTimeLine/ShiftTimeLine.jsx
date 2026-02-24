import React, { useEffect } from 'react';
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import { AlertCircle, Check, Clock } from 'lucide-react';
import { getWardDutyOnTimeFromDB } from '../../Services/D2DMonitoringDutyIn';

const ShiftTimeLine = ({ events, activeConnectorIndex = -1 }) => {
    useEffect(() => {
        getWardDutyOnTimeFromDB();
    }, [])
    return (
        <div className={styles.shiftTimelineCard}>
            <div className={styles.shiftTimelineTrack}>
                {events.map((event, index) => (
                    <React.Fragment key={event.key}>
                        <div className={styles.shiftEvent}>
                            <div className={`${styles.shiftEventLabel} ${event.status === "active" ? styles.shiftEventLabelActive : ""}`}>{event.label}</div>
                            <div className={`${styles.shiftEventIconWrap} ${styles[`shiftEventIcon${event.status.charAt(0).toUpperCase() + event.status.slice(1)}`]}`}>
                                {event.status === "completed" ? <Check size={14} /> : event.status === "active" ? <Clock size={14} /> : <AlertCircle size={14} />}
                            </div>
                            <div className={`${styles.shiftEventTime} ${event.status === "pending" ? styles.shiftEventTimePending : ""} ${event.isLive ? styles.shiftEventTimeLive : ""}`}>{event.time}</div>
                        </div>
                        {index < events.length - 1 && (
                            <div className={`${styles.shiftEventConnector} ${index < activeConnectorIndex ? styles.shiftEventConnectorCompleted : index === activeConnectorIndex ? styles.shiftEventConnectorActive : styles.shiftEventConnectorPending}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default ShiftTimeLine