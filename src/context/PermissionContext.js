import  { createContext, useContext, useState } from "react";


const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
    const [permissionGranted, setPermissionGranted] = useState({})
    
    return (
        <PermissionContext.Provider
            value={{
                permissionGranted,
                setPermissionGranted,   
            }}
        >
            {children}
        </PermissionContext.Provider>
    )
}

export const usePermissions = () => {
    return useContext(PermissionContext);
};

