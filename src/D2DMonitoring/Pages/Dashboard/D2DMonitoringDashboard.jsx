import WelcomeMessage from '../../Components/Dashboard/WelcomeMessage';
import style from '../../../assets/css/Dashboard/Dashboard.module.css'
import d2dStyle from '../../../assets/css/D2DMonitoring/Dashboard/D2DMonitoringDashboard.module.css';

const D2DMonitoringDashboard = () => {
  return (
    <div className={`${style.dashboardPage} ${d2dStyle.dashboardPage}`}>
      <div className={`${style.dashboardLeft} ${d2dStyle.dashboardLeft}`}>
        <WelcomeMessage />
      </div>
    </div>
  )
}

export default D2DMonitoringDashboard;
