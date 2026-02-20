import React from "react";
import d2dStyle from '../../../assets/css/D2DMonitoring/Dashboard/D2DMonitoringDashboard.module.css';
import MonitoringList from "../../Components/D2DMonitoring/MonitoringList";

const D2DMonitoring = () => {
    return (
        <div className={d2dStyle.monitoringPage}>
            <div className={d2dStyle.dashboardHeader}>
                <h1 className={d2dStyle.dashboardTitle}>Monitoring</h1>
                <p className={d2dStyle.dashboardSubtitle}>
                    
                </p>
            </div>
            <MonitoringList />
        </div>
    );
};

export default D2DMonitoring;