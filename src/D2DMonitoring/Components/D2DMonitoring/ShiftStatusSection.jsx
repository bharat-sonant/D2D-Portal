import React from "react";
import styles from "../../Pages/D2DRealtime/Realtime.module.css";
import ShiftTimeLine from "../ShiftTimeLine/ShiftTimeLine";

const ShiftStatusSection = ({ events, activeConnectorIndex, onEventClick }) => {
    return (
        <div className={styles.timingGrid}>
            <ShiftTimeLine
                events={events}
                activeConnectorIndex={activeConnectorIndex}
                onEventClick={onEventClick}
            />
        </div>
    );
};

export default ShiftStatusSection;
