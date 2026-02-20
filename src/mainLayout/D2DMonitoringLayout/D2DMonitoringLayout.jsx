import D2DMonitoringTopbar from './D2DMonitoringTopbar'

const D2DMonitoringLayout = ({ children }) => {
    return (
        <>
            <D2DMonitoringTopbar />
            <div>
                {children}
            </div>
        </>
    )
}

export default D2DMonitoringLayout