// Static Data
import api from '../../../../api/api'
export const staticAdminData = {
    id: "115",
    designation: "Administrator",
    empCode: "DEV115",
    name: "Admin",
    role: "SuperAdmin"
};

/**
 * User ID ko Capitalize aur Filter karne ke liye (A-Z, 0-9 only)
 */
export const formatUserId = (value) => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

/**
 * Login Validation Logic with Professional Messaging
 */


export const performLoginValidation = async (credentials, setErrors, setIsLoading, navigate, showToast) => {
    const userId = credentials.userId?.trim() || "";
    const password = credentials.password?.trim() || "";
    setErrors({})
    if (!userId || !password) {
        setErrors({ auth: "Please enter both User ID and Password" });
        setIsLoading(false);
        return;
    }

    try {
        setIsLoading(true);
        
        const response = await api.post('/fe-users/fe-login', {
            userName: userId,
            password: password
        });

        if (response.status === 'success') {
            const userData = response.data;

            // 🔴 Control: Check if site is assigned
            if (!userData.siteAssigned) {
                setErrors({ auth: "Access Denied: No Site Assigned. Please contact admin." });
                setIsLoading(false);
                return; // Yahan se return ho jayenge, navigate nahi karenge
            }

            // ✅ If site is assigned, proceed to login
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("fe_user", JSON.stringify(userData));
            
            showToast(response.message || "Login successful!", "success");
            navigate('/fe-WebView/dashboard');
        } else {
            setErrors({ auth: response.message || "Invalid credentials" });
        }
    } catch (error) {
        // Mobile WebView connection error handle karne ke liye
        console.error("Login Error:", error);
        showToast("Login service unavailable. Check your connection.", "error");
    } finally {
        setIsLoading(false);
    }
};