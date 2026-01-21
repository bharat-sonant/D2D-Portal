import React from "react";
import EmployeeTopbar from "./EmployeeTopbar";

const EmployeeLayout = ({ children }) => {
    return (
        <>
            <EmployeeTopbar />
            <div style={{ paddingTop: "60px" }}>
                {children}
            </div>
        </>
    );
};

export default EmployeeLayout;
