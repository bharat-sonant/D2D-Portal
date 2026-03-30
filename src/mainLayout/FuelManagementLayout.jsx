import React from 'react'
import FuelManagementTopbar from './FuelManagementTopbar'

const FuelManagementLayout = ({children}) => {
  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <FuelManagementTopbar />
      <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {children}
      </div>
            {/* <>
            {children}
            </> */}
    </div>
  )
}

export default FuelManagementLayout
