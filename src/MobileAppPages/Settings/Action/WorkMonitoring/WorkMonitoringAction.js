import { setAlertMessage } from "../../../../common/common";
import { getWorkMonitoringValue, removeWorkMonitoringValue, saveWorkMonitoringValue } from "../../Services/WorkMonitoringViaWebService";

export const getWorkMonitoringKey = async (setIsWorkMonitoringOn) => {
    const response = await getWorkMonitoringValue();
    setIsWorkMonitoringOn(response.status === "success" && response.data.value === "yes");
};

export const toggleWorkMonitoring = async (props) => {
    const newValue = !props.isWorkMonitoringOn;
    props.setIsWorkMonitoringOn(newValue);

    const res = newValue ? await saveWorkMonitoringValue() : await removeWorkMonitoringValue();
    if (res?.status !== "success") {
        props.setIsWorkMonitoringOn(props.isWorkMonitoringOn);
        setAlertMessage("error", "Failed to update Work Monitoring");
    } else setAlertMessage("success", "Work Monitoring via web is updated successfully");
};