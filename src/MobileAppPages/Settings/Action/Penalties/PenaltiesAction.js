import { setAlertMessage } from "../../../../common/common";
import { getPaneltiesValue, RemovePaneltiesValue, savePaneltiesValue } from "../../Services/PaneltiesViaWebServise";

export const getPenaltiesKey = async (setIsPenaltiesOn) => {
    const response = await getPaneltiesValue();
    setIsPenaltiesOn(response.status === "success" && response.data.value === "yes");
};

export const togglePenalties = async (props) => {
    const newValue = !props.isPenaltiesOn;
    props.setIsPenaltiesOn(newValue);

    const res = newValue ? await savePaneltiesValue() : await RemovePaneltiesValue();
    if (res?.status !== "success") {
        props.setIsPenaltiesOn(props.isPenaltiesOn);
        setAlertMessage("error", "Failed to update Penalties");
    } else setAlertMessage("success", "Penalties via web is updated successfully");
};