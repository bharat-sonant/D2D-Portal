import { Clock } from "lucide-react";
import MonitoringCard from "./Common/MonitoringCard/MonitoringCard";
import ShiftTimelineTrigger from "../ShiftTimeLine/ShiftTimelineTrigger";

const ShiftStatusSection = ({ events, onOpenTimeline, embedded = false }) => {
    if (embedded) {
        return <ShiftTimelineTrigger events={events} onOpen={onOpenTimeline} />;
    }

    return (
        <MonitoringCard title="Shift Timeline" icon={<Clock size={16} />}>
            <ShiftTimelineTrigger events={events} onOpen={onOpenTimeline} />
        </MonitoringCard>
    );
};

export default ShiftStatusSection;
