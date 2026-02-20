import WelcomeMessage from '../../Components/Dashboard/WelcomeMessage';
import style from '../../../assets/css/Dashboard/Dashboard.module.css'
import d2dStyle from '../../../assets/css/D2DMonitoring/Dashboard/D2DMonitoringDashboard.module.css';

const D2DMonitoringDashboard = () => {
  return (
    <>
      <div className={d2dStyle.dashboardHeader}>
         <h1 className={d2dStyle.dashboardTitle}>D2D Monitoring</h1>
        <p className={d2dStyle.dashboardSubtitle}>
          Track field activity, monitor team performance, and review live updates.
        </p>
     </div>
       <div className={`${style.dashboardPage} ${d2dStyle.dashboardPage}`}>
        <div className={`${style.dashboardLeft} ${d2dStyle.dashboardLeft}`}>
         <WelcomeMessage />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3"></div>
      </div>
      <div className={style.birthdayContainer}></div>
    </>
  )
}

export default D2DMonitoringDashboard;