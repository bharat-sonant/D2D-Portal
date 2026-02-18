import React from "react";
import EmployeeTopbar from "./EmployeeTopbar";

const EmployeeLayout = ({ children }) => {
    return (
        <>
            <EmployeeTopbar />
            <div>
                {children}
            </div>
        </>
    );
};

export default EmployeeLayout;
