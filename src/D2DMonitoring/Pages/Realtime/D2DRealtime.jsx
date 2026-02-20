import d2dStyle from '../../../assets/css/D2DMonitoring/Dashboard/D2DMonitoringDashboard.module.css';

const D2DRealtime = () => {
    return (
        <div className={d2dStyle.dashboardHeader}>
            <h1 className={d2dStyle.dashboardTitle}>Realtime</h1>
            <p className={d2dStyle.dashboardSubtitle}>
                Track field activity, monitor team performance, and review live updates.
            </p>
        </div>

    )
}

export default D2DRealtime