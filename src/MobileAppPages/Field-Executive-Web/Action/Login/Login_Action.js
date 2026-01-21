// Static Data
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
export const performLoginValidation = (credentials, setErrors, setIsLoading, navigate, showToast) => {
    // Trim values to handle whitespace-only entries
    const userId = credentials.userId ? credentials.userId.trim() : "";
    const password = credentials.password ? credentials.password.trim() : "";

    // 1. Check for both fields empty
    if (!userId && !password) {
        setErrors({ auth: "Please enter your User ID and Password" });
        setIsLoading(false);
        return;
    }

    // 2. Check for User ID empty
    if (!userId) {
        setErrors({ auth: "User ID is required to login" });
        setIsLoading(false);
        return;
    }

    // 3. Check for Password empty
    if (!password) {
        setErrors({ auth: "Please enter your password" });
        setIsLoading(false);
        return;
    }

    // 4. If validation passes, proceed to login logic
    setTimeout(() => {
        if (userId === "JAI101" && password === "101") {
            // Success logic...
            localStorage.setItem("isLoggedIn", "true");
            showToast("Login successful!", "success");
            navigate('/fe-WebView/dashboard');
        } else {
            setErrors({ auth: "Invalid User ID or Password. Please try again." });
            setIsLoading(false);
        }
    }, 1500);
};