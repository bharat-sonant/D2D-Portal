import React from 'react'
import FuelManagementTopbar from './FuelManagementTopbar'

const FuelManagementLayout = ({children}) => {
  return (
    <div>
      {/* <FuelManagementTopbar /> */}
            {/* <div style={{ paddingTop: "60px" }}>
                {children}
            </div> */}
            <>
            {children}
            </>
    </div>
  )
}

export default FuelManagementLayout
