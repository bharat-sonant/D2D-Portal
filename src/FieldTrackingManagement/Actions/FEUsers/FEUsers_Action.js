import api from '../../../api/api';
import * as common from '../../../common/common';
import { getFEAppLoginCredentialMailContent } from '../../../common/emailHTMLTemplates/MailTemplates';


export const fetchEmpDetail = async (empId, setEmpData, setIsLoading, setIsFetched) => {
    if (!empId) return;

    setIsLoading(true);
    setIsFetched(false);

    try {
        let response = await api.post(`/fe-users/employee-details`, { "employeeCode": empId });

        if (response.status === 'success') {
            // Saara data yahin set ho raha hai
            setEmpData({
                name: response.data.name || "---",
                email: response.data.email || "---"
            });
            setIsFetched(true);
        } else {
            setEmpData({ name: "", email: "" });
            common.setAlertMessage("error", "Employee not found!");
        }
    } catch (error) {
        setEmpData({ name: "", email: "" });
        common.setAlertMessage("error", "Failed to fetch employee details!");
    } finally {
        setIsLoading(false);
    }
};

const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let str = "";
    for (let i = 0; i < 3; i++) str += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 3; i++) str += nums.charAt(Math.floor(Math.random() * nums.length));
    return str; // Example: "KJG482"
};

// Action: Create FE App User and Update Locally
export const createFEAppUser = async (empCode, empData, setIsLoading, closeModal, updateListLocally) => {
    try {
        setIsLoading(true);
        const password = generateRandomPassword(); // Aapka existing utility function
        const mailTemplate = await getFEAppLoginCredentialMailContent();

        const payload = {
            employeeCode: empCode,
            userName: empCode,
            password: password,
            name: empData.name,
            email: empData.email,
            mailTemplate: mailTemplate,
            createdBy: localStorage.getItem('userId') || 'system'
        };

        const response = await api.post(`/fe-users/app-access`, payload);

        if (response.status === 'success') {
            // ✅ Yahan hum backend data ko wahi keys de rahe hain jo getFEUsersList mein hain
            const newUserFormatted = {
                id: response.data.employee_code,
                code: response.data.employee_code,
                name: empData.name, // Fetch se aaya hua name
                email: empData.email, // Fetch se aaya hua email
                site: 'No site assigned',
                lastLogin: 'Not Logged In',
                status: 'Active'
            };

            common.setAlertMessage("success", response.message || "Access created successfully");

            // ✅ Local list update (FEUsers.js ki state update hogi)
            if (updateListLocally) updateListLocally(newUserFormatted);

            // ✅ Modal close
            if (closeModal) closeModal();
        } else {
            common.setAlertMessage("error", response.message || "Failed to save access");
        }
    } catch (error) {
        common.setAlertMessage("error", "Server error while creating access!");
    } finally {
        setIsLoading(false);
    }
};

// 1️⃣ FE Users List fetching with Filtering logic
export const getFEUsersList = async (setFEUsersList, setIsLoading, allowedSitesData) => {
    try {
        setIsLoading(true);

        // Allowed sites object array se sirf IDs ka array banana
        const allowedSiteIds = Array.isArray(allowedSitesData)
            ? allowedSitesData.map(s => s.siteId)
            : [];

        // 🔄 Change: GET ki jagah POST use kar rahe hain filtering ke liye
        const response = await api.post(`/fe-users/fe-users-list`, {
            managerId: localStorage.getItem('userId') || "",
            allowedSites: allowedSiteIds // [91, 93, 78, ...]
        });


        if (response.status === 'success') {
            const mappedData = response.data.map(user => ({
                id: user.employeeCode,
                code: user.employeeCode,
                name: user.employeeName,
                email: user.email,
                site: user.assignedSite === '-' ? 'No site assigned' : user.assignedSite,
                lastLogin: user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Not Logged In',
                status: user.status === "ACTIVE" ? 'Active' : 'InActive'
            }));
            setFEUsersList(mappedData);
        }
    } catch (error) {
        // console.error("List Fetch Error:", error);
        // common.setAlertMessage("error", "Server error while fetching FE Users list!");
        setIsLoading(false);
    } finally {
        setIsLoading(false);
    }
};

// 2️⃣ Allowed Sites Fetching (Existing is mostly fine, just adding safety)
export const getAllowedSites = async (setAllowedSites) => {
    try {
        let response = await api.post(`/fe-users/allowed-sites`, {
            "managerId": localStorage.getItem('userId') || ""
        });

        if (response.status === 'success' && Array.isArray(response.data)) {
            // Status check is already done by backend usually, but adding for safety
            const activeSites = response.data.filter(site => site.status === 'active');
            setAllowedSites(activeSites);

            // Note: Iske baad hi getFEUsersList call honi chahiye with this data
            return activeSites;
        } else {
            setAllowedSites([]);
            return [];
        }
    } catch (error) {
        console.error("Fetch Sites Error:", error);
        setAllowedSites([]);
        return [];
    }
};
export const updateFEUserStatus = async (employeeCode, currentStatus, setUserList) => {
    try {
        // Backend 'ACTIVE'/'INACTIVE' expect kar raha hai
        const newStatus = currentStatus === 'Active' ? 'InActive' : 'Active';
        const apiStatus = newStatus.toUpperCase();

        // API Call (Backend changeFEStatus method ko hit karega)
        let response = await api.patch(`/fe-users/change-status`, {
            employeeCode: employeeCode,
            status: apiStatus
        });

        if (response.status === 'success') {
            // ✅ Local state update (Locally update in list)
            setUserList(prevList =>
                prevList.map(user =>
                    user.code === employeeCode
                        ? { ...user, status: newStatus }
                        : user
                )
            );

            common.setAlertMessage("success", response.message || `User status updated!`);
        } else {
            common.setAlertMessage("error", response.message || "Failed to update status");
        }
    } catch (error) {
        common.setAlertMessage("error", "Server error while updating status");
    }
};


export const assignSiteToUser = async (dto, setUserList) => {
    try {

        // API Call to your backend endpoint
        // DTO contains: { employeeCode, cityId, assignedBy, siteName }
        let response = await api.post(`/fe-users/assign-site`, {
            employeeCode: dto.employeeCode,
            siteId: dto.siteId,
            assignedBy: dto.assignedBy || 'N/A'
        });

        if (response.status === 'success') {
            // ✅ Local state update: hum cityId nahi, balki siteName update karenge UI ke liye
            setUserList(prevList =>
                prevList.map(user =>
                    user.code === dto.employeeCode
                        ? { ...user, site: dto.siteName }
                        : user
                )
            );

            common.setAlertMessage("success", response.message || "Site assigned successfully!");
            return true;
        } else {
            common.setAlertMessage("error", response.message || "Failed to assign site");
            return false;
        }
    } catch (error) {
        common.setAlertMessage("error", "Server error while assigning site");
        return false;
    }
};