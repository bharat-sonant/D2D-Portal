import { setAlertMessage } from "../../../../common/common";
import { getValue, RemoveValue, saveValue } from "../../Services/DailyAssignmentViaWebService";
import { getWebviewUrl, saveWebviewUrl } from "../../Services/DailyAssignmentWebviewUrlService";

export const getDailyAssignmentKey = async (setIsAssignmentOn) => {
    const response = await getValue();
    setIsAssignmentOn(response.status === "success" && response.data.value === "yes");
};

export const getWebViewUrl = async (setWebviewUrl) => {
    const res = await getWebviewUrl();
    setWebviewUrl(res.status === "success" ? res.data.url : "");
};

export const saveDailyAssignmentUrl = async (props, setUrlError) => {
    setUrlError("");

    if (!props.webviewUrl.trim()) {
        setUrlError("URL cannot be empty");
        return;
    }

    const urlPattern = /^(http:\/\/|https:\/\/)[^\s]+$/;
    if (!urlPattern.test(props.webviewUrl.trim())) {
        setUrlError("Invalid URL format. Must start with http:// or https://");
        return;
    }

    const res = await saveWebviewUrl(props.webviewUrl.trim());
    if (res.status === "success") setAlertMessage("success", "Webview URL saved successfully!");
    else setAlertMessage("error", "Failed to save Webview URL");
};

export const toggleAssignment = async (props) => {
    const newValue = !props.isAssignmentOn;
    props.setIsAssignmentOn(newValue);

    const res = newValue ? await saveValue() : await RemoveValue();
    if (res?.status !== "success") {
        props.setIsAssignmentOn(props.isAssignmentOn);
        setAlertMessage("error", "Failed to update Daily Assignment");
    } else setAlertMessage("success", "Daily Assignment via web is updated successfully.");
};
