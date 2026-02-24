import D2DMonitoringSidebar from './D2DMonitoringTopbar';
import D2DMonitoringStaticTopbar from './D2DMonitoringStaticTopbar';
import styles from '../../assets/css/D2DMonitoring/MonitoringLayout/MonitoringLayout.module.css';

const D2DMonitoringLayout = ({ children }) => {
  return (
    <div className={styles.appContainer}>
         <div className={styles.containerLeft}>
         <D2DMonitoringSidebar />
         </div>
      <main className={styles.mainLayout}>
     
      <D2DMonitoringStaticTopbar />
        <div className={styles.mainContent}>{children}</div>
      </main>
    </div>
  );
}

export default D2DMonitoringLayout
