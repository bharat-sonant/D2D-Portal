import React from 'react'
import FE_TopBar from '../Components/FE_TopBar/FE_TopBar';

const FE_Layout = ({ children }) => {
   return (
        <>
            <FE_TopBar />
            <div style={{ paddingTop: "60px" }}>
                {children}
            </div>
        </>
    );
}

export default FE_Layout
