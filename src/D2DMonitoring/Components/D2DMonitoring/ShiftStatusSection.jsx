import { Clock } from "lucide-react";
import ShiftTimeLine from "../ShiftTimeLine/ShiftTimeLine";
import MonitoringCard from "./Common/MonitoringCard/MonitoringCard";

const ShiftStatusSection = ({ events, activeConnectorIndex, onEventClick }) => {
    return (
        <MonitoringCard title="Shift Timeline" icon={<Clock size={16} />}>
            <ShiftTimeLine
                events={events}
                activeConnectorIndex={activeConnectorIndex}
                onEventClick={onEventClick}
            />
        </MonitoringCard>
    );
};

export default ShiftStatusSection;
