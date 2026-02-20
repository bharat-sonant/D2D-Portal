import WelcomeMessage from '../../Components/Dashboard/WelcomeMessage';
import style from '../../../assets/css/Dashboard/Dashboard.module.css';

const D2DMonitoringDashboard = () => {
  return (
    <>
      <div className={`${style.dashboardPage}`}>
        <div className={`${style.dashboardLeft}`}>
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

export default D2DMonitoringDashboard