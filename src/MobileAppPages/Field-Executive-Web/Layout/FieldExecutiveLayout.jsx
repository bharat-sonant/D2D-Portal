import React from 'react';
import { CommonProvider } from '../Context/CommonContext/CommonContext';


const FieldExecutiveLayout = ({ children }) => {
    return (
        <CommonProvider>
       
                {/* Field Executive Specific Header/Layout */}
                <div style={{ paddingTop: "0px" }}>
                    {children}
                </div>
           
        </CommonProvider>
    );
};

export default FieldExecutiveLayout;
