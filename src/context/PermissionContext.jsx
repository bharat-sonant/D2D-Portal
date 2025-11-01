import  { createContext, useContext, useEffect, useRef, useState } from "react";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
    const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(false);
    const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
    const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] = useState(false);
    const [showUpdateNotification,setShowUpdateNotification]=useState(false)
    const [isHolidayPermissionGranted, setIsHolidayPermissionGranted] = useState({})
    const [ownerStatus, setOwnerStatus] = useState("");
    const [openAddMainTask,setOpenMainTask]=useState(false)
    /*This state is used for get all permission */
    const [permissionGranted, setPermissionGranted] = useState({})
    const [loading, setLoading] = useState(false);
    const [isUserActive, setIsUserActive] = useState('');
    const ref = useRef(null);
    let company = localStorage.getItem("company")
    let empCode = localStorage.getItem("empCode")
    return (
        <PermissionContext.Provider
            value={{
                isLocationPermissionGranted,
                setIsLocationPermissionGranted,
                isCameraPermissionGranted,
                setIsCameraPermissionGranted,
                isUserActive,
                setIsUserActive,
                isHolidayPermissionGranted,
                setIsHolidayPermissionGranted,
                permissionGranted,
                setPermissionGranted,
                ref,
                empCode,
                loading,
                setLoading,
                ownerStatus, 
                setOwnerStatus,
                openAddMainTask,
                setOpenMainTask,
                setIsNotificationPermissionGranted,
                isNotificationPermissionGranted,
                showUpdateNotification,
                setShowUpdateNotification
            }}
        >
            {children}
        </PermissionContext.Provider>
    )
}

export const usePermissions = () => {
    return useContext(PermissionContext);
};

