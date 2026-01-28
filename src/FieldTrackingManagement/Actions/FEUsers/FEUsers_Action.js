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

// feUsersActions.js mein ye change karein
export const getFEUsersList = async (setFEUsersList, setIsLoading) => {
    try {
        setIsLoading(true);
        const response = await api.get(`/fe-users/fe-users-list`);
        console.log('response', response);
        if (response.status === 'success') {
            // Backend keys ko frontend keys ke saath map kar rahe hain
            const mappedData = response.data.map(user => ({
                id: user.employeeCode, // Unique ID ke liye code use kar sakte hain
                code: user.employeeCode,
                name: user.employeeName,
                email: user.email,
                site: user.assignedSite === '-' ? 'No site assigned' : user.assignedSite,
                lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not Logged In',
                status: user.status === "ACTIVE" ? 'Active' : 'InActive' // DB case sensitivity handle karne ke liye
            }));
            setFEUsersList(mappedData);
        } else {
            common.setAlertMessage("error", response.message || "Failed to fetch list");
        }
    } catch (error) {
        common.setAlertMessage("error", "Server error while fetching FE Users list!");
    } finally {
        setIsLoading(false);
    }
};

export const getAllowedSites = async (setAllowedSites) => {
    try {
        let response = await api.post(`/fe-users/allowed-sites`, { "managerId": localStorage.getItem('userId') || "" });
        if (response.status === 'success') {
            setAllowedSites(response.data);
        }
        else {
            setAllowedSites([]);
        }
    } catch (error) {
        setAllowedSites([]);
        common.setAlertMessage("error", "Failed to fetch allowed sites !");
    }
};
export const updateFEUserStatus = async (employeeCode, currentStatus, setUserList) => {
    try {
        // Backend 'ACTIVE'/'INACTIVE' expect kar raha hai
        const newStatus = currentStatus === 'Active' ? 'InActive' : 'Active';
        const apiStatus =  newStatus.toUpperCase(); 

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